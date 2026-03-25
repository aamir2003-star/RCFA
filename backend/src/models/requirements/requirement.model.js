import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true
    },

    title: { type: String, required: true },

    description: { type: String, default: "" },

    // Category — auto-classified by requirementClassifier.js if not provided
    category: {
      type: String,
      enum: ["Functional", "Performance", "Security", "Cost", "Scalability"],
      default: "Functional"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    status: {
      type: String,
      enum: ["draft", "review", "approved"],
      default: "draft"
    },

    // Stakeholder role — used for severity weight calculation
    stakeholder: {
      type: String,
      enum: ["Legal", "Security", "PM", "Architect", "Developer", "Other"],
      default: "Developer"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module"
    },

    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirement"
      }
    ],

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export const RequirementModel = mongoose.model("Requirement", requirementSchema);
