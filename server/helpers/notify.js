const pool = require('../config/database').pool;
const { sendPush } = require('./push');

async function notify(userId, type, title, body, data = null) {
  try {
    await pool.query(
      'INSERT INTO notifications (id, user_id, type, title, body, data) VALUES ($1, $2, $3, $4, $5, $6)',
      [Math.random().toString(36).slice(2, 10), userId, type, title, body, data ? JSON.stringify(data) : null]
    );
    sendPush(userId, title, body);
  } catch (err) {
    console.error('Notification error:', err.message);
  }
}

module.exports = { notify };
