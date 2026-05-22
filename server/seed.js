const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'darb.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function id() {
  return Math.random().toString(36).slice(2, 10);
}

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

console.log('Dropping and recreating all tables...');

db.exec(`
  DROP TABLE IF EXISTS disputes;
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS user_devices;
  DROP TABLE IF EXISTS notifications;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS withdrawals;
  DROP TABLE IF EXISTS wallet_transactions;
  DROP TABLE IF EXISTS wallets;
  DROP TABLE IF EXISTS transactions;
  DROP TABLE IF EXISTS offers;
  DROP TABLE IF EXISTS requests;
  DROP TABLE IF EXISTS services;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS otp_codes;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
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

  CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    icon TEXT,
    parent_id TEXT REFERENCES categories(id),
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE services (
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

  CREATE TABLE requests (
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

  CREATE TABLE offers (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES requests(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    price REAL NOT NULL,
    duration INTEGER NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE transactions (
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

  CREATE TABLE wallets (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    balance REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE wallet_transactions (
    id TEXT PRIMARY KEY,
    wallet_id TEXT REFERENCES wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    reference_type TEXT,
    reference_id TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE withdrawals (
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

  CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
    reviewer_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(transaction_id, reviewer_id)
  );

  CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE otp_codes (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE user_devices (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    fcm_token TEXT,
    device_type TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE disputes (
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

console.log('Tables recreated successfully');

// ─── SEED USERS ───────────────────────────────────────────────────────────────

console.log('Seeding users...');

const hash1 = bcrypt.hashSync('admin123', 10);
const hash2 = bcrypt.hashSync('provider123', 10);
const hash3 = bcrypt.hashSync('client123', 10);
const hash4 = bcrypt.hashSync('hassan123', 10);
const hash5 = bcrypt.hashSync('noor123', 10);

const users = [
  { id: id(), phone: '777000001', name: 'محمد عبدالله', password_hash: hash1, phone_verified: 1, role: 'admin', city: 'صنعاء', id_verified: 1, status: 'active', rating: 5.0, completed_orders: 0, created_at: daysAgo(60) },
  { id: id(), phone: '777000002', name: 'أحمد علي حسن', password_hash: hash2, phone_verified: 1, role: 'user', city: 'عدن', id_verified: 1, status: 'active', rating: 4.8, completed_orders: 15, created_at: daysAgo(50) },
  { id: id(), phone: '777000003', name: 'فاطمة أحمد', password_hash: hash3, phone_verified: 1, role: 'user', city: 'تعز', id_verified: 0, status: 'active', rating: 0, completed_orders: 0, created_at: daysAgo(40) },
  { id: id(), phone: '777000004', name: 'خالد حسن محمد', password_hash: hash4, phone_verified: 1, role: 'user', city: 'الحديدة', id_verified: 1, status: 'active', rating: 4.5, completed_orders: 8, created_at: daysAgo(30) },
  { id: id(), phone: '777000005', name: 'نور الدين يحيى', password_hash: hash5, phone_verified: 1, role: 'user', city: 'إب', id_verified: 0, status: 'active', rating: 0, completed_orders: 0, created_at: daysAgo(20) },
];

const insertUser = db.prepare(`INSERT INTO users (id, phone, name, password_hash, phone_verified, role, city, id_verified, status, rating, completed_orders, created_at) VALUES (@id, @phone, @name, @password_hash, @phone_verified, @role, @city, @id_verified, @status, @rating, @completed_orders, @created_at)`);

const insertUsersTx = db.transaction(() => {
  for (const u of users) {
    insertUser.run(u);
  }
});
insertUsersTx();
console.log(`  ${users.length} users inserted`);

// Store user refs by phone key
const userByPhone = {};
for (const u of users) {
  userByPhone[u.phone] = u;
}

// ─── SEED CATEGORIES ──────────────────────────────────────────────────────────

console.log('Seeding categories...');

const categories = [
  ['برمجة وتقنية',            'programming', 'laptop',      1],
  ['تصميم جرافيك وفيديو',      'graphic-design', 'palette',  2],
  ['كتابة وترجمة',             'writing', 'pen',             3],
  ['تسويق ودعاية',             'marketing', 'megaphone',     4],
  ['البناء والتشييد',          'construction', 'building',   5],
  ['السباكة والكهرباء',        'plumbing', 'tool',           6],
  ['النجارة والأثاث',          'carpentry', 'wood',          7],
  ['الخياطة والتطريز والأزياء', 'sewing', 'needle',          8],
  ['صيانة الكترونيات',          'electronics', 'tv',          9],
  ['صيانة سيارات',              'auto-repair', 'car',        10],
  ['صيانة عامة',                'general-maintenance', 'wrench', 11],
  ['التعليم والدروس الخصوصية',  'tutoring', 'book',         12],
  ['الدورات والتدريب',          'courses', 'graduation',    13],
  ['النظافة والخدمات المنزلية', 'cleaning', 'broom',       14],
  ['الطبخ وتجهيز الطعام',       'catering', 'cooking',     15],
  ['النقل والتوصيل',            'delivery', 'truck',        16],
  ['العناية الشخصية والجمال',   'beauty', 'mirror',         17],
  ['الصحة والتمريض',            'health', 'hospital',       18],
  ['الخدمات الزراعية والحيوانية','agriculture', 'plant',    19],
  ['الحرف اليدوية والتراث',     'handcrafts', 'handcraft',  20],
  ['تنظيم حفلات ومناسبات',      'events', 'party',          21],
  ['تصوير وفيديو',              'photography', 'camera',    22],
  ['خدمات قانونية ومعاملات',    'legal', 'document',        23],
  ['خدمات أخرى',                'other', 'dots',            24],
];

const insertCat = db.prepare(`INSERT INTO categories (id, name_ar, name_en, icon, parent_id, sort_order) VALUES (?, ?, ?, ?, NULL, ?)`);

const insertCatsTx = db.transaction(() => {
  for (const [nameAr, nameEn, icon, sort] of categories) {
    insertCat.run(id(), nameAr, nameEn, icon, sort);
  }
});
insertCatsTx();
console.log(`  ${categories.length} categories inserted`);

// Fetch category IDs after insertion
const catRows = db.prepare('SELECT id, name_en FROM categories ORDER BY sort_order').all();
const catMap = {};
for (const r of catRows) {
  catMap[r.name_en] = r.id;
}

// ─── SEED SERVICES ────────────────────────────────────────────────────────────

console.log('Seeding services...');

const services = [
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['programming'],
    title: 'تطوير مواقع ويب احترافية', description: 'أقوم بتطوير مواقع ويب متكاملة باستخدام أحدث التقنيات مثل React و Node.js. تصميم متجاوب وأسعار مناسبة.',
    price: 150000, price_type: 'fixed', city: 'صنعاء', views: 340, created_at: daysAgo(45)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['programming'],
    title: 'برمجة تطبيقات موبايل', description: 'تطوير تطبيقات أندرويد و iOS باستخدام Flutter. تطبيقات متكاملة مع واجهات خلفية.',
    price: 250000, price_type: 'fixed', city: 'عدن', views: 210, created_at: daysAgo(40)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['graphic-design'],
    title: 'تصميم شعارات وهوية بصرية', description: 'تصميم شعارات احترافية وهوية بصرية كاملة للشركات والمؤسسات. خبرة أكثر من 5 سنوات.',
    price: 75000, price_type: 'fixed', city: 'صنعاء', views: 520, created_at: daysAgo(35)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['photography'],
    title: 'تصوير تصوير حفلات ومناسبات', description: 'تصوير احترافي للحفلات والمناسبات الخاصة. ألبوم صور عالي الجودة وفيديو مونتاج.',
    price: 120000, price_type: 'fixed', city: 'عدن', views: 180, created_at: daysAgo(30)
  },
  {
    id: id(), user_id: userByPhone['777000004'].id, category_id: catMap['construction'],
    title: 'مقاولات بناء وترميم', description: 'مقاولات بناء عامة وترميم المنازل والمحلات. فريق عمل متكامل بإشراف مهندسين.',
    price: 500000, price_type: 'fixed', city: 'الحديدة', views: 95, created_at: daysAgo(25)
  },
  {
    id: id(), user_id: userByPhone['777000004'].id, category_id: catMap['plumbing'],
    title: 'سباكة وكهرباء منازل', description: 'تركيب وصيانة شبكات السباكة والكهرباء للمنازل والمحلات التجارية. ضمان على جميع الأعمال.',
    price: 45000, price_type: 'fixed', city: 'الحديدة', views: 150, created_at: daysAgo(20)
  },
  {
    id: id(), user_id: userByPhone['777000004'].id, category_id: catMap['carpentry'],
    title: 'نجارة وأثاث حسب الطلب', description: 'تصنيع الأثاث المنزلي والمكتبي حسب الطلب. غرف نوم، مجالس، مطابخ. خشب طبيعي عالي الجودة.',
    price: 200000, price_type: 'fixed', city: 'تعز', views: 120, created_at: daysAgo(18)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['marketing'],
    title: 'إدارة حملات تسويق إلكتروني', description: 'إدارة حملات إعلانية على فيسبوك وانستغرام وجوجل. استهداف دقيق للجمهور اليمني.',
    price: 80000, price_type: 'fixed', city: 'صنعاء', views: 290, created_at: daysAgo(28)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['tutoring'],
    title: 'دروس خصوصية في الرياضيات', description: 'دروس تقوية في مادة الرياضيات لجميع المراحل الدراسية. تأسيس وامتحانات.',
    price: 5000, price_type: 'fixed', city: 'صنعاء', views: 400, created_at: daysAgo(22)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['catering'],
    title: 'تجهيز ولائم وعزائم', description: 'تجهيز الطعام للحفلات والمناسبات. مأكولات يمنية تقليدية وعصرية. أفضل الأسعار.',
    price: 35000, price_type: 'fixed', city: 'عدن', views: 175, created_at: daysAgo(15)
  },
  {
    id: id(), user_id: userByPhone['777000004'].id, category_id: catMap['delivery'],
    title: 'خدمة توصيل سريع', description: 'توصيل الطلبات داخل المدينة. سريع وآمن. تغطية لجميع أحياء مدينة الحديدة.',
    price: 3000, price_type: 'fixed', city: 'الحديدة', views: 310, created_at: daysAgo(12)
  },
  {
    id: id(), user_id: userByPhone['777000004'].id, category_id: catMap['auto-repair'],
    title: 'صيانة سيارات ميكانيكا وكهرباء', description: 'صيانة شاملة للسيارات. ميكانيكا، كهرباء، تكييف، وبرمجة كمبيوتر. كشف مجاني.',
    price: 25000, price_type: 'fixed', city: 'الحديدة', views: 88, created_at: daysAgo(10)
  },
  {
    id: id(), user_id: userByPhone['777000002'].id, category_id: catMap['writing'],
    title: 'كتابة محتوى تسويقي', description: 'كتابة محتوى احترافي للمواقع والتطبيقات ووسائل التواصل الاجتماعي. بالعربية والإنجليزية.',
    price: 15000, price_type: 'fixed', city: 'صنعاء', views: 230, created_at: daysAgo(8)
  },
];

const insertService = db.prepare(`INSERT INTO services (id, user_id, category_id, title, description, price, price_type, city, views, created_at) VALUES (@id, @user_id, @category_id, @title, @description, @price, @price_type, @city, @views, @created_at)`);

const insertServicesTx = db.transaction(() => {
  for (const s of services) {
    insertService.run(s);
  }
});
insertServicesTx();
console.log(`  ${services.length} services inserted`);

// ─── SEED REQUESTS ────────────────────────────────────────────────────────────

console.log('Seeding requests...');

const requests = [
  {
    id: id(), user_id: userByPhone['777000003'].id, category_id: catMap['programming'],
    title: 'مطلوب مطور ويب لعمل متجر إلكتروني', description: 'أحتاج مطور ويب لإنشاء متجر إلكتروني لبيع الملابس. يفضل من لديه خبرة في WooCommerce أو Shopify.',
    budget_min: 100000, budget_max: 300000, duration: 30, city: 'تعز', views: 45, status: 'open', created_at: daysAgo(10)
  },
  {
    id: id(), user_id: userByPhone['777000005'].id, category_id: catMap['graphic-design'],
    title: 'تصميم بروفايل شركة كامل', description: 'أحتاج مصمم جرافيك لعمل هوية بصرية متكاملة لشركة مقاولات جديدة. يشمل شعار، بطاقات، قرطاسية.',
    budget_min: 50000, budget_max: 100000, duration: 14, city: 'إب', views: 32, status: 'open', created_at: daysAgo(8)
  },
  {
    id: id(), user_id: userByPhone['777000003'].id, category_id: catMap['sewing'],
    title: 'خياطة فستان زفاف', description: 'أبحث عن خياطة متمكنة لتفصيل فستان زفاف حسب التصميم المطلوب. القماش متوفر.',
    budget_min: 50000, budget_max: 120000, duration: 20, city: 'تعز', views: 68, status: 'open', created_at: daysAgo(7)
  },
  {
    id: id(), user_id: userByPhone['777000005'].id, category_id: catMap['construction'],
    title: 'ترميم وتشطيب شقة', description: 'شقة 120 متر مربع بحاجة ترميم كامل. دهان، سباكة، كهرباء، سيراميك. عايز عرض سعر شامل.',
    budget_min: 300000, budget_max: 700000, duration: 45, city: 'إب', views: 25, status: 'in_progress', created_at: daysAgo(14)
  },
  {
    id: id(), user_id: userByPhone['777000003'].id, category_id: catMap['catering'],
    title: 'تجهيز طعام عزاء', description: 'مطلوب تجهيز طعام عزاء لـ 200 شخص. مأكولات يمنية تقليدية. التسليم في منطقة الروضة بتعز.',
    budget_min: 60000, budget_max: 100000, duration: 2, city: 'تعز', views: 41, status: 'open', created_at: daysAgo(5)
  },
  {
    id: id(), user_id: userByPhone['777000005'].id, category_id: catMap['tutoring'],
    title: 'مدرس لغة إنجليزية للأطفال', description: 'أبحث عن مدرس متخصص في تدريس اللغة الإنجليزية للأطفال. مستويين مبتدئ. مرتين في الأسبوع.',
    budget_min: 15000, budget_max: 30000, duration: 60, city: 'إب', views: 55, status: 'open', created_at: daysAgo(6)
  },
  {
    id: id(), user_id: userByPhone['777000003'].id, category_id: catMap['auto-repair'],
    title: 'صيانة مكيف سيارة تويوتا', description: 'مكيف سيارة تويوتا كورولا 2015 لا يعمل. يحتاج فحص وصيانة. أبغى فني متخصص.',
    budget_min: 10000, budget_max: 30000, duration: 2, city: 'تعز', views: 19, status: 'open', created_at: daysAgo(3)
  },
  {
    id: id(), user_id: userByPhone['777000005'].id, category_id: catMap['electronics'],
    title: 'إصلاح شاشة تلفاز LED', description: 'شاشة تلفاز LG 55 بوصة لا تعمل. يوجد صوت ولا يوجد صورة. مطلوب فني صيانة الكترونيات.',
    budget_min: 8000, budget_max: 20000, duration: 3, city: 'إب', views: 14, status: 'open', created_at: daysAgo(2)
  },
];

const insertRequest = db.prepare(`INSERT INTO requests (id, user_id, category_id, title, description, budget_min, budget_max, duration, city, views, status, created_at) VALUES (@id, @user_id, @category_id, @title, @description, @budget_min, @budget_max, @duration, @city, @views, @status, @created_at)`);

const insertRequestsTx = db.transaction(() => {
  for (const r of requests) {
    insertRequest.run(r);
  }
});
insertRequestsTx();
console.log(`  ${requests.length} requests inserted`);

// ─── SEED OFFERS ──────────────────────────────────────────────────────────────

console.log('Seeding offers...');

const offers = [
  {
    id: id(), request_id: requests[0].id, user_id: userByPhone['777000002'].id,
    price: 200000, duration: 25, description: 'يمكنني عمل المتجر كامل باستخدام WooCommerce مع واجهة عربية. عندي خبرة في نفس المجال.',
    status: 'pending', created_at: daysAgo(9)
  },
  {
    id: id(), request_id: requests[3].id, user_id: userByPhone['777000004'].id,
    price: 550000, duration: 40, description: 'فريق مقاولات متكامل. نقوم بترميم وتشطيب الشقة بالكامل. ضمان على جميع الأعمال.',
    status: 'accepted', created_at: daysAgo(13)
  },
  {
    id: id(), request_id: requests[1].id, user_id: userByPhone['777000002'].id,
    price: 75000, duration: 10, description: 'مصمم جرافيك محترف. سأعمل هوية بصرية كاملة بجودة عالية. معاينة مجانية للتصاميم الأولى.',
    status: 'pending', created_at: daysAgo(7)
  },
  {
    id: id(), request_id: requests[4].id, user_id: userByPhone['777000002'].id,
    price: 85000, duration: 2, description: 'أقوم بتجهيز ولائم العزاء بأصناف يمنية ممتازة. سمك، مندي، لحوم. خبرة في تجهيز المناسبات.',
    status: 'pending', created_at: daysAgo(4)
  },
  {
    id: id(), request_id: requests[0].id, user_id: userByPhone['777000004'].id,
    price: 150000, duration: 35, description: 'أستطيع عمل المتجر بـ 150 ألف ريال. منصة مفتوحة المصدر مع لوحة تحكم كاملة.',
    status: 'rejected', created_at: daysAgo(9)
  },
  {
    id: id(), request_id: requests[5].id, user_id: userByPhone['777000002'].id,
    price: 20000, duration: 60, description: 'مدرس لغة إنجليزية معتمد. خبرة 4 سنوات في تدريس الأطفال. منهج تفاعلي وممتع.',
    status: 'pending', created_at: daysAgo(5)
  },
];

const insertOffer = db.prepare(`INSERT INTO offers (id, request_id, user_id, price, duration, description, status, created_at) VALUES (@id, @request_id, @user_id, @price, @duration, @description, @status, @created_at)`);

const insertOffersTx = db.transaction(() => {
  for (const o of offers) {
    insertOffer.run(o);
  }
});
insertOffersTx();
console.log(`  ${offers.length} offers inserted`);

// ─── SEED TRANSACTIONS ────────────────────────────────────────────────────────

console.log('Seeding transactions...');

const transactions = [
  {
    id: id(), request_id: requests[3].id, offer_id: offers[1].id, service_id: null,
    client_id: requests[3].user_id, provider_id: offers[1].user_id,
    amount: 550000, platform_fee: 27500, total_amount: 577500,
    payment_type: 'milestones', status: 'in_progress',
    provider_confirmed: 1, client_confirmed: 1,
    completed_at: null, created_at: daysAgo(12)
  },
  {
    id: id(), request_id: requests[0].id, offer_id: offers[0].id, service_id: services[0].id,
    client_id: requests[0].user_id, provider_id: offers[0].user_id,
    amount: 200000, platform_fee: 10000, total_amount: 210000,
    payment_type: 'full', status: 'completed',
    provider_confirmed: 1, client_confirmed: 1,
    completed_at: daysAgo(2), created_at: daysAgo(25)
  },
  {
    id: id(), request_id: null, offer_id: null, service_id: services[2].id,
    client_id: userByPhone['777000003'].id, provider_id: userByPhone['777000002'].id,
    amount: 75000, platform_fee: 3750, total_amount: 78750,
    payment_type: 'full', status: 'completed',
    provider_confirmed: 1, client_confirmed: 1,
    completed_at: daysAgo(5), created_at: daysAgo(20)
  },
  {
    id: id(), request_id: null, offer_id: null, service_id: services[5].id,
    client_id: userByPhone['777000003'].id, provider_id: userByPhone['777000004'].id,
    amount: 45000, platform_fee: 2250, total_amount: 47250,
    payment_type: 'full', status: 'completed',
    provider_confirmed: 1, client_confirmed: 1,
    completed_at: daysAgo(3), created_at: daysAgo(15)
  },
  {
    id: id(), request_id: null, offer_id: null, service_id: services[8].id,
    client_id: userByPhone['777000005'].id, provider_id: userByPhone['777000002'].id,
    amount: 5000, platform_fee: 250, total_amount: 5250,
    payment_type: 'full', status: 'completed',
    provider_confirmed: 1, client_confirmed: 1,
    completed_at: daysAgo(6), created_at: daysAgo(10)
  },
];

const insertTx = db.prepare(`INSERT INTO transactions (id, request_id, offer_id, service_id, client_id, provider_id, amount, platform_fee, total_amount, payment_type, status, provider_confirmed, client_confirmed, completed_at, created_at) VALUES (@id, @request_id, @offer_id, @service_id, @client_id, @provider_id, @amount, @platform_fee, @total_amount, @payment_type, @status, @provider_confirmed, @client_confirmed, @completed_at, @created_at)`);

const insertTxsTx = db.transaction(() => {
  for (const t of transactions) {
    insertTx.run(t);
  }
});
insertTxsTx();
console.log(`  ${transactions.length} transactions inserted`);

// ─── SEED REVIEWS ─────────────────────────────────────────────────────────────

console.log('Seeding reviews...');

const reviews = [
  {
    id: id(), transaction_id: transactions[1].id,
    reviewer_id: transactions[1].client_id, reviewee_id: transactions[1].provider_id,
    rating: 5, comment: 'أحمد مبرمج ممتاز، سلم العمل في الوقت المحدد وجودة العمل عالية. أنصح بالتعامل معه.',
    created_at: daysAgo(1)
  },
  {
    id: id(), transaction_id: transactions[1].id,
    reviewer_id: transactions[1].provider_id, reviewee_id: transactions[1].client_id,
    rating: 5, comment: 'تعامل راقي ودفع في الوقت المحدد. عميل محترم.',
    created_at: daysAgo(1)
  },
  {
    id: id(), transaction_id: transactions[2].id,
    reviewer_id: transactions[2].client_id, reviewee_id: transactions[2].provider_id,
    rating: 5, comment: 'تصميم الشعار كان رائعاً ومطابقاً للطلب. سعر مناسب جداً.',
    created_at: daysAgo(4)
  },
  {
    id: id(), transaction_id: transactions[3].id,
    reviewer_id: transactions[3].client_id, reviewee_id: transactions[3].provider_id,
    rating: 4, comment: 'شغل سباكة وكهرباء ممتاز. الالتزام بالمواعيد يحتاج تحسين بسيط.',
    created_at: daysAgo(2)
  },
  {
    id: id(), transaction_id: transactions[2].id,
    reviewer_id: transactions[2].provider_id, reviewee_id: transactions[2].client_id,
    rating: 5, comment: 'عميل متعاون وواضح في متطلباته. تجربة ممتازة.',
    created_at: daysAgo(4)
  },
  {
    id: id(), transaction_id: transactions[4].id,
    reviewer_id: transactions[4].client_id, reviewee_id: transactions[4].provider_id,
    rating: 5, comment: 'دروس خصوصية ممتازة. ابني استفاد كثيراً وتحسنت درجاته.',
    created_at: daysAgo(5)
  },
  {
    id: id(), transaction_id: transactions[4].id,
    reviewer_id: transactions[4].provider_id, reviewee_id: transactions[4].client_id,
    rating: 5, comment: 'التزام واهتمام من ولي الأمر. طالب مجتهد.',
    created_at: daysAgo(5)
  },
];

const insertReview = db.prepare(`INSERT INTO reviews (id, transaction_id, reviewer_id, reviewee_id, rating, comment, created_at) VALUES (@id, @transaction_id, @reviewer_id, @reviewee_id, @rating, @comment, @created_at)`);

const insertReviewsTx = db.transaction(() => {
  for (const r of reviews) {
    insertReview.run(r);
  }
});
insertReviewsTx();
console.log(`  ${reviews.length} reviews inserted`);

// ─── SEED WALLETS ─────────────────────────────────────────────────────────────

console.log('Seeding wallets...');

const wallets = [
  { id: id(), user_id: userByPhone['777000001'].id, balance: 0, created_at: daysAgo(60) },
  { id: id(), user_id: userByPhone['777000002'].id, balance: 350000, created_at: daysAgo(50) },
  { id: id(), user_id: userByPhone['777000003'].id, balance: 100000, created_at: daysAgo(40) },
  { id: id(), user_id: userByPhone['777000004'].id, balance: 180000, created_at: daysAgo(30) },
  { id: id(), user_id: userByPhone['777000005'].id, balance: 50000, created_at: daysAgo(20) },
];

const insertWallet = db.prepare(`INSERT INTO wallets (id, user_id, balance, created_at) VALUES (@id, @user_id, @balance, @created_at)`);

const insertWalletsTx = db.transaction(() => {
  for (const w of wallets) {
    insertWallet.run(w);
  }
});
insertWalletsTx();
console.log(`  ${wallets.length} wallets inserted`);

// ─── SEED NOTIFICATIONS ───────────────────────────────────────────────────────

console.log('Seeding notifications...');

const notifications = [
  { id: id(), user_id: userByPhone['777000002'].id, type: 'new_offer', title: 'عرض جديد على طلبك', body: 'تم استلام عرض جديد على طلب "مطلوب مطور ويب" بقيمة 200,000 ريال', is_read: 0, created_at: daysAgo(9) },
  { id: id(), user_id: userByPhone['777000003'].id, type: 'offer_accepted', title: 'تم قبول عرضك', body: 'تم قبول عرضك على طلب ترميم الشقة. تواصل مع العميل للاتفاق على التفاصيل.', is_read: 0, created_at: daysAgo(12) },
  { id: id(), user_id: userByPhone['777000003'].id, type: 'order_completed', title: 'اكتمال طلب', body: 'تم اكتمال طلب "تصميم شعار" بنجاح. يمكنك تقييم الخدمة.', is_read: 0, created_at: daysAgo(5) },
  { id: id(), user_id: userByPhone['777000005'].id, type: 'new_offer', title: 'عرض جديد', body: 'تم استلام عرض على طلب "مدرس لغة إنجليزية" بقيمة 20,000 ريال', is_read: 0, created_at: daysAgo(5) },
  { id: id(), user_id: userByPhone['777000002'].id, type: 'payment_received', title: 'تم استلام الدفعة', body: 'تم استلام 200,000 ريال في محفظتك مقابل خدمة تطوير مواقع.', is_read: 1, created_at: daysAgo(2) },
];

const insertNotif = db.prepare(`INSERT INTO notifications (id, user_id, type, title, body, is_read, created_at) VALUES (@id, @user_id, @type, @title, @body, @is_read, @created_at)`);

const insertNotifsTx = db.transaction(() => {
  for (const n of notifications) {
    insertNotif.run(n);
  }
});
insertNotifsTx();
console.log(`  ${notifications.length} notifications inserted`);

// ─── SEED MESSAGES ────────────────────────────────────────────────────────────

console.log('Seeding messages...');

const messages = [
  { id: id(), transaction_id: transactions[1].id, sender_id: transactions[1].client_id, content: 'السلام عليكم، متى تتوقع تسليم العمل؟', created_at: daysAgo(20) },
  { id: id(), transaction_id: transactions[1].id, sender_id: transactions[1].provider_id, content: 'وعليكم السلام، إن شاء الله خلال أسبوعين', created_at: daysAgo(20) },
  { id: id(), transaction_id: transactions[1].id, sender_id: transactions[1].client_id, content: 'تمام، جزاك الله خير', created_at: daysAgo(20) },
  { id: id(), transaction_id: transactions[2].id, sender_id: transactions[2].client_id, content: 'أريد تعديل بسيط على لون الشعار', created_at: daysAgo(12) },
  { id: id(), transaction_id: transactions[2].id, sender_id: transactions[2].provider_id, content: 'تفضلي أختي، أرسلي اللون المطلوب وسأقوم بالتعديل فوراً', created_at: daysAgo(12) },
  { id: id(), transaction_id: transactions[3].id, sender_id: transactions[3].client_id, content: 'السلام عليكم، متى ستبدأون العمل في الشقة؟', created_at: daysAgo(10) },
  { id: id(), transaction_id: transactions[3].id, sender_id: transactions[3].provider_id, content: 'وعليكم السلام، الأسبوع القادم إن شاء الله نبدأ', created_at: daysAgo(10) },
];

const insertMsg = db.prepare(`INSERT INTO messages (id, transaction_id, sender_id, content, created_at) VALUES (@id, @transaction_id, @sender_id, @content, @created_at)`);

const insertMsgsTx = db.transaction(() => {
  for (const m of messages) {
    insertMsg.run(m);
  }
});
insertMsgsTx();
console.log(`  ${messages.length} messages inserted`);

// ─── SUMMARY ──────────────────────────────────────────────────────────────────

db.close();

console.log('');
console.log('========================================');
console.log('     Database seeded successfully!');
console.log('========================================');
console.log('');
console.log('Users:');
console.log('  Admin:     777000001 / admin123');
console.log('  Provider:  777000002 / provider123');
console.log('  Client:    777000003 / client123');
console.log('  Provider:  777000004 / hassan123');
console.log('  User:      777000005 / noor123');
console.log('');
console.log('Summary:');
console.log(`  Categories:     ${categories.length}`);
console.log(`  Services:       ${services.length}`);
console.log(`  Requests:       ${requests.length}`);
console.log(`  Offers:         ${offers.length}`);
console.log(`  Transactions:   ${transactions.length}`);
console.log(`  Reviews:        ${reviews.length}`);
console.log(`  Wallets:        ${wallets.length}`);
console.log(`  Notifications:  ${notifications.length}`);
console.log(`  Messages:       ${messages.length}`);
console.log('');
