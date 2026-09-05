require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

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
