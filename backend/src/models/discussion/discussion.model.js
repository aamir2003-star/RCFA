import mongoose  from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    conflictId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conflict"
    },

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export const DiscussionModel = mongoose.model("Discussion", discussionSchema);
