// src/sockets/events/voteEvents.js
// Emits vote:update Socket.io events to clients in the project room

import { getIO } from '../../config/socket.js';

/**
 * Emit a vote:update event to all clients in a project's room.
 * 
 * @param {string} projectId
 * @param {Object} update - { conflictId, tally, total }
 */
export const emitVoteUpdate = (projectId, update) => {
    try {
        const io = getIO();
        io.to(`project:${projectId}`).emit('vote:update', {
            projectId,
            ...update,
            timestamp: new Date().toISOString(),
        });
        console.debug(`📡 Emitted vote:update to project:${projectId} for conflict:${update.conflictId}`);
    } catch {
        // Silent fallback
    }
};
