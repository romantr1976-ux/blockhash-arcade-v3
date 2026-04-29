const express = require('express');
const { all } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT
         users.id,
         users.balance,
         COUNT(bets.id) AS totalBets,
         SUM(CASE WHEN bets.status = 'won' THEN 1 ELSE 0 END) AS wins,
         SUM(CASE WHEN bets.status = 'lost' THEN 1 ELSE 0 END) AS losses
       FROM users
       LEFT JOIN bets ON bets.user_id = users.id
       GROUP BY users.id
       ORDER BY (users.balance - 1000) DESC, users.balance DESC
       LIMIT 20`
    );

    res.json({
      leaderboard: rows.map((row) => ({
        userId: row.id.slice(0, 8),
        balance: row.balance,
        totalBets: row.totalBets || 0,
        wins: row.wins || 0,
        losses: row.losses || 0,
        profit: row.balance - 1000
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
