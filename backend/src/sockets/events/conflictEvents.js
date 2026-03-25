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
