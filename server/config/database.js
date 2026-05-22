const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', 'darb.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function query(text, params = []) {
  const d = getDb();
  const sql = text.replace(/\$(\d+)/g, '?').replace(/::text/g, '').replace(/::numeric/g, '').replace(/ILIKE/g, 'LIKE');
  const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
  const isReturning = sql.toUpperCase().includes('RETURNING');
  const isCount = sql.trim().toUpperCase().startsWith('SELECT COUNT');

  try {
    if (isSelect || isReturning) {
      const rows = d.prepare(sql).all(...params);
      const rowCount = rows.length;

      // Convert PostgreSQL JSONB column names to match
      const processed = rows.map(r => {
        const o = { ...r };
        for (const key of Object.keys(o)) {
          if (typeof o[key] === 'string' && (o[key].startsWith('[') || o[key].startsWith('{')) && (key === 'images' || key === 'data' || key === 'evidence' || key === 'milestones')) {
            try { o[key] = JSON.parse(o[key]); } catch (e) { }
          }
          // Convert 0/1 to boolean for specific fields
          if (['id_verified', 'is_active', 'provider_confirmed', 'client_confirmed', 'is_read'].includes(key)) {
            o[key] = Boolean(o[key]);
          }
        }
        return o;
      });

      return { rows: processed, rowCount };
    } else {
      const info = d.prepare(sql).run(...params);
      let rows = [];
      if (isReturning || sql.toUpperCase().includes('RETURNING')) {
        rows = d.prepare('SELECT last_insert_rowid() as id').all();
      }
      return { rows, rowCount: info.changes };
    }
  } catch (err) {
    throw err;
  }
}

// Transaction helper - wraps a callback in a SQLite transaction
function transaction(callback) {
  const d = getDb();
  const tx = d.transaction(callback);
  return tx();
}

const pool = {
  query,
  connect: async () => ({
    query: async (text, params) => query(text, params),
    release: () => {},
  }),
};

function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      phone_verified INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user',
      city TEXT,
      avatar_url TEXT,
      id_verified INTEGER DEFAULT 0,
      id_image_url TEXT,
      status TEXT DEFAULT 'active',
      rating REAL DEFAULT 0,
      completed_orders INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name_ar TEXT NOT NULL,
      name_en TEXT,
      icon TEXT,
      parent_id TEXT REFERENCES categories(id),
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      category_id TEXT REFERENCES categories(id),
      title TEXT NOT NULL,
      description TEXT,
      price REAL,
      price_type TEXT DEFAULT 'fixed',
      images TEXT DEFAULT '[]',
      city TEXT,
      status TEXT DEFAULT 'active',
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      category_id TEXT REFERENCES categories(id),
      title TEXT NOT NULL,
      description TEXT,
      images TEXT DEFAULT '[]',
      budget_min REAL,
      budget_max REAL,
      duration INTEGER,
      city TEXT,
      status TEXT DEFAULT 'open',
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      request_id TEXT REFERENCES requests(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      price REAL NOT NULL,
      duration INTEGER NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      request_id TEXT REFERENCES requests(id),
      offer_id TEXT REFERENCES offers(id),
      service_id TEXT REFERENCES services(id),
      client_id TEXT REFERENCES users(id) NOT NULL,
      provider_id TEXT REFERENCES users(id) NOT NULL,
      amount REAL NOT NULL,
      platform_fee REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_type TEXT DEFAULT 'full',
      milestones TEXT DEFAULT '[]',
      status TEXT DEFAULT 'pending_payment',
      provider_confirmed INTEGER DEFAULT 0,
      client_confirmed INTEGER DEFAULT 0,
      dispute_winner TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      balance REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      wallet_id TEXT REFERENCES wallets(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      reference_type TEXT,
      reference_id TEXT,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      wallet_type TEXT NOT NULL,
      wallet_number TEXT NOT NULL,
      wallet_name TEXT,
      status TEXT DEFAULT 'pending',
      admin_id TEXT REFERENCES users(id),
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
      reviewer_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      reviewee_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(transaction_id, reviewer_id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      data TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
      sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_devices (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      fcm_token TEXT,
      device_type TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
      opened_by TEXT REFERENCES users(id),
      reason TEXT NOT NULL,
      evidence TEXT DEFAULT '[]',
      status TEXT DEFAULT 'open',
      resolution TEXT,
      resolved_by TEXT REFERENCES users(id),
      resolution_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      resolved_at TEXT
    );
  `);

  // Seed categories if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c === 0) {
    const cats = [
      ['برمجة وتقنية','laptop'], ['تصميم جرافيك وفيديو','palette'], ['كتابة وترجمة','pen'],
      ['تسويق ودعاية','megaphone'], ['البناء والتشييد','building'], ['السباكة والكهرباء','tool'],
      ['النجارة والأثاث','wood'], ['الخياطة والتطريز والأزياء','needle'], ['صيانة الكترونيات','tv'],
      ['صيانة سيارات','car'], ['صيانة عامة','wrench'], ['التعليم والدروس الخصوصية','book'],
      ['الدورات والتدريب','graduation'], ['النظافة والخدمات المنزلية','broom'],
      ['الطبخ وتجهيز الطعام','cooking'], ['النقل والتوصيل','truck'],
      ['العناية الشخصية والجمال','mirror'], ['الصحة والتمريض','hospital'],
      ['الخدمات الزراعية والحيوانية','plant'], ['الحرف اليدوية والتراث','handcraft'],
      ['تنظيم حفلات ومناسبات','party'], ['تصوير وفيديو','camera'],
      ['خدمات قانونية ومعاملات','document'], ['خدمات أخرى','dots'],
    ];
    const ins = db.prepare('INSERT INTO categories (id, name_ar, icon, parent_id, sort_order) VALUES (?, ?, ?, NULL, ?)');
    const tx = db.transaction(() => {
      cats.forEach(([name, icon], i) => {
        ins.run(Math.random().toString(36).slice(2, 10), name, icon, i + 1);
      });
    });
    tx();
    console.log('Categories seeded: 24 categories');
  }

  console.log('Darb database initialized');
}

module.exports = { query, initDb, pool, getDb, transaction };
