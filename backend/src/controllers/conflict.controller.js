// src/controllers/conflict.controller.js
// Handles HTTP requests for conflict analysis endpoints

import { startJob, getJobStatus } from '../jobs/conflictScanJob.js';
import { ConflictModel } from '../models/conflict/conflict.model.js';
import { emitConflictResolved } from '../sockets/events/conflictEvents.js';
/**
 * POST /api/v1/conflicts/analyze/:projectId
 * Triggers async conflict detection. Returns jobId and estimatedTime.
 */
export const analyzeConflicts = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'projectId is required',
            });
        }

        const { jobId, estimatedTime } = startJob(projectId);

        return res.status(202).json({
            success: true,
            message: 'Conflict analysis started',
            jobId,
            estimatedTime,
            statusUrl: `/api/v1/conflicts/analyze/${projectId}/status?jobId=${jobId}`,
        });
    } catch (err) {
        console.error('analyzeConflicts error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal server error',
        });
    }
};

/**
 * GET /api/v1/conflicts/analyze/:projectId/status?jobId=xxx
 * Returns current status and progress of a running analysis job.
 */
export const getAnalysisStatus = async (req, res) => {
    try {
        const { jobId } = req.query;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'jobId query parameter is required',
            });
        }

        const job = getJobStatus(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found. It may have expired or never existed.',
            });
        }

        return res.json({
            success: true,
            jobId,
            status: job.status,
            progress: job.progress,
            message: job.message,
            startedAt: job.startedAt,
            completedAt: job.completedAt || null,
            result: job.status === 'completed' ? {
                totalConflicts: job.result?.totalConflicts,
                requirementsAnalyzed: job.result?.requirementsAnalyzed,
                pairsChecked: job.result?.pairsChecked,
            } : null,
            error: job.error || null,
        });
    } catch (err) {
        console.error('getAnalysisStatus error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal server error',
        });
    }
};

/**
 * GET /api/v1/conflicts/:projectId
 * Returns all saved conflicts for a project with pagination.
 */
export const getConflicts = async (req, res) => {
    try {
        const { projectId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [conflicts, total] = await Promise.all([
            ConflictModel.find({ projectId })
                .populate('requirementA', 'title description category priority')
                .populate('requirementB', 'title description category priority')
                .sort({ severityScore: -1 }) // highest severity first
                .skip(skip)
                .limit(limit)
                .lean(),
            ConflictModel.countDocuments({ projectId }),
        ]);

        return res.json({
            success: true,
            projectId,
            total,
            page,
            pages: Math.ceil(total / limit),
            conflicts,
        });
    } catch (err) {
        console.error('getConflicts error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal server error',
        });
    }
};

/**
 * PATCH /api/v1/conflicts/:id/resolve
 * Marks a conflict as resolved and emits a socket event.
 */


export const resolveConflict = async (req, res) => {
    try {
        const { id } = req.params;
        const conflict = await ConflictModel.findByIdAndUpdate(
            id,
            { status: 'resolved' },
            { new: true }
        );

        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Conflict not found' });
        }

        // Emit socket event for real-time UI update
        emitConflictResolved(conflict.projectId, id);

        return res.json({
            success: true,
            message: 'Conflict resolved successfully',
            conflict,
        });
    } catch (err) {
        console.error('resolveConflict error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
