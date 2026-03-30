import React from "react";
import {
    Bell,
    CheckCheck,
    MoreHorizontal,
    ShieldAlert,
    MessageSquare,
    Zap,
    Filter,
    Clock,
    UserPlus
} from "lucide-react";
import { cn } from "../lib/utils";

const mockNotifications = [
    {
        id: 1,
        type: 'critical',
        icon: ShieldAlert,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        title: 'New Conflict Detected',
        desc: 'Logical contradiction detected between "Security Protocol V2" and "User Auth Flow" in Phoenix 2.0.',
        time: '2 mins ago',
        unread: true
    },
    {
        id: 2,
        type: 'discussion',
        icon: MessageSquare,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        title: 'New Comment in Discussion',
        desc: 'Sarah Chen replied to your proposal in the "Auth Module Integration" thread.',
        time: '15 mins ago',
        unread: true
    },
    {
        id: 3,
        type: 'ai',
        icon: Zap,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        title: 'AI Resolution Suggested',
        desc: 'The RCFA engine has generated 3 optimized solutions for the remaining conflicts in E-Commerce Core.',
        time: '1 hour ago',
        unread: false
    },
    {
        id: 4,
        type: 'system',
        icon: UserPlus,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        title: 'Team Member Joined',
        desc: 'Liam O\'Connor (Architect) has been added to the "Global Core" project by PM Alex.',
        time: '3 hours ago',
        unread: false
    }
];

export default function Notifications() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-indigo-500" />
                        Notifications
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Stay updated with conflict alerts and team collaborations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                        <CheckCheck className="w-4 h-4" />
                        Mark All as Read
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/5 dark:shadow-none overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {mockNotifications.map((notif) => (
                        <div key={notif.id} className={cn(
                            "p-6 md:p-8 flex gap-6 group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all cursor-pointer relative",
                            notif.unread && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-500"
                        )}>
                            <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-lg", notif.bg)}>
                                <notif.icon className={cn("size-6", notif.color)} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className={cn("font-bold text-base", notif.unread ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                                            {notif.title}
                                        </h3>
                                        {notif.unread && <span className="bg-indigo-500 size-2 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse"></span>}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock className="size-3" />
                                        {notif.time}
                                    </span>
                                </div>
                                <p className={cn("text-sm font-medium leading-relaxed max-w-2xl", notif.unread ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500")}>
                                    {notif.desc}
                                </p>
                                <div className="flex items-center gap-4 pt-2">
                                    <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] hover:underline">View Details</button>
                                    <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] hover:text-slate-600">Dismiss</button>
                                </div>
                            </div>
                            <button className="self-start p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="size-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button className="px-10 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all active:scale-95 shadow-sm">
                    View Archive
                </button>
            </div>
        </div>
    );
}
