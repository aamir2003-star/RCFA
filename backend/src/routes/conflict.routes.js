// src/routes/conflict.routes.js
// API routes for conflict detection and fetching

import { Router } from 'express';
import {
    analyzeConflicts,
    checkConflictStatus,
    getProjectConflicts,
    getAllPmConflicts,
    getAllDevConflicts,
    getConflictById,
    addConflictComment,
    addConflictProposal,
    voteProposal,
    confirmConflictResolution,
    resolveConflict,
} from '../controllers/conflict.controller.js';
import { authenticate } from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { uploadConflict } from "../utils/upload.utils.js";

const router = Router();

/**
 * POST /api/v1/conflicts/analyze/:projectId
 * Trigger asynchronous conflict detection for a project.
 */
router.post('/analyze/:projectId', authenticate, analyzeConflicts);

/**
 * GET /api/v1/conflicts/status/:projectId
 * Poll the current status and progress of an analysis job.
 */
router.get('/status/:projectId', authenticate, checkConflictStatus);

router.get('/pm/all', authenticate, getAllPmConflicts);

/**
 * GET /api/v1/conflicts/dev/all
 * Get all conflicts across all projects the Dev has modules in.
 */
router.get('/dev/all', authenticate, getAllDevConflicts);

/**
 * GET /api/v1/conflicts/:projectId
 * Get all detected conflicts for a project (paginated).
 */
router.get('/:projectId', authenticate, getProjectConflicts);

/**
 * GET /api/v1/conflicts/detail/:id
 * Get a single conflict by ID.
 */
router.get('/detail/:id', authenticate, getConflictById);

/**
 * POST /api/v1/conflicts/:id/comment
 * Add a comment to a conflict discussion.
 */
router.post('/:id/comment', authenticate, uploadConflict.array('attachments', 5), addConflictComment);

/**
 * POST /api/v1/conflicts/:id/propose
 * Add a human-proposed resolution idea.
 */
router.post('/:id/propose', authenticate, uploadConflict.array('attachments', 5), addConflictProposal);

/**
 * POST /api/v1/conflicts/proposals/:proposalId/vote
 * Toggle a vote on a proposal.
 */
router.post('/proposals/:proposalId/vote', authenticate, voteProposal);

/**
 * PATCH /api/v1/conflicts/:id/confirm
 * PM confirms a resolution strategy.
 */
router.patch('/:id/confirm', authenticate, authorize('PM'), confirmConflictResolution);

/**
 * PATCH /api/v1/conflicts/:id/resolve
 * Resolve a conflict (Legacy).
 */
router.patch('/:id/resolve', authenticate, authorize('PM'), resolveConflict);

export default router;
