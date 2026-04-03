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
      enum: ["open", "resolved", "ignored", "pending_confirmation"],
      default: "open",
      index: true
    },

    discussions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        attachments: [{ type: String }], // URL-to-file
        timestamp: { type: Date, default: Date.now }
      }
    ],

    // User-proposed resolution ideas
    proposals: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        attachments: [{ type: String }],
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Those who liked it
        timestamp: { type: Date, default: Date.now }
      }
    ],

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
    },

    pmResolution: {
      resolutionId: { type: String }, // Reference to resolution _id (string because subdoc ids can be tricky)
      type: { type: String, enum: ["ai_resolution", "developer_proposal"], default: "ai_resolution" },
      confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      confirmedAt: { type: Date }
    }
  },
  { timestamps: true }
);

conflictSchema.index({ projectId: 1, status: 1 });

export const ConflictModel = mongoose.model("Conflict", conflictSchema);
