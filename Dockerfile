# ── BUILD STAGE ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install openssl for prisma client generation
RUN apk add --no-cache openssl

# Salin package.json dan package-lock.json untuk install dependencies
COPY package*.json ./
RUN npm ci

# Salin seluruh source code proyek
COPY . .

# Generate Prisma Client & compile TypeScript ke JavaScript
ENV DIRECT_URL=postgresql://postgres:postgres@localhost:5432/db
RUN npx prisma generate
RUN npm run build

# Bersihkan devDependencies untuk memperkecil ukuran image
RUN npm prune --omit=dev

# ── RUNNER STAGE ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Install openssl (wajib untuk Prisma Client di Alpine)
RUN apk add --no-cache openssl

# Salin file-file esensial dari builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

EXPOSE 3000

# Set default env
ENV NODE_ENV=staging
ENV PORT=3000
ENV HOST=0.0.0.0

# Jalankan server
CMD ["node", "dist/src/server.js"]
