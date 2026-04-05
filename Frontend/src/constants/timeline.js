import {
    PlusCircle,
    AlertTriangle,
    CheckCircle
} from "lucide-react";

export const ACTIVITY_ICONS = {
    requirement: PlusCircle,
    conflict: AlertTriangle,
    resolution: CheckCircle,
};

export const ACTIVITY_COLORS = {
    requirement: {
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    conflict: {
        icon: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/30"
    },
    resolution: {
        icon: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30"
    },
};

export const TIMELINE_GROUPS = ["Today", "Yesterday", "This Week", "Earlier"];
