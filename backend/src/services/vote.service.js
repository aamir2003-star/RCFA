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

    // Calculate tally
    const tally = votes.reduce((acc, vote) => {
        acc[vote.choice] = (acc[vote.choice] || 0) + 1;
        return acc;
    }, { requirementA: 0, requirementB: 0, none: 0, both: 0 });

    return {
        votes,
        tally,
        total: votes.length
    };
};

export const checkAndResolveConflict = async (conflictId) => {
    const { tally, total } = await getVotesForConflict(conflictId);

    // Basic resolution logic: if total votes > 3 and a clear majority (e.g. > 60%)
    if (total >= 3) {
        const threshold = total * 0.6;
        let winner = null;

        if (tally.requirementA > threshold) winner = "requirementA";
        if (tally.requirementB > threshold) winner = "requirementB";

        if (winner) {
            await ConflictModel.findByIdAndUpdate(conflictId, {
                status: "resolved",
                aiSuggestion: `Resolved by stakeholder consensus: ${winner === "requirementA" ? "Requirement A" : "Requirement B"} selected.`
            });
            return { resolved: true, winner };
        }
    }

    return { resolved: false };
};
