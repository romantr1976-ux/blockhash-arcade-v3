require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { dbPath } = require('./db');
const userRoutes = require('./routes/users');
const betsRoutes = require('./routes/bets');
const publicLogRoutes = require('./routes/publicLog');
const leaderboardRoutes = require('./routes/leaderboard');
const fairnessRoutes = require('./routes/fairness');

const app = express();
const port = Number.parseInt(process.env.PORT || '3000', 10);
const frontendPath = path.join(__dirname, '..', 'frontend');

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    version: '3.0.0',
    time: new Date().toISOString(),
    db: 'sqlite'
  });
});

app.use('/api/user/create', strictLimiter);
app.use('/api/bets/create', strictLimiter);
app.use('/api/fairness/verify', strictLimiter);

app.use('/api/user', userRoutes);
app.use('/api/bets', betsRoutes);
app.use('/api/public-log', publicLogRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/fairness', fairnessRoutes);

app.use(express.static(frontendPath, {
  etag: false,
  lastModified: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', 'no-store');
  }
}));

app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

betsRoutes.startResolveInterval(30000);

app.listen(port, () => {
  console.log(`BlockHash Arcade v3.0 listening on http://localhost:${port}`);
  console.log(`SQLite database: ${dbPath}`);
});
