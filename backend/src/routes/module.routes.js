import express from "express";
import validateRequest from "../middleware/validateRequest.js";
import {
  assignDeveloperSchema,
  createModuleSchema,
  updateModuleSchema,
} from "../validations/module.validation.js";
import * as moduleController from "../controllers/module.controller.js";

const router = express.Router();

router.get("/", moduleController.getAllModules);
router.get("/project/:projectId/developers", moduleController.getProjectDevelopers);
router.get("/:id", moduleController.getModuleById);
router.get("/:id/assignment-suggestions", moduleController.getAssignmentSuggestions);
router.post("/suggest", moduleController.suggestModuleInfo);
router.post("/", validateRequest(createModuleSchema), moduleController.createModule);
router.patch("/:id", validateRequest(updateModuleSchema), moduleController.updateModule);
router.patch(
  "/:id/assign",
  validateRequest(assignDeveloperSchema),
  moduleController.assignDeveloper
);
router.post("/:id/assign-suggested", moduleController.assignSuggestedDeveloper);
router.patch("/:id/status", moduleController.updateModuleStatus);
router.delete("/:id", moduleController.deleteModule);

export default router;
