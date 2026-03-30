import express from "express";
import * as requirementController from "../controllers/requirement.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("BDE", "PM"), requirementController.createRequirement);
router.get("/", requirementController.getRequirements);
router.get("/:id", requirementController.getRequirementById);
router.patch("/:id", authorize("BDE", "PM", "DEV"), requirementController.updateRequirement);
router.delete("/:id", authorize("PM"), requirementController.deleteRequirement);

export default router;
