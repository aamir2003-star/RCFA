import { NotificationModel } from "../models/notification/notification.model.js";
import { getIO } from "../config/socket.js";

/**
 * Create a new notification and emit via socket
 */
export const createNotification = async (data) => {
    const notification = await NotificationModel.create(data);

    // Emit to user room if socket is active
    try {
        const io = getIO();
        const recipientId = data.recipient.toString();
        io.to(`user:${recipientId}`).emit("new:notification", notification);
    } catch (error) {
        console.error("Socket emission failed:", error.message);
    }

    return notification;
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId, limit = 50) => {
    return await NotificationModel.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit);
};

/**
 * Get unread count
 */
export const getUnreadCount = async (userId) => {
    return await NotificationModel.countDocuments({ recipient: userId, isRead: false });
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
    return await NotificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
    );
};

/**
 * Mark all as read for user
 */
export const markAllAsRead = async (userId) => {
    return await NotificationModel.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
    );
};

/**
 * Mark notification as unread
 */
export const markAsUnread = async (notificationId) => {
    return await NotificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: false },
        { new: true }
    );
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
    return await NotificationModel.findByIdAndDelete(notificationId);
};
