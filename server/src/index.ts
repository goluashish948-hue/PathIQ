import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static files for local storage
const uploadDir = path.resolve(process.cwd(), process.env.LOCAL_STORAGE_PATH || './uploads');
app.use('/api/v1/storage', express.static(uploadDir));

// API routes
app.use('/api/v1', apiRouter);

// Serve frontend static build if present (Unified full-stack production deployment)
const clientDistCandidates = [
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), './client/dist'),
  path.resolve(process.cwd(), './client-dist'),
];

let staticClientDir: string | null = null;
for (const cand of clientDistCandidates) {
  if (fs.existsSync(cand)) {
    staticClientDir = cand;
    break;
  }
}

if (staticClientDir) {
  app.use(express.static(staticClientDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(staticClientDir!, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PathIQ API server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
});
