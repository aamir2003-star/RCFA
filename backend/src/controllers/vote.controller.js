import * as voteService from "../services/vote.service.js";
import { ConflictModel } from "../models/conflict/conflict.model.js";
import { emitVoteUpdate } from "../sockets/events/voteEvents.js";
import { emitConflictResolved } from "../sockets/events/conflictEvents.js";

export const castVote = async (req, res, next) => {
    try {
        const { conflictId, choice, comment } = req.body;

        // 1. Find conflict to get projectId for socket room
        const conflict = await ConflictModel.findById(conflictId);
        if (!conflict) return res.status(404).json({ message: "Conflict not found" });

        // 2. Cast/Update the vote
        const vote = await voteService.castVote({
            conflictId,
            userId: req.user._id,
            choice,
            comment
        });

        // 3. Tally and broadcast
        const { tally, total } = await voteService.getVotesForConflict(conflictId);
        emitVoteUpdate(conflict.projectId, { conflictId, tally, total });

        // 4. Trigger resolution check
        const resolution = await voteService.checkAndResolveConflict(conflictId);

        if (resolution.resolved) {
            emitConflictResolved(conflict.projectId, conflictId);
        }

        res.status(201).json({ vote, resolution, tally, total });
    } catch (error) {
        next(error);
    }
};

export const getVotes = async (req, res, next) => {
    try {
        const results = await voteService.getVotesForConflict(req.params.conflictId);
        res.json(results);
    } catch (error) {
        next(error);
    }
};
