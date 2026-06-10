import express from "express";
import * as vaultController from "../controllers/vault.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

// Only developers and PMs can add to the technical vault
router.post("/", authorize("DEV", "PM"), vaultController.createVaultItem);
router.get("/project/:projectId", vaultController.getProjectVault);
router.patch("/:id", authorize("DEV", "PM"), vaultController.updateVaultItem);

export default router;
