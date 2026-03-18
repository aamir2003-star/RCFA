import mongoose  from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    name: { type: String, required: true },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    requirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirement"
      }
    ],

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);
export const ModuleModel = mongoose.model("Module", moduleSchema);
