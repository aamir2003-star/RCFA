import * as voteService from "../services/vote.service.js";

export const castVote = async (req, res, next) => {
    try {
        const { conflictId, choice, comment } = req.body;
        const vote = await voteService.castVote({
            conflictId,
            userId: req.user._id,
            choice,
            comment
        });

        // Trigger resolution check
        const resolution = await voteService.checkAndResolveConflict(conflictId);

        res.status(201).json({ vote, resolution });
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
