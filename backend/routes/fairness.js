const express = require('express');
const { BLOCK_HASH_RE } = require('../bitcoin');
const { computeFinalHash, getGameResult, validateGuess } = require('../fairness');

const router = express.Router();
const VALID_GAMES = new Set(['hex', 'parity', 'coin']);

router.post('/verify', (req, res, next) => {
  try {
    const betId = String(req.body.betId || '').trim();
    const blockHash = String(req.body.blockHash || '').trim().toLowerCase();
    const serverSeed = String(req.body.serverSeed || '').trim();
    const gameType = String(req.body.gameType || '').trim().toLowerCase();
    const guess = String(req.body.guess || '').trim().toLowerCase();

    if (!betId || !serverSeed || !VALID_GAMES.has(gameType)) {
      res.status(400).json({ error: 'Missing or invalid fields' });
      return;
    }

    if (!BLOCK_HASH_RE.test(blockHash)) {
      res.status(400).json({ error: 'blockHash must be 64 hex characters' });
      return;
    }

    if (!validateGuess(gameType, guess)) {
      res.status(400).json({ error: 'Invalid guess for game type' });
      return;
    }

    const finalHash = computeFinalHash(blockHash, serverSeed, betId);
    const result = getGameResult(finalHash, gameType, guess);

    res.json({
      finalHash,
      actual: result.actual,
      won: result.won,
      multiplier: result.multiplier,
      blockHash,
      serverSeed,
      betId,
      gameType,
      guess
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
