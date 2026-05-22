const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { getDb } = require('../config/database');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      const id = Math.random().toString(36).slice(2, 10);
      await pool.query('INSERT INTO wallets (id, user_id) VALUES ($1, $2)', [id, req.userId]);
      result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [req.userId]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/transactions', auth, async (req, res) => {
  try {
    const wallet = await pool.query('SELECT id FROM wallets WHERE user_id = $1', [req.userId]);
    if (wallet.rows.length === 0) return res.json([]);
    const result = await pool.query('SELECT * FROM wallet_transactions WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT 50', [wallet.rows[0].id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/withdrawals', auth, async (req, res) => {
  try {
    const db = getDb();
    const result = db.transaction(() => {
      const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.userId);
      if (!wallet || parseFloat(wallet.balance) < parseFloat(req.body.amount)) {
        throw { status: 400, msg: 'Insufficient balance' };
      }

      db.prepare('UPDATE wallets SET balance = balance - ? WHERE user_id = ?').run(req.body.amount, req.userId);
      const id = Math.random().toString(36).slice(2, 10);
      db.prepare(`INSERT INTO withdrawals (id, user_id, amount, wallet_type, wallet_number, wallet_name)
        VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id, req.userId, req.body.amount, req.body.wallet_type, req.body.wallet_number, req.body.wallet_name);
      return { id, message: 'Withdrawal requested' };
    })();

    res.status(201).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.msg });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/withdrawals', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
