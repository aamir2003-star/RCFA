// src/server.js
// HTTP server + Socket.io initialization

import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 3000;

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// Attach Socket.io
initSocket(httpServer);

// Connect to MongoDB then start listening
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io attached`);
    console.log(`🔗 API: http://localhost:${PORT}/api/v1/conflicts`);
  });
});