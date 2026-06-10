import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    name: { type: String, required: true },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    requirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirement",
      },
    ],

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

moduleSchema.index({ projectId: 1, name: 1 }, { unique: true });

export const ModuleModel = mongoose.model("Module", moduleSchema);
