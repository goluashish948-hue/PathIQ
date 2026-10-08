import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PathIQ API server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
});
