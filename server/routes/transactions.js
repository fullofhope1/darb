const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { getDb, transaction } = require('../config/database');
const { auth } = require('../middleware/auth');
const { notify } = require('../helpers/notify');

router.post('/', auth, async (req, res) => {
  try {
    const { request_id, offer_id, service_id, amount, platform_fee, payment_type, milestones } = req.body;
    const offer = await pool.query('SELECT user_id FROM offers WHERE id = $1', [offer_id]);
    if (offer.rows.length === 0) return res.status(404).json({ error: 'Offer not found' });

    const total = parseFloat(amount) + parseFloat(platform_fee || 0);
    const id = Math.random().toString(36).slice(2, 10);
    await pool.query(
      `INSERT INTO transactions (id, request_id, offer_id, service_id, client_id, provider_id, amount, platform_fee, total_amount, payment_type, milestones)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, request_id, offer_id, service_id, req.userId, offer.rows[0].user_id, amount, platform_fee || 0, total, payment_type || 'full', JSON.stringify(milestones || [])]
    );

    const txn = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    res.status(201).json(txn.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, cl.name as client_name, pr.name as provider_name,
              r.title as request_title, s.title as service_title
       FROM transactions t
       JOIN users cl ON t.client_id = cl.id
       JOIN users pr ON t.provider_id = pr.id
       LEFT JOIN requests r ON t.request_id = r.id
       LEFT JOIN services s ON t.service_id = s.id
       WHERE t.client_id = $1 OR t.provider_id = $1
       ORDER BY t.created_at DESC`, [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/pay', auth, async (req, res) => {
  try {
    const db = getDb();
    const result = db.transaction(() => {
      const txn = db.prepare('SELECT * FROM transactions WHERE id = ? AND client_id = ?').get(req.params.id, req.userId);
      if (!txn) throw { status: 404, msg: 'Transaction not found' };

      const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.userId);
      if (!wallet || parseFloat(wallet.balance) < parseFloat(txn.total_amount)) {
        throw { status: 400, msg: 'Insufficient balance' };
      }

      db.prepare('UPDATE wallets SET balance = balance - ? WHERE user_id = ?').run(txn.total_amount, req.userId);
      db.prepare(`INSERT INTO wallet_transactions (id, wallet_id, type, amount, reference_type, reference_id, description)
        VALUES (?, ?, 'payment_hold', ?, 'transaction', ?, ?)`)
        .run(Math.random().toString(36).slice(2), wallet.id, txn.total_amount, req.params.id, 'Payment held for transaction');
      db.prepare("UPDATE transactions SET status = 'in_progress' WHERE id = ?").run(req.params.id);

      notify(txn.provider_id, 'payment_received', 'تم الدفع', 'تم دفع المبلغ وبدء العمل على الصفقة', { transaction_id: req.params.id });

      return { message: 'Payment successful', status: 'in_progress' };
    })();

    res.json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.msg });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const db = getDb();
    const result = db.transaction(() => {
      const txn = db.prepare('SELECT * FROM transactions WHERE id = ? AND client_id = ?').get(req.params.id, req.userId);
      if (!txn) throw { status: 404, msg: 'Transaction not found' };

      db.prepare("UPDATE transactions SET client_confirmed = 1, status = 'completed', completed_at = datetime('now') WHERE id = ?").run(req.params.id);

      const pWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(txn.provider_id);
      db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(txn.amount, txn.provider_id);
      db.prepare(`INSERT INTO wallet_transactions (id, wallet_id, type, amount, reference_type, reference_id, description)
        VALUES (?, ?, 'payment_release', ?, 'transaction', ?, ?)`)
        .run(Math.random().toString(36).slice(2), pWallet.id, txn.amount, req.params.id, 'Payment released from escrow');

      db.prepare('UPDATE users SET completed_orders = completed_orders + 1 WHERE id = ?').run(txn.provider_id);
      db.prepare("UPDATE requests SET status = 'completed' WHERE id = ?").run(txn.request_id);

      notify(txn.provider_id, 'completed', 'تم تأكيد الاستلام', 'قام العميل بتأكيد استلام الخدمة وتم تحرير المبلغ', { transaction_id: req.params.id });

      return { message: 'Delivery confirmed, payment released' };
    })();

    res.json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.msg });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/deliver', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1 AND provider_id = $2', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    await pool.query("UPDATE transactions SET provider_confirmed = 1 WHERE id = $1", [req.params.id]);
    res.json({ message: 'Marked as delivered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
