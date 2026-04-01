export const ANALYTICS_TIMEFRAMES = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
};

export const TIMEFRAME_SUBHEADERS = {
    [ANALYTICS_TIMEFRAMES.DAILY]: "Hourly detection volume over the last 24 hours.",
    [ANALYTICS_TIMEFRAMES.WEEKLY]: "Daily detection volume over the last 7 days.",
    [ANALYTICS_TIMEFRAMES.MONTHLY]: "Daily detection volume over the last 30 days."
};

// Fallback subheader
export const DEFAULT_SUBHEADER = "Conflict detection volume over time.";

export const SEVERITY_BREAKDOWN_TEMPLATE = [
    { label: "Critical Blockers", key: "high", colorClass: "bg-rose-500" },
    { label: "Moderate Friction", key: "medium", colorClass: "bg-amber-500" },
    { label: "Minor Inconsistencies", key: "low", colorClass: "bg-indigo-500" }
];

export const ANALYTICS_STATS_TEMPLATE = [
    {
        title: "Requirement Clarity",
        tooltip: "% of specifications peer-reviewed or AI-approved.",
        keyPath: "requirements.clarity",
        iconName: "FileText",
        colorClass: "bg-emerald-500/10 text-emerald-500",
        progressClass: "bg-emerald-500"
    },
    {
        title: "AI Readiness Score",
        tooltip: "Combined metric of specification health vs. open conflicts.",
        keyPath: "readiness",
        iconName: "Rocket",
        colorClass: "bg-indigo-500/10 text-indigo-500",
        progressClass: "bg-indigo-500"
    },
    {
        title: "Detection Volume",
        tooltip: "Total number of live conflicts identified by the system.",
        keyPath: "conflicts.total",
        iconName: "AlertTriangle",
        colorClass: "bg-rose-500/10 text-rose-500",
        progressClass: "bg-rose-500"
    }
];
