import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    status: {
      type: String,
      enum: ["draft", "pending", "in-review", "approved", "rejected"],
      default: "pending"
    },

    source: {
      type: String,
      enum: ["PM", "AI"],
      default: "PM"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    approvedAt: Date,

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

    conflictDetected: {
      type: Boolean,
      default: false
    },

    version: {
      type: Number,
      default: 1
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const RequirementModel = mongoose.model("Requirement", requirementSchema);