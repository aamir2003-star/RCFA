// src/server.js
import 'dotenv/config';
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000;

// connect DB first
connectDB();

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});