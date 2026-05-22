const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { getDb } = require('../config/database');
const { adminAuth } = require('../middleware/auth');

router.use(adminAuth);

router.get('/dashboard', async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    const services = await pool.query("SELECT COUNT(*) as count FROM services WHERE status = 'active'");
    const requests = await pool.query("SELECT COUNT(*) as count FROM requests WHERE status = 'open'");
    const txn = await pool.query("SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM transactions WHERE status = 'completed'");
    const disputes = await pool.query("SELECT COUNT(*) as count FROM disputes WHERE status = 'open'");
    const wd = await pool.query("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = 'pending'");

    res.json({
      total_users: users.rows[0]?.count || 0,
      active_services: services.rows[0]?.count || 0,
      open_requests: requests.rows[0]?.count || 0,
      completed_transactions: txn.rows[0]?.count || 0,
      total_revenue: txn.rows[0]?.revenue || 0,
      open_disputes: disputes.rows[0]?.count || 0,
      pending_withdrawals: wd.rows[0]?.count || 0,
      pending_withdrawal_amount: wd.rows[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, phone, role, city, status, rating, completed_orders, id_verified, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ message: 'User status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, cl.name as client_name, pr.name as provider_name
       FROM transactions t JOIN users cl ON t.client_id = cl.id JOIN users pr ON t.provider_id = pr.id
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/withdrawals', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, u.name as user_name, u.phone
       FROM withdrawals w JOIN users u ON w.user_id = u.id
       WHERE w.status = 'pending' ORDER BY w.created_at ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/withdrawals/:id', async (req, res) => {
  try {
    const db = getDb();
    db.transaction(() => {
      const wd = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(req.params.id);
      if (!wd) throw { status: 404, msg: 'Not found' };

      if (req.body.status === 'rejected') {
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(wd.amount, wd.user_id);
      }

      db.prepare("UPDATE withdrawals SET status = ?, notes = ?, admin_id = ?, updated_at = datetime('now') WHERE id = ?").run(req.body.status, req.body.notes, req.userId, req.params.id);
    })();

    res.json({ message: 'Withdrawal updated' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.msg });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/disputes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.name as opened_by_name, t.amount, t.client_id, t.provider_id
       FROM disputes d JOIN users u ON d.opened_by = u.id JOIN transactions t ON d.transaction_id = t.id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/disputes/:id/resolve', async (req, res) => {
  try {
    const db = getDb();
    db.transaction(() => {
      const dispute = db.prepare('SELECT * FROM disputes WHERE id = ?').get(req.params.id);
      if (!dispute) throw { status: 404, msg: 'Dispute not found' };

      const txn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(dispute.transaction_id);
      if (!txn) throw { status: 404, msg: 'Transaction not found' };

      if (req.body.resolution === 'full_to_provider') {
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(txn.amount, txn.provider_id);
      } else if (req.body.resolution === 'full_to_client') {
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(txn.total_amount, txn.client_id);
      } else if (req.body.resolution === 'partial') {
        const half = txn.amount / 2;
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(half, txn.provider_id);
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?').run(txn.total_amount - half, txn.client_id);
      }

      db.prepare("UPDATE disputes SET status = 'resolved', resolution = ?, resolution_notes = ?, resolved_by = ?, resolved_at = datetime('now') WHERE id = ?").run(req.body.resolution, req.body.resolution_notes, req.userId, req.params.id);
      db.prepare("UPDATE transactions SET status = 'completed', dispute_winner = ? WHERE id = ?").run(req.body.resolution, dispute.transaction_id);
    })();

    res.json({ message: 'Dispute resolved' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.msg });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
