const express = require('express');
const crypto = require('crypto');
const { all, db, get, run } = require('../db');
const { getBlockHash, getCurrentHeight } = require('../bitcoin');
const {
  computeFinalHash,
  generateServerSeed,
  getGameResult,
  hashServerSeed,
  validateGuess
} = require('../fairness');

const router = express.Router();
const VALID_GAMES = new Set(['hex', 'parity', 'coin']);
const MAX_PENDING = Number(process.env.MAX_PENDING_BETS || 3);

let isResolving = false;
let resolveTimer = null;

function beginTransaction() {
  return run('BEGIN IMMEDIATE TRANSACTION');
}

function normalizeStake(value) {
  const stake = Number(value);
  return Number.isInteger(stake) ? stake : NaN;
}

function publicBet(row) {
  return {
    id: row.id,
    userId: row.user_id,
    game_type: row.game_type,
    stake: row.stake,
    guess: row.guess,
    target_height: row.target_height,
    status: row.status,
    block_hash: row.block_hash,
    actual: row.actual,
    payout: row.payout,
    net_result: row.net_result,
    final_hash: row.final_hash,
    server_seed_hash: row.server_seed_hash,
    server_seed: row.status === 'pending' ? null : row.server_seed,
    created_at: row.created_at,
    resolved_at: row.resolved_at
  };
}

router.post('/create', async (req, res, next) => {
  const maxStake = Number.parseInt(process.env.MAX_STAKE || '500', 10);
  const maxPendingBets = MAX_PENDING;

  try {
    const userId = String(req.body.userId || '').trim();
    const gameType = String(req.body.gameType || '').trim().toLowerCase();
    const guess = String(req.body.guess || '').trim().toLowerCase();
    const stake = normalizeStake(req.body.stake);

    if (!userId || !VALID_GAMES.has(gameType) || !validateGuess(gameType, guess)) {
      res.status(400).json({ error: 'Invalid bet fields' });
      return;
    }

    if (!Number.isInteger(stake) || stake < 1 || stake > maxStake) {
      res.status(400).json({ error: `Stake must be between 1 and ${maxStake}` });
      return;
    }

    const currentHeight = await getCurrentHeight();
    const targetHeight = currentHeight + 1;
    const betId = crypto.randomUUID();
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const createdAt = new Date().toISOString();

    await beginTransaction();

    try {
      const user = await get('SELECT id, balance FROM users WHERE id = ?', [userId]);

      if (!user) {
        await run('ROLLBACK');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.balance < stake) {
        await run('ROLLBACK');
        res.status(400).json({ error: 'Insufficient balance' });
        return;
      }

      const pending = await get(
        'SELECT COUNT(*) AS count FROM bets WHERE user_id = ? AND status = ?',
        [userId, 'pending']
      );

      if (pending.count >= maxPendingBets) {
        await run('ROLLBACK');
        res.status(429).json({ error: `Maximum pending bets reached (${maxPendingBets})` });
        return;
      }

      await run('UPDATE users SET balance = balance - ? WHERE id = ?', [stake, userId]);
      await run(
        `INSERT INTO bets (
          id, user_id, game_type, stake, guess, target_height, status, server_seed,
          server_seed_hash, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
        [betId, userId, gameType, stake, guess, targetHeight, serverSeed, serverSeedHash, createdAt]
      );
      await run('COMMIT');

      res.status(201).json({
        betId,
        status: 'pending',
        targetHeight,
        serverSeedHash,
        stake,
        guess
      });
    } catch (error) {
      await run('ROLLBACK').catch(() => {});
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

async function resolvePendingBets() {
  if (isResolving) {
    return 0;
  }

  isResolving = true;
  let resolvedCount = 0;

  try {
    const currentHeight = await getCurrentHeight();
    if (!currentHeight) {
      return 0;
    }

    const pendingBets = await all(
      'SELECT * FROM bets WHERE status = ? AND target_height <= ? ORDER BY created_at ASC',
      ['pending', currentHeight]
    );

    for (const bet of pendingBets) {
      let blockHash;

      try {
        blockHash = await getBlockHash(bet.target_height);
      } catch (error) {
        console.error(`Failed to fetch block hash for bet ${bet.id}:`, error.message);
        continue;
      }

      if (!bet.server_seed) {
        console.error(`Bet ${bet.id} missing server_seed`);
        continue;
      }

      const finalHash = computeFinalHash(blockHash, bet.server_seed, bet.id);
      const result = getGameResult(finalHash, bet.game_type, bet.guess);
      const payout = result.won ? bet.stake * result.multiplier : 0;
      const netResult = payout - bet.stake;
      const resolvedAt = new Date().toISOString();

      await beginTransaction();

      try {
        const updateResult = await run(
          `UPDATE bets
           SET status = ?, block_hash = ?, actual = ?, payout = ?, net_result = ?,
               final_hash = ?, resolved_at = ?
           WHERE id = ? AND status = 'pending'`,
          [
            result.won ? 'won' : 'lost',
            blockHash,
            result.actual,
            payout,
            netResult,
            finalHash,
            resolvedAt,
            bet.id
          ]
        );

        if (updateResult.changes === 0) {
          await run('ROLLBACK');
          continue;
        }

        if (result.won) {
          await run('UPDATE users SET balance = balance + ? WHERE id = ?', [payout, bet.user_id]);
        }

        await run('COMMIT');
        resolvedCount += 1;
      } catch (error) {
        await run('ROLLBACK').catch(() => {});
        console.error(`Failed to resolve bet ${bet.id}:`, error.message);
      }
    }

    return resolvedCount;
  } finally {
    isResolving = false;
  }
}

function startResolveInterval(intervalMs = 30000) {
  if (resolveTimer) {
    clearInterval(resolveTimer);
  }

  resolveTimer = setInterval(() => {
    resolvePendingBets().catch((error) => {
      console.error('Automatic bet resolution failed:', error.message);
    });
  }, intervalMs);

  return resolveTimer;
}

router.post('/resolve', async (req, res, next) => {
  try {
    const resolved = await resolvePendingBets();
    res.json({ resolved });
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const rows = await all(
      'SELECT * FROM bets WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [req.params.userId]
    );

    res.json({
      bets: rows.map(publicBet)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
module.exports.resolvePendingBets = resolvePendingBets;
module.exports.startResolveInterval = startResolveInterval;
module.exports._private = { db };
