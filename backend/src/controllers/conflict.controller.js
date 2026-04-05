// src/controllers/conflict.controller.js
// Handles HTTP requests for conflict analysis endpoints

import { startJob, getJobStatus } from '../jobs/conflictScanJob.js';
import { ConflictModel } from '../models/conflict/conflict.model.js';
import { ProjectModel } from '../models/project/project.model.js';
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

        const { jobId, estimatedTime } = startJob(projectId, req.user.id);

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
export const checkConflictStatus = async (req, res) => {
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
export const getProjectConflicts = async (req, res) => {
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
 * GET /api/v1/conflicts/pm/all
 * Returns all conflicts across all of the authenticated PM's projects.
 */
export const getAllPmConflicts = async (req, res) => {
    try {
        const pmId = req.user._id;
        const pmProjectIds = await ProjectModel.find({ projectManager: pmId }).distinct('_id');

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const [conflicts, total] = await Promise.all([
            ConflictModel.find({ projectId: { $in: pmProjectIds } })
                .populate('requirementA', 'title description')
                .populate('requirementB', 'title description')
                .populate('projectId', 'name')
                .sort({ severityScore: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ConflictModel.countDocuments({ projectId: { $in: pmProjectIds } })
        ]);

        return res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            conflicts
        });
    } catch (err) {
        console.error('getAllPmConflicts error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/v1/conflicts/:id/resolve
 * Marks a conflict as resolved and emits a socket event.
 */


/**
 * GET /api/v1/conflicts/detail/:id
 * Returns a single conflict with populated details and votes.
 */
export const getConflictById = async (req, res) => {
    try {
        const { id } = req.params;
        const conflict = await ConflictModel.findById(id)
            .populate('requirementA', 'title description category priority')
            .populate('requirementB', 'title description category priority')
            .populate('discussions.user', 'name role avatar')
            .populate('proposals.user', 'name role avatar')
            .lean();

        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Conflict not found' });
        }

        return res.json({ success: true, conflict });
    } catch (err) {
        console.error('getConflictById error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/v1/conflicts/:id/comment
 * Adds a comment to the conflict discussion.
 */
export const addConflictComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const attachments = req.files ? req.files.map(f => `/uploads/conflicts/${f.filename}`) : [];

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const conflict = await ConflictModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    discussions: {
                        user: req.user._id,
                        message,
                        attachments,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        ).populate('discussions.user', 'name role avatar');

        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Conflict not found' });
        }

        return res.json({ success: true, discussions: conflict.discussions });
    } catch (err) {
        console.error('addConflictComment error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/v1/conflicts/:id/propose
 * Adds a human-proposed resolution idea.
 */
export const addConflictProposal = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const attachments = req.files ? req.files.map(f => `/uploads/conflicts/${f.filename}`) : [];

        if (!text) {
            return res.status(400).json({ success: false, message: 'Proposal text is required' });
        }

        const conflict = await ConflictModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    proposals: {
                        user: req.user._id,
                        text,
                        attachments,
                        votes: [],
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        ).populate('proposals.user', 'name role avatar');

        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Conflict not found' });
        }

        return res.json({ success: true, proposals: conflict.proposals });
    } catch (err) {
        console.error('addConflictProposal error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/v1/conflicts/proposals/:proposalId/vote
 * Toggles a vote on a resolution proposal.
 */
export const voteProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const userId = req.user._id;

        const conflict = await ConflictModel.findOne({ "proposals._id": proposalId });
        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Proposal not found' });
        }

        const proposal = conflict.proposals.id(proposalId);
        const voteIndex = proposal.votes.indexOf(userId);

        if (voteIndex > -1) {
            proposal.votes.splice(voteIndex, 1);
        } else {
            proposal.votes.push(userId);
        }

        await conflict.save();

        const updatedConflict = await ConflictModel.findById(conflict._id)
            .populate('proposals.user', 'name role avatar');

        return res.json({ success: true, proposals: updatedConflict.proposals });
    } catch (err) {
        console.error('voteProposal error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

import { RequirementModel } from '../models/requirements/requirement.model.js';

/**
 * PATCH /api/v1/conflicts/:id/confirm
 * PM confirms a resolution strategy and updates requirements accordingly.
 */
export const confirmConflictResolution = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolutionId, type = 'ai_resolution' } = req.body;

        if (!resolutionId) {
            return res.status(400).json({ success: false, message: 'resolutionId is required' });
        }

        // 1. Fetch Conflict and Resolution Details
        const conflict = await ConflictModel.findById(id);
        if (!conflict) {
            return res.status(404).json({ success: false, message: 'Conflict not found' });
        }

        let resolutionText = "";
        if (type === 'ai_resolution') {
            const strategy = conflict.resolutions.id(resolutionId);
            resolutionText = strategy ? `${strategy.strategyType}: ${strategy.title} - ${strategy.description}` : "AI Strategy";
        } else {
            const proposal = conflict.proposals.id(resolutionId);
            resolutionText = proposal ? `Developer/PM Proposal: ${proposal.text}` : "Manual Proposal";
        }

        // 2. Update the Conflict Status
        conflict.status = 'resolved';
        conflict.pmResolution = {
            resolutionId,
            type,
            confirmedBy: req.user._id,
            confirmedAt: new Date()
        };
        await conflict.save();

        // 3. Update the Conflicting Requirements
        const resolutionNote = `\n\n[RESOLVED CONFLICT: ${conflict.conflictType}]\nResolution: ${resolutionText}\nDecision by: ${req.user.name} on ${new Date().toLocaleDateString()}`;

        const requirements = await RequirementModel.find({ _id: { $in: [conflict.requirementA, conflict.requirementB] } });

        for (const reqDoc of requirements) {
            reqDoc.description = (reqDoc.description || "") + resolutionNote;
            reqDoc.status = 'approved';
            reqDoc.version = (reqDoc.version || 1) + 1;
            await reqDoc.save();
        }

        emitConflictResolved(conflict.projectId, id);

        return res.json({
            success: true,
            message: 'Conflict resolution confirmed and requirements updated',
            conflict
        });
    } catch (err) {
        console.error('confirmConflictResolution error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

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
