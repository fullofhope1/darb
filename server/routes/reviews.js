const express = require('express');
const router = express.Router();
const { query, getDb, transaction } = require('../config/database');
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { transaction_id, reviewee_id, rating, comment } = req.body;

    const txnCheck = await query(
      'SELECT * FROM transactions WHERE id = $1 AND (client_id = $2 OR provider_id = $2) AND status = $3',
      [transaction_id, req.userId, 'completed']
    );
    if (txnCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Cannot review this transaction' });
    }

    const db = getDb();
    db.transaction(() => {
      const id = Math.random().toString(36).slice(2, 10);
      db.prepare('INSERT INTO reviews (id, transaction_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)')
        .run(id, transaction_id, req.userId, reviewee_id, rating, comment);
      db.prepare("UPDATE users SET rating = (SELECT ROUND(AVG(CAST(rating AS REAL)), 1) FROM reviews WHERE reviewee_id = ?) WHERE id = ?")
        .run(reviewee_id, reviewee_id);
    })();

    const result = await query('SELECT * FROM reviews WHERE transaction_id = $1 AND reviewer_id = $2', [transaction_id, req.userId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Already reviewed this transaction' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, u.name as reviewer_name, u.avatar_url
       FROM reviews r JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewee_id = $1 ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
