const admin = require('firebase-admin');
const path = require('path');
const pool = require('../config/database').pool;

try {
  const keyPath = path.join(__dirname, '..', 'firebase-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(keyPath),
  });
  console.log('Firebase initialized');
} catch (err) {
  console.log('Firebase init skipped:', err.message);
}

async function sendPush(userId, title, body) {
  try {
    const devices = await pool.query('SELECT fcm_token FROM user_devices WHERE user_id = $1', [userId]);
    for (const device of devices.rows) {
      if (!device.fcm_token) continue;
      await admin.messaging().send({
        token: device.fcm_token,
        notification: { title, body },
        webpush: { fcmOptions: { link: '/' } },
      });
    }
  } catch (err) {
    if (err.code !== 'messaging/registration-token-not-registered') {
      console.error('FCM error:', err.message);
    }
  }
}

module.exports = { sendPush };
