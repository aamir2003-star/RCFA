import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clientName: { type: String, default: "Internal" },

    description: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // BDE
    },

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    budget: Number,
    timeline: String,

    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },
  },
  { timestamps: true },
);

export const ProjectModel = mongoose.model("Project", projectSchema);
