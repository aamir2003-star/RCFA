import express from "express";
import * as reportController from "../controllers/report.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("BDE", "PM"), reportController.generateReport);
router.get("/project/:projectId", reportController.getProjectReports);

export default router;
