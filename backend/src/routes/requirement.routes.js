import express from "express";
import * as requirementController from "../controllers/requirement.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
    }
});

const upload = multer({ storage });

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("BDE", "PM"), requirementController.createRequirement);
router.post("/upload-csv", authorize("BDE", "PM"), upload.single("file"), requirementController.uploadRequirements);
router.get("/", requirementController.getRequirements);
router.get("/:id", requirementController.getRequirementById);
router.patch("/:id", authorize("BDE", "PM", "DEV"), requirementController.updateRequirement);
router.delete("/:id", authorize("PM"), requirementController.deleteRequirement);

export default router;
