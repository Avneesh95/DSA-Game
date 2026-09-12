# Dockerfile for DSA 100 Doors Backend
# Uses Docker runtime on Render to get g++, gcc, and JDK all in one image.

FROM node:20-slim

# Install compilers: g++, gcc, and OpenJDK 21
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      g++ \
      gcc \
      default-jdk-headless \
      python3 \
      curl \
    && rm -rf /var/lib/apt/lists/*

# Symlink python3 → python so the runner can use 'python3'
RUN ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Copy package files and install dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Copy the rest of the server code
COPY server/ .

# Expose port (Render sets PORT env var)
EXPOSE 10000

CMD ["node", "server.js"]
