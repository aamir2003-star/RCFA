import mongoose from "mongoose";

const conflictSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    requirementA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true
    },

    requirementB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true
    },

    // Legacy field kept for backward compatibility
    type: {
      type: String,
      enum: [
        "contradiction",
        "duplicate",
        "dependency",
        "Security vs Performance",
        "Cost vs Scalability",
        "Encryption vs Latency",
        "EEA vs Global Replication",
        "AI Detected",
        "Unknown"
      ]
    },

    // New: human-readable conflict type from engine
    conflictType: {
      type: String,
      default: "Unknown"
    },

    // Severity score 1–10 from severityScorer
    severityScore: {
      type: Number,
      min: 1,
      max: 10
    },

    // Color band based on severity score
    severityColor: {
      type: String,
      enum: ["Red", "Orange", "Yellow", "Green"],
      default: "Yellow"
    },

    // AI confidence 0–1
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },

    // Detection source
    source: {
      type: String,
      enum: ["rule", "ai"],
      default: "rule"
    },

    // One-sentence explanation of conflict
    explanation: {
      type: String,
      default: ""
    },

    // Feasibility impact from feasibilityEstimator
    feasibility: {
      timelineImpact: { type: String, default: "0%" },
      costImpact: { type: String, default: "0%" },
      riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
      }
    },

    // Affected downstream modules
    affectedModules: [{ type: String }],

    // Resolution status
    status: {
      type: String,
      enum: ["open", "resolved", "ignored"],
      default: "open",
      index: true
    },

    aiSuggestion: String,

    resolutions: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        strategyType: {
          type: String,
          enum: ["Compromise", "Strict", "Alternative", "Hybrid"],
          default: "Compromise"
        }
      }
    ],

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

conflictSchema.index({ projectId: 1, status: 1 });

export const ConflictModel = mongoose.model("Conflict", conflictSchema);
