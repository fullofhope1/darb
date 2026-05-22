const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { fcm_token, device_type } = req.body;
    await pool.query('DELETE FROM user_devices WHERE user_id = $1 AND fcm_token = $2', [req.userId, fcm_token]);
    await pool.query('INSERT INTO user_devices (id, user_id, fcm_token, device_type) VALUES ($1, $2, $3, $4)',
      [Math.random().toString(36).slice(2, 10), req.userId, fcm_token, device_type || 'web']);
    res.json({ message: 'Device registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
