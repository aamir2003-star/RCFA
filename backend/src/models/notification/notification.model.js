import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["info", "warning", "success", "error"],
            default: "info"
        },
        link: {
            type: String
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

// Index for fetching unread notifications quickly
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const NotificationModel = mongoose.model("Notification", notificationSchema);
