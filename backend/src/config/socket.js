// src/config/socket.js
// Socket.io singleton — init once from server.js, then get anywhere
import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.io with the HTTP server.
 * Call once in server.js.
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // tighten in production
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Client joins a project room to receive project-specific events
        socket.on('join:project', (projectId) => {
            socket.join(`project:${projectId}`);
            console.log(`📦 Socket ${socket.id} joined project:${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    console.log('✅ Socket.io initialized');
    return io;
};

/**
 * Get the Socket.io instance after initialization.
 */
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized. Call initSocket(httpServer) first.');
    }
    return io;
};
