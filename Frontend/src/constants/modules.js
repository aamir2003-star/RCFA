import {
    Layout,
    Users,
    Clock,
    CheckCircle2
} from "lucide-react";

export const MODULE_STAT_CONFIG = [
    {
        id: "total",
        label: "Total Modules",
        icon: Layout,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
        id: "assigned",
        label: "Assigned",
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
        id: "pending",
        label: "Pending",
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-500/10"
    },
    {
        id: "coverage",
        label: "Coverage",
        icon: CheckCircle2,
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-500/10"
    },
];

export const MODULE_STATUS_VARIANT = {
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'in-progress': 'bg-blue-50 text-blue-600 border-blue-100',
    pending: 'bg-slate-50 text-slate-500 border-slate-100'
};
