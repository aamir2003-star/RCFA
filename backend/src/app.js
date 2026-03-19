import express from "express";
import projectRoutes from "./models/project/project.routes.js";

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);


// root
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;