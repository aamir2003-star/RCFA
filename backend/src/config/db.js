// src/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
};
