import express from "express";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.get("/:id/stats", projectController.getProjectStats);
router.get("/bde/stats", projectController.getBdeStats);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;