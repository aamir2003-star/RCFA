import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        conflictId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conflict",
            required: true,
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // Which requirement the user thinks should stay
        choice: {
            type: String,
            enum: ["requirementA", "requirementB", "none", "both"],
            required: true
        },
        comment: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

// Ensure a user can only vote once per conflict
voteSchema.index({ conflictId: 1, userId: 1 }, { unique: true });

export const VoteModel = mongoose.model("Vote", voteSchema);
