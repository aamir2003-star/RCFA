import express from "express";
import * as voteController from "../controllers/vote.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

// Cast or update a vote on a conflict
router.post("/", voteController.castVote);

// Get current vote tally for a conflict
router.get("/conflict/:conflictId", voteController.getVotes);

export default router;
