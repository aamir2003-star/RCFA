// src/sockets/events/conflictEvents.js
// Emits conflict:new Socket.io events to clients in the project room

import { getIO } from '../../config/socket.js';

/**
 * Emit a conflict:new event to all clients in a project's room.
 * Fails silently if Socket.io is not initialized (e.g. during tests).
 *
 * @param {string} projectId
 * @param {Object} conflict - the conflict document to broadcast
 */
export const emitConflictNew = (projectId, conflict) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('conflict:new', {
            projectId,
            conflict,
            timestamp: new Date().toISOString(),
        });
        console.debug(`📡 Emitted conflict:new to project:${projectId}`);
    } catch {
        // Socket.io not initialized (tests, CLI mode) — skip silently
    }
};

/**
 * Emit an analysis:progress event to track job completion %.
 * @param {string} projectId
 * @param {string} jobId
 * @param {number} progress - 0 to 100
 * @param {string} message
 */
export const emitAnalysisProgress = (projectId, jobId, progress, message) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('analysis:progress', {
            projectId,
            jobId,
            progress,
            message,
            timestamp: new Date().toISOString(),
        });
    } catch {
        // Silent fallback
    }
};

/**
 * Emit a conflict:resolved event.
 * @param {string} projectId
 * @param {string} conflictId
 */
export const emitConflictResolved = (projectId, conflictId) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('conflict:resolved', {
            projectId,
            conflictId,
            timestamp: new Date().toISOString(),
        });
        console.debug(`📡 Emitted conflict:resolved for ${conflictId}`);
    } catch {
        // Silent fallback
    }
};
/**
 * Emit a conflict:comment event.
 * @param {string} projectId
 * @param {string} conflictId
 * @param {Object} comment - the new comment object
 */
export const emitConflictComment = (projectId, conflictId, comment) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('conflict:comment', {
            projectId,
            conflictId,
            comment,
            timestamp: new Date().toISOString(),
        });
        console.debug(`📡 Emitted conflict:comment for ${conflictId}`);
    } catch {
        // Silent fallback
    }
};

/**
 * Emit a conflict:proposal event.
 * @param {string} projectId
 * @param {string} conflictId
 * @param {Object} proposal - the new proposal object
 */
export const emitConflictProposal = (projectId, conflictId, proposal) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('conflict:proposal', {
            projectId,
            conflictId,
            proposal,
            timestamp: new Date().toISOString(),
        });
        console.debug(`📡 Emitted conflict:proposal for ${conflictId}`);
    } catch {
        // Silent fallback
    }
};
