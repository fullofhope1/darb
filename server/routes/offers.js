const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { auth } = require('../middleware/auth');
const { notify } = require('../helpers/notify');

router.get('/:requestId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as user_name, u.avatar_url, u.rating as user_rating,
              u.city as user_city, u.completed_orders
       FROM offers o JOIN users u ON o.user_id = u.id
       WHERE o.request_id = $1 AND o.status != 'withdrawn'
       ORDER BY o.created_at DESC`,
      [req.params.requestId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:requestId', auth, async (req, res) => {
  try {
    const { price, duration, description } = req.body;
    const check = await pool.query('SELECT id, user_id FROM requests WHERE id = $1', [req.params.requestId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
    if (check.rows[0].user_id === req.userId) return res.status(400).json({ error: 'Cannot offer on your own request' });

    const result = await pool.query(
      `INSERT INTO offers (id, request_id, user_id, price, duration, description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [Math.random().toString(36).slice(2, 10), req.params.requestId, req.userId, price, duration, description]
    );

    const oId = result.rows[0]?.id || '';
    notify(check.rows[0].user_id, 'new_offer', 'عرض جديد', 'وصلتك عرض على طلبك', { request_id: req.params.requestId, offer_id: oId });

    const offer = await pool.query('SELECT * FROM offers WHERE id = $1', [oId]);
    res.status(201).json(offer.rows[0] || { id: oId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/accept', auth, async (req, res) => {
  try {
    const offer = await pool.query(
      `SELECT o.*, r.user_id as client_id FROM offers o
       JOIN requests r ON o.request_id = r.id
       WHERE o.id = $1`, [req.params.id]
    );
    if (offer.rows.length === 0) return res.status(404).json({ error: 'Offer not found' });
    if (offer.rows[0].client_id !== req.userId) return res.status(403).json({ error: 'Only the request owner can accept' });
    if (offer.rows[0].status !== 'pending') return res.status(400).json({ error: 'Offer already processed' });

    await pool.query('UPDATE offers SET status = $1 WHERE id = $2', ['accepted', req.params.id]);
    await pool.query('UPDATE offers SET status = $1 WHERE request_id = $2 AND id != $3', ['rejected', offer.rows[0].request_id, req.params.id]);
    await pool.query('UPDATE requests SET status = $1 WHERE id = $2', ['in_progress', offer.rows[0].request_id]);

    notify(offer.rows[0].user_id, 'offer_accepted', 'تم قبول عرضك', 'تم قبول عرضك على الطلب', { request_id: offer.rows[0].request_id });

    res.json({ message: 'Offer accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
