import mongoose  from "mongoose";

const conflictSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    requirementA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement"
    },

    requirementB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement"
    },

    type: {
      type: String,
      enum: ["contradiction", "duplicate", "dependency"]
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"]
    },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open"
    },

    aiSuggestion: String,

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const ConflictModel = mongoose.model("Conflict", conflictSchema);
