const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { auth } = require('../middleware/auth');

router.get('/:transactionId', auth, async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND (client_id = $2 OR provider_id = $2)',
      [req.params.transactionId, req.userId]
    );
    if (check.rows.length === 0) return res.status(403).json({ error: 'Not authorized' });

    const result = await pool.query(
      `SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id
       WHERE m.transaction_id = $1 ORDER BY m.created_at ASC`,
      [req.params.transactionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
