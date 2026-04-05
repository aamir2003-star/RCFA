import React, { useEffect, useMemo } from "react";
import {
    Bell,
    CheckCheck,
    MoreHorizontal,
    ShieldAlert,
    MessageSquare,
    Zap,
    Filter,
    Clock,
    UserPlus,
    Info,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import useNotificationStore from "../stores/useNotificationStore";
import { formatDistanceToNow } from "date-fns";

const TYPE_CONFIG = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    critical: { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-600/10' },
    discussion: { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ai: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    system: { icon: UserPlus, color: 'text-slate-500', bg: 'bg-slate-500/10' }
};

export default function Notifications() {
    const {
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [notifications]);

    if (loading && notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="size-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading updates...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-indigo-500" />
                        Updates & Alerts
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{unreadCount} unread</span> notifications.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm active:scale-95 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className={cn(
                            "flex items-center gap-2 font-black px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest",
                            unreadCount > 0
                                ? "bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532]"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark All as Read
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/5 dark:shadow-none overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sortedNotifications.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                <Bell className="size-8" />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No notifications yet</p>
                        </div>
                    ) : sortedNotifications.map((notif) => {
                        const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
                        const Icon = config.icon;

                        return (
                            <div
                                key={notif._id}
                                onClick={() => !notif.isRead && markAsRead(notif._id)}
                                className={cn(
                                    "p-6 md:p-8 flex gap-6 group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all cursor-pointer relative",
                                    !notif.isRead && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/[0.02]"
                                )}
                            >
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-lg", config.bg)}>
                                    <Icon className={cn("size-6", config.color)} />
                                </div>
                                <div className="flex-1 space-y-2 text-left">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className={cn("font-bold text-base tracking-tight", !notif.isRead ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
                                                {notif.title}
                                            </h3>
                                            {!notif.isRead && <span className="bg-indigo-500 size-2 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse"></span>}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0 ml-4">
                                            <Clock className="size-3" />
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className={cn("text-sm font-medium leading-relaxed max-w-2xl", !notif.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500")}>
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-4 pt-2">
                                        {notif.link && (
                                            <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] hover:underline">
                                                View Source →
                                            </button>
                                        )}
                                        <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] hover:text-slate-600 transition-colors">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                                <button className="self-start p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="size-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {sortedNotifications.length > 0 && (
                <div className="flex justify-center pt-8">
                    <button className="px-10 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all active:scale-95 shadow-sm">
                        Load Older Notifications
                    </button>
                </div>
            )}
        </div>
    );
}
