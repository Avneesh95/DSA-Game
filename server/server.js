require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const { ensureCompilers } = require('./scripts/ensure-compilers');

// Ensure portable JDK & C/C++ compiler exist on Linux cloud instances (e.g. Render)
if (process.platform === 'linux') {
  ensureCompilers().catch((err) => console.warn('[COMPILERS] Startup ensure warning:', err.message));
}

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[SERVER] DSA 100 Doors API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();

// Guard against unhandled promise rejections crashing the process silently
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
});
