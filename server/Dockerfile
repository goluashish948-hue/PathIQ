FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install

# Copy source files
COPY server ./server
COPY client ./client

# Build client and server
RUN npm run build --workspace=client
RUN npm run build --workspace=server
RUN cd server && npx prisma generate

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install --omit=dev --workspace=server

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5001

CMD ["sh", "-c", "cd server && npx prisma db push && npm run seed && node dist/index.js"]
