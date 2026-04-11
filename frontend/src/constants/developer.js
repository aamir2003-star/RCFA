import { LayoutGrid, AlertTriangle, MessageSquare, CheckCircle, GitCommit } from "lucide-react";

export const DEV_STATS_TEMPLATE = [
    {
        title: "MODULES ASSIGNED",
        value: "12",
        subtext: "+2 this week",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
        icon: LayoutGrid,
    },
    {
        title: "PENDING CONFLICTS",
        value: "4",
        subtext: "2 critical priority",
        color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500",
        icon: AlertTriangle,
    },
    {
        title: "OPEN DISCUSSIONS",
        value: "8",
        subtext: "3 waiting for you",
        color: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30",
        icon: MessageSquare,
    },
    {
        title: "REQUIREMENTS MET",
        value: "85%",
        isProgress: true,
        color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
        icon: CheckCircle,
    },
];

export const DEV_MODULES_TEMPLATE = [
    {
        title: "Authentication Service",
        project: "Project: Core API",
        statusBadge: "IN PROGRESS",
        statusColor: "bg-amber-100/50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-transparent",
        reqs: 24,
        conflicts: 2,
        threads: 5,
    },
    {
        title: "Payment Gateway",
        project: "Project: Billing V2",
        statusBadge: "BLOCKED",
        statusColor: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-transparent",
        reqs: 18,
        conflicts: 3,
        threads: 12,
    },
];

export const DEV_ACTIVE_CONFLICTS_TEMPLATE = [
    {
        priority: "CRITICAL",
        priorityColor: "bg-red-500",
        title: "Schema mismatch on User metadata payload",
        module: "Auth Service",
    },
    {
        priority: "HIGH",
        priorityColor: "bg-amber-500",
        title: "Redundant API endpoint logic duplication",
        module: "Payment Gateway",
    },
];

export const DEV_TIMELINE_TEMPLATE = [
    {
        type: "completed",
        title: "Completed Requirement #122",
        time: "2 hours ago • Auth Service",
        icon: CheckCircle,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
        type: "comment",
        title: "Commented on Conflict #45",
        time: '4 hours ago • "Need clarification on field data types"',
        icon: MessageSquare,
        color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
        type: "alert",
        title: "New high-priority conflict detected",
        time: "6 hours ago • Billing Module",
        icon: AlertTriangle,
        color: "text-red-500 bg-red-50 dark:bg-red-900/30",
    },
    {
        type: "update",
        title: "Updated status to In Progress",
        time: "Yesterday • Analytics API",
        icon: GitCommit,
        color: "text-slate-400 bg-slate-50 dark:bg-slate-800/50 border",
    },
];
