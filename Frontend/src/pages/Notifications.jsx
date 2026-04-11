import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bell, Activity, MessageSquare, Zap, Layers, Settings, LogOut, Search, User, Menu, Clock, CheckCheck, Link as LinkIcon } from "lucide-react";
import { cn } from "../lib/utils";
import useNotificationStore from "../stores/useNotificationStore";
import useAuthStore from "../stores/useAuthStore";

export default function Notifications() {
    const { role } = useParams();
    const { notifications, fetchNotifications, markAsRead, loading, unreadCount, markAllAsRead, clearAll } = useNotificationStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        return true;
    });

    if (loading && notifications.length === 0) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <Activity className="w-10 h-10 animate-spin text-muted/40" />
                <span className="font-display font-[300] text-2xl text-muted italic">Synchronizing Notifications...</span>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 border-b border-border/10 pb-16">
                <div className="space-y-4">
                    <h1 className="text-6xl text-foreground font-display font-[300] tracking-tight">
                        Pipeline <span className="italic">Alerts</span>
                    </h1>
                    <p className="text-muted text-xl leading-relaxed max-w-2xl font-sans tracking-[0.18px] opacity-80">
                        Synthesizing architectural decisions, team discussions, and critical protocol milestones.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-3 px-6 py-2 bg-secondary/30 rounded-full border border-border/10 shadow-inset-subtle">
                        <Bell className="w-4 h-4 text-muted animate-pulse" />
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.25em]">{unreadCount} Pending Signals</span>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="pill-button bg-secondary text-foreground text-[10px] uppercase tracking-[0.25em] px-8 py-4 hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                        Archive Unread
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={cn(
                        "warm-pill text-[10px] uppercase tracking-[0.25em] px-10 transition-all",
                        filter === 'all' ? "bg-black text-white shadow-pill scale-105" : "bg-transparent text-muted hover:bg-secondary/50"
                    )}
                >
                    All Signals
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                        "warm-pill text-[10px] uppercase tracking-[0.25em] px-10 transition-all",
                        filter === 'unread' ? "bg-black text-white shadow-pill scale-105" : "bg-transparent text-muted hover:bg-secondary/50"
                    )}
                >
                    Unread Only
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-10">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                            className={cn(
                                "premium-card p-10 group transition-all duration-500 cursor-pointer relative overflow-hidden",
                                !notification.isRead ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-black dark:before:bg-white animate-in slide-in-from-left-2" : "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className={cn(
                                    "w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 shadow-inset-subtle border border-border/10 transition-transform duration-500 group-hover:scale-110",
                                    !notification.isRead ? "bg-black text-white shadow-pill" : "bg-secondary text-muted"
                                )}>
                                    {notification.type === 'comment' ? <MessageSquare className="w-7 h-7" /> :
                                        notification.type === 'proposal' ? <Zap className="w-7 h-7" /> :
                                            notification.type === 'resolution' ? <CheckCheck className="w-7 h-7" /> :
                                                <Bell className="w-7 h-7" />}
                                </div>

                                <div className="flex-1 space-y-6 text-left">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary/30 rounded-full border border-border/5">
                                            <Clock className="w-3.5 h-3.5 text-muted" />
                                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.25em]">
                                                {new Date(notification.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-black dark:text-white uppercase tracking-[0.2em]">New</span>
                                                <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-display font-[300] text-foreground leading-tight tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                                            {notification.title}
                                        </h3>
                                        <p className="text-muted text-[15px] leading-relaxed tracking-wide max-w-4xl font-sans font-[300]">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {/* Rich Metadata Section */}
                                    {notification.metadata && (notification.metadata.snippet || notification.metadata.commentSnippet || notification.metadata.proposalSnippet) && (
                                        <div className="mt-8 p-8 rounded-[2rem] bg-secondary/20 border border-border/5 space-y-4 shadow-inset-subtle relative group/meta">
                                            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-background border border-border/10 rounded-full text-[8px] font-black text-muted uppercase tracking-[0.3em] shadow-sm">Snippet Registry</div>
                                            <p className="text-[15px] text-foreground font-sans italic leading-relaxed opacity-80 border-l-2 border-border/20 pl-6">
                                                "{notification.metadata.snippet || notification.metadata.commentSnippet || notification.metadata.proposalSnippet}"
                                            </p>
                                            {notification.metadata.attachmentCount > 0 && (
                                                <div className="flex items-center gap-3 text-[10px] font-black text-muted uppercase tracking-[0.2em] pt-2">
                                                    <Layers className="w-4 h-4 text-indigo-400" />
                                                    {notification.metadata.attachmentCount} Technical Manifests Attached
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-6 flex items-center gap-6">
                                        {notification.link && (
                                            <Link
                                                to={notification.link}
                                                className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.25em] py-5 px-12 hover:shadow-premium inline-flex items-center gap-3 shadow-pill group/btn"
                                            >
                                                Process Alert
                                                <Activity className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            </Link>
                                        )}
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="text-[10px] font-black text-muted hover:text-foreground uppercase tracking-[0.25em] transition-colors"
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 px-10 text-center space-y-8 bg-secondary/5 rounded-[30px] border border-dashed border-border/40">
                        <Bell className="w-12 h-12 text-muted/20 mx-auto" />
                        <div className="space-y-3">
                            <h3 className="text-3xl font-display font-[300] text-foreground italic">Pipeline Silence</h3>
                            <p className="text-muted-foreground text-[15px] font-normal max-w-md mx-auto leading-relaxed tracking-wide">
                                No new alerts detected. Your architectural stream is currently stable.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
