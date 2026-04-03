import { VoteModel } from "../models/conflict/vote.model.js";
import { ConflictModel } from "../models/conflict/conflict.model.js";

export const castVote = async (voteData) => {
    // Upsert the vote (if user already voted, update it)
    const vote = await VoteModel.findOneAndUpdate(
        { conflictId: voteData.conflictId, userId: voteData.userId },
        voteData,
        { upsert: true, new: true }
    );
    return vote;
};

export const getVotesForConflict = async (conflictId) => {
    const votes = await VoteModel.find({ conflictId }).populate("userId", "name role");

    // Calculate dynamic tally
    const tally = votes.reduce((acc, vote) => {
        acc[vote.choice] = (acc[vote.choice] || 0) + 1;
        return acc;
    }, {});

    return {
        votes,
        tally,
        total: votes.length
    };
};

export const checkAndResolveConflict = async (conflictId) => {
    // Legacy automated resolution logic removed in favor of PM manual confirmation
    return { resolved: false };
};
