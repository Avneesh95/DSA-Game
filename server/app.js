const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const doorRoutes = require('./routes/doorRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const progressRoutes = require('./routes/progressRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const corsOptions = require('./config/corsOptions');

const app = express();

// --- Security & core middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Apply CORS to all routes and explicitly handle preflight requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '200kb' })); // small limit; code submissions are text, not large payloads
app.use(mongoSanitize()); // strips $ and . operators from user input to prevent NoSQL injection

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const path = require('path');
const fs = require('fs');

const clientDistPath = path.join(__dirname, '../client/dist');
const hasClientBuild = fs.existsSync(clientDistPath);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));
}

app.use('/api', apiLimiter);

// --- Root landing & API status ---
app.get('/', (req, res) => {
  if (hasClientBuild && fs.existsSync(path.join(clientDistPath, 'index.html'))) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }

  if (req.accepts('html')) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DSA 100 Doors — API Status</title>
  <style>
    body {
      margin: 0;
      background: #000000;
      color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #1c1c1e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 36px 28px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 14px;
      background: rgba(52, 199, 89, 0.15);
      border: 1px solid rgba(52, 199, 89, 0.35);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: #34c759;
      margin-bottom: 18px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #34c759;
      border-radius: 50%;
      box-shadow: 0 0 8px #34c759;
    }
    h1 {
      font-size: 26px;
      margin: 0 0 8px 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    p {
      color: #86868b;
      font-size: 14px;
      margin: 0 0 22px 0;
      line-height: 1.5;
    }
    .creator {
      color: #ff9500;
      font-weight: 600;
    }
    .btn {
      display: inline-block;
      background: #ff9500;
      color: #ffffff;
      text-decoration: none;
      padding: 11px 22px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      box-shadow: 0 2px 14px rgba(255,149,0,0.35);
    }
    .btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .endpoints {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      text-align: left;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .endpoint-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      color: #86868b;
    }
    .endpoint-item a {
      color: #ff9500;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span> API Operational
    </div>
    <h1>DSA 100 Doors API</h1>
    <p>Gamified DSA learning platform backend.<br/>Created with ❤️ by <span class="creator">Avneesh</span>.</p>
    <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
      <a href="https://fundsa.netlify.app" class="btn">Launch Game App →</a>
      <a href="/api/health" class="btn" style="background: rgba(255,255,255,0.08); box-shadow: none;">API Health</a>
    </div>
    <div class="endpoints">
      <div class="endpoint-item"><span>Frontend:</span><a href="https://fundsa.netlify.app">fundsa.netlify.app</a></div>
      <div class="endpoint-item"><span>Health:</span><a href="/api/health">/api/health</a></div>
      <div class="endpoint-item"><span>Doors:</span><a href="/api/doors">/api/doors</a></div>
      <div class="endpoint-item"><span>Leaderboard:</span><a href="/api/leaderboard">/api/leaderboard</a></div>
    </div>
  </div>
</body>
</html>`);
  }

  res.json({
    success: true,
    message: 'DSA 100 Doors API is running',
    creator: 'Avneesh',
    status: 'healthy',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      doors: '/api/doors',
      problems: '/api/problems',
      submissions: '/api/submissions',
      leaderboard: '/api/leaderboard',
    },
  });
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DSA 100 Doors API is running' });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'DSA 100 Doors API Root',
    creator: 'Avneesh',
    health: '/api/health',
  });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/doors', doorRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// SPA fallback if client build exists
if (hasClientBuild) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
