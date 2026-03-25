import express from "express";
import cors from "cors";
import projectRoutes from "./models/project/project.routes.js";
import authRoutes from "../src/routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);
app.use("/api/v1/auth", authRoutes, rateLimiter);

// 👇 ALWAYS LAST
app.use(errorHandler);
// Apply globally
app.use(rateLimiter);

// root
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;