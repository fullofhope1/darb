const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { initDb, getDb } = require('./config/database');

initDb();

// Auto-seed if database is empty
const fs = require('fs');
const dbfile = path.join(__dirname, 'darb.db');
const isFreshDb = !fs.existsSync(dbfile) || fs.statSync(dbfile).size < 1000;
if (isFreshDb) {
  console.log('⚡ Database empty, running seed...');
  require('child_process').execSync('node seed.js', { cwd: __dirname, stdio: 'inherit' });
} else {
  try {
    const cnt = getDb().prepare('SELECT COUNT(*) as c FROM users').get().c;
    if (cnt === 0) {
      console.log('⚡ Database has no users, running seed...');
      require('child_process').execSync('node seed.js', { cwd: __dirname, stdio: 'inherit' });
    } else {
      console.log(`✓ Database has ${cnt} users`);
    }
  } catch {
    console.log('⚡ Running seed...');
    require('child_process').execSync('node seed.js', { cwd: __dirname, stdio: 'inherit' });
  }
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket.io - chat
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch { next(new Error('Invalid token')); }
});

io.on('connection', (socket) => {
  socket.on('join', (transactionId) => {
    socket.join(`tx:${transactionId}`);
  });

  socket.on('message', ({ transaction_id, content }) => {
    const db = getDb();
    const id = Math.random().toString(36).slice(2, 10);
    db.prepare('INSERT INTO messages (id, transaction_id, sender_id, content) VALUES (?, ?, ?, ?)').run(id, transaction_id, socket.userId, content);
    io.to(`tx:${transaction_id}`).emit('message', { id, transaction_id, sender_id: socket.userId, content, created_at: new Date().toISOString() });
  });

  socket.on('leave', (transactionId) => {
    socket.leave(`tx:${transactionId}`);
  });
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads and frontend build
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/services', require('./routes/services'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/search', require('./routes/search'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Darb API', version: '1.0.0' });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Darb API running on http://localhost:${PORT}`);
});
