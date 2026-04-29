const express = require('express');
const crypto = require('crypto');
const { get, run } = require('../db');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await run('INSERT INTO users (id, balance, created_at) VALUES (?, 1000, ?)', [id, createdAt]);

    res.status(201).json({
      userId: id,
      balance: 1000,
      createdAt
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:userId/balance', async (req, res, next) => {
  try {
    const user = await get('SELECT id, balance, created_at FROM users WHERE id = ?', [req.params.userId]);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      userId: user.id,
      balance: user.balance,
      createdAt: user.created_at
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/reset', async (req, res, next) => {
  try {
    const result = await run('UPDATE users SET balance = 1000 WHERE id = ?', [req.params.userId]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      userId: req.params.userId,
      balance: 1000
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
