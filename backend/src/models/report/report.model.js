import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        title: { type: String, required: true },
        type: {
            type: String,
            enum: ["feasibility", "compliance", "technical", "summary"],
            default: "feasibility"
        },
        content: {
            summary: String,
            details: [String],
            riskLevel: String,
            score: Number
        },
        status: {
            type: String,
            enum: ["generating", "completed", "failed"],
            default: "generating"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const ReportModel = mongoose.model("Report", reportSchema);
