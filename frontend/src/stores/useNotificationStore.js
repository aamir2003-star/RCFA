import { create } from "zustand";
import api from "../lib/api";
import { getSocket } from "../lib/socket";

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const response = await api.get("/notifications");
            if (response.data.success) {
                set({
                    notifications: response.data.notifications,
                    unreadCount: response.data.unreadCount,
                    loading: false
                });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            const response = await api.patch(`/notifications/${id}/read`);
            if (response.data.success) {
                set((state) => {
                    const notification = state.notifications.find(n => n._id === id);
                    if (notification && notification.isRead) return state; // Already read

                    return {
                        notifications: state.notifications.map((n) =>
                            n._id === id ? { ...n, isRead: true } : n
                        ),
                        unreadCount: Math.max(0, state.unreadCount - 1)
                    };
                });
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    },

    markAsUnread: async (id) => {
        try {
            const response = await api.patch(`/notifications/${id}/unread`);
            if (response.data.success) {
                set((state) => {
                    const notification = state.notifications.find(n => n._id === id);
                    if (notification && !notification.isRead) return state; // Already unread

                    return {
                        notifications: state.notifications.map((n) =>
                            n._id === id ? { ...n, isRead: false } : n
                        ),
                        unreadCount: (state.unreadCount || 0) + 1
                    };
                });
            }
        } catch (error) {
            console.error("Failed to mark notification as unread:", error);
        }
    },

    deleteNotification: async (id) => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            if (response.data.success) {
                set((state) => {
                    const notification = state.notifications.find(n => n._id === id);
                    const wasUnread = notification && !notification.isRead;

                    return {
                        notifications: state.notifications.filter((n) => n._id !== id),
                        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
                    };
                });
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await api.patch("/notifications/read-all");
            if (response.data.success) {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0
                }));
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: (state.unreadCount || 0) + 1
        }));
    },

    initSocket: (userId) => {
        if (!userId) return;

        const socket = getSocket();
        if (!socket) return;

        socket.emit("join:user", userId);

        socket.on("new:notification", (notification) => {
            get().addNotification(notification);

            // Optional: Play a sound or show a toast
            if (Notification.permission === "granted") {
                new Notification(notification.title, { body: notification.message });
            }
        });

        return () => {
            socket.off("new:notification");
        };
    }
}));

export default useNotificationStore;
