require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure JDK exists on Linux cloud instances (e.g. Render)
const jdkJavac = path.join(__dirname, '.jdk', 'bin', 'javac');
if (process.platform === 'linux' && !fs.existsSync(jdkJavac)) {
  try {
    console.log('[JDK] Portable JDK not detected on Linux. Running scripts/install-jdk.sh...');
    execSync('bash scripts/install-jdk.sh', { cwd: __dirname, stdio: 'inherit' });
    console.log('[JDK] Portable JDK ready.');
  } catch (err) {
    console.warn('[JDK] Note: install-jdk.sh returned:', err.message);
  }
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
