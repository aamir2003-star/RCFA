import express from "express";
import * as projectController from "../controllers/project.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.post("/", projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/bde/stats", projectController.getBdeStats);
router.get("/pm/stats", projectController.getPmStats);
router.get("/pm/activity", projectController.getPmActivity);
router.get("/:id", projectController.getProjectById);
router.get("/:id/stats", projectController.getProjectStats);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;