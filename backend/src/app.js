// src/app.js
// Express app configuration — middleware, routes, seed endpoint

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// ─── Routes ─────────────────────────────────────────────────────────────────
import projectRoutes from './routes/project.routes.js';
import moduleRoutes from './routes/module.routes.js';
import authRoutes from './routes/auth.routes.js';
import conflictRoutes from './routes/conflict.routes.js';
import requirementRoutes from './routes/requirement.routes.js';
import vaultRoutes from './routes/vault.routes.js';
import reportRoutes from './routes/report.routes.js';
import voteRoutes from './routes/vote.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// ─── Middleware ──────────────────────────────────────────────────────────────
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const app = express();

// ─── Global Middleware ───────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(rateLimiter);

// ─── Mount API Routes ────────────────────────────────────────────────────────
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/conflicts', conflictRoutes);
app.use('/api/v1/requirements', requirementRoutes);
app.use('/api/v1/vault', vaultRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// ─── Root ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'RCFA API is running',
    version: '1.0.0',
    endpoints: {
      analyzeConflicts: 'POST /api/v1/conflicts/analyze/:projectId',
      getStatus: 'GET /api/v1/conflicts/analyze/:projectId/status?jobId=xxx',
      getConflicts: 'GET /api/v1/conflicts/:projectId',
    },
  });
});


// ─── Global Error Handler (ALWAYS LAST) ─────────────────────────────────────
app.use(errorHandler);

export default app;
