// src/routes/conflict.routes.js
// API routes for conflict detection and fetching

import { Router } from 'express';
import {
    analyzeConflicts,
    getAnalysisStatus,
    getConflicts,
} from '../controllers/conflict.controller.js';

const router = Router();

/**
 * POST /api/v1/conflicts/analyze/:projectId
 * Trigger asynchronous conflict detection for a project.
 * Returns: { jobId, estimatedTime, statusUrl }
 */
router.post('/analyze/:projectId', analyzeConflicts);

/**
 * GET /api/v1/conflicts/analyze/:projectId/status?jobId=xxx
 * Poll the current status and progress of an analysis job.
 * Returns: { status, progress, message, result }
 */
router.get('/analyze/:projectId/status', getAnalysisStatus);

/**
 * GET /api/v1/conflicts/:projectId
 * Get all detected conflicts for a project (paginated).
 * Query: ?page=1&limit=20
 */
router.get('/:projectId', getConflicts);

export default router;
