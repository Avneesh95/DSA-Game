// Production-ready CORS options for DSA 100 Doors API

const getAllowedOrigins = () => {
  const envOrigins = process.env.CLIENT_URL || '';

  if (envOrigins === '*' || envOrigins.toLowerCase() === 'all') {
    return '*';
  }

  const list = envOrigins
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // Always include standard production & local development origins
  if (!list.includes('https://fundsa.netlify.app')) list.push('https://fundsa.netlify.app');
  if (!list.includes('*.netlify.app')) list.push('*.netlify.app');
  if (!list.includes('http://localhost:5173')) list.push('http://localhost:5173');
  if (!list.includes('http://127.0.0.1:5173')) list.push('http://127.0.0.1:5173');

  return list;
};

const isOriginAllowed = (origin, allowed) => {
  // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server health checks)
  if (!origin) return true;

  // If wildcard configured
  if (allowed === '*') return true;

  const normalizedOrigin = origin.replace(/\/+$/, '');

  // Exact match
  if (allowed.includes(normalizedOrigin)) return true;

  // In non-production mode, allow any localhost or 127.0.0.1 port (e.g. 5174, 3000, 8080)
  if (process.env.NODE_ENV !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return true;
    }
  }

  // Support wildcard domain patterns like *.netlify.app, *.vercel.app, *.onrender.com
  for (const item of allowed) {
    if (item.includes('*.')) {
      const rootDomain = item.replace(/^https?:\/\//, '').replace(/^\*\./, '');
      const pattern = new RegExp(`^https?:\\/\\/([a-z0-9-]+\\.)*${rootDomain.replace(/\./g, '\\.')}$`, 'i');
      if (pattern.test(normalizedOrigin)) return true;
    }
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    if (isOriginAllowed(origin, allowed)) {
      callback(null, true);
    } else {
      // Decline origin cleanly without throwing an unhandled Express 500 error
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Authorization', 'Content-Range', 'X-Total-Count'],
  maxAge: 86400, // 24 hours preflight caching to minimize latency
};

module.exports = corsOptions;
