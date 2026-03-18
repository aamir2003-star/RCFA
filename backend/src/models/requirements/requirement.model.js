import mongoose  from "mongoose";
const requirementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    title: { type: String, required: true },

    description: String,

    priority: {
      type: String,
      enum: ["low", "medium", "high"]
    },

    status: {
      type: String,
      enum: ["draft", "review", "approved"],
      default: "draft"
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

export const RequirementModel =  mongoose.model("Requirement", requirementSchema);
