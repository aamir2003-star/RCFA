import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const VaultModel = mongoose.model("Vault", vaultSchema);
