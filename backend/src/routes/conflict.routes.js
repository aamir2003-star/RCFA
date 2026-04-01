// src/routes/conflict.routes.js
// API routes for conflict detection and fetching

import { Router } from 'express';
import {
    analyzeConflicts,
    getAnalysisStatus,
    getConflicts,
    getAllPmConflicts,
} from '../controllers/conflict.controller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import { resolveConflict } from '../controllers/conflict.controller.js';

const router = Router();

/**
 * POST /api/v1/conflicts/analyze/:projectId
 * Trigger asynchronous conflict detection for a project.
 */
router.post('/analyze/:projectId', analyzeConflicts);

/**
 * GET /api/v1/conflicts/analyze/:projectId/status?jobId=xxx
 * Poll the current status and progress of an analysis job.
 */
router.get('/analyze/:projectId/status', getAnalysisStatus);

/**
 * GET /api/v1/conflicts/pm/all
 * Get all conflicts across all of the PM's projects.
 * Must be BEFORE /:projectId to avoid route collision.
 */
router.get('/pm/all', authenticate, getAllPmConflicts);

/**
 * GET /api/v1/conflicts/:projectId
 * Get all detected conflicts for a project (paginated).
 */
router.get('/:projectId', getConflicts);

/**
 * PATCH /api/v1/conflicts/:id/resolve
 * Resolve a conflict.
 */
router.patch('/:id/resolve', authenticate, authorize('PM'), resolveConflict);

export default router;
