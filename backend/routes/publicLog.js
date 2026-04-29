const express = require('express');
const { all } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT id, user_id, game_type, stake, guess, target_height, status, block_hash,
              actual, payout, net_result, final_hash, server_seed_hash, server_seed,
              created_at, resolved_at
       FROM bets
       WHERE status != 'pending'
       ORDER BY resolved_at DESC
       LIMIT 100`
    );

    res.json({
      bets: rows.map((row) => ({
        ...row,
        betId: row.id,
        userId: row.user_id ? row.user_id.slice(0, 8) : 'anonymous',
        user_id: undefined
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
