require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const { ensureCompilers } = require('./scripts/ensure-compilers');

const start = async () => {
  if (process.platform === 'linux') {
    try {
      console.log('[COMPILERS] Verifying compiler toolchains on startup...');
      await ensureCompilers();
    } catch (err) {
      console.warn('[COMPILERS] Startup compiler warning:', err.message);
    }
  }

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
