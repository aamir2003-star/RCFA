import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user._id);
        const unreadCount = await notificationService.getUnreadCount(req.user._id);
        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        next(error);
    }
};

export const markRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        res.json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

export const markAllRead = async (req, res, next) => {
    try {
        await notificationService.markAllAsRead(req.user._id);
        res.json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        next(error);
    }
};

export const markUnread = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsUnread(req.params.id);
        res.json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.params.id);
        res.json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        next(error);
    }
};
