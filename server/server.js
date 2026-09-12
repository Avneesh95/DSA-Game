require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure portable JDK & C/C++ compiler exist on Linux cloud instances (e.g. Render)
const jdkJavac = path.join(__dirname, '.jdk', 'bin', 'javac');
const zigBin = path.join(__dirname, '.compilers', 'zig');
if (process.platform === 'linux' && (!fs.existsSync(jdkJavac) || !fs.existsSync(zigBin))) {
  try {
    console.log('[COMPILERS] Checking/installing portable toolchains (JDK, C/C++)...');
    execSync('bash scripts/install-compilers.sh', { cwd: __dirname, stdio: 'inherit' });
    console.log('[COMPILERS] Portable toolchains ready.');
  } catch (err) {
    console.warn('[COMPILERS] Note: install-compilers.sh returned:', err.message);
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
