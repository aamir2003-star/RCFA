import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true
    },

    action: String,

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

activitySchema.index({ projectId: 1, createdAt: -1 });

export const ActivityModel = mongoose.model("Activity", activitySchema);
