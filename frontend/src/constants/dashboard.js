import { Layout, Users, AlertCircle, FileText, Briefcase, TrendingUp, CheckCircle2, TrendingDown, Zap, Layers, Activity } from "lucide-react";

export const PROJECT_STATUS_COLORS = {
    active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    planning: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    completed: "bg-slate-50 text-slate-600 border border-slate-100",
    default: "bg-slate-50 text-slate-600 border border-slate-100"
};

export const BDE_STATS_TEMPLATE = [
    {
        key: "totalProjects",
        title: "Total Projects",
        icon: Layout,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        subtext: "Across all clients",
        subtextColor: "text-slate-500"
    },
    {
        key: "activeClients",
        title: "Active Clients",
        icon: Users,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        subtext: "Engaged current",
        subtextColor: "text-slate-500"
    },
    {
        key: "totalConflicts",
        title: "Conflicts Found",
        icon: AlertCircle,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        subtext: "Detected by AI",
        subtextColor: "text-amber-600"
    },
    {
        key: "totalRequirements",
        title: "Total Requirements",
        icon: FileText,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        subtext: "Defined to date",
        subtextColor: "text-slate-500",
        isProgress: false
    }
];

export const PM_DIRECTORY_STATS_TEMPLATE = [
    {
        icon: Users,
        label: "Total PMs",
        key: "pmsCount",
        color: "text-blue-500",
        sub: "Active Directors"
    },
    {
        icon: Briefcase,
        label: "Assigned Projects",
        key: "totalProjects",
        color: "text-emerald-500",
        sub: "Across Portfolio"
    },
    {
        icon: AlertCircle,
        label: "Ongoing Conflicts",
        key: "totalConflicts",
        color: "text-rose-500",
        sub: "Requiring Triage"
    },
    {
        icon: TrendingUp,
        label: "Avg. Project Load",
        key: "avgLoad",
        color: "text-amber-500",
        sub: "Projects / PM"
    }
];

export const CONFLICT_SEVERITY_COLORS = {
    Red: "bg-rose-500/10 text-rose-500",
    Orange: "bg-amber-500/10 text-amber-500",
    Green: "bg-emerald-500/10 text-emerald-500"
};

export const REPORTS_STATS_TEMPLATE = [
    {
        label: "Total Projects",
        key: "totalProjects",
        icon: FileText,
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        trend: "+12% this month"
    },
    {
        label: "Active Conflicts",
        key: "totalConflicts",
        icon: AlertCircle,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        trend: "Needs attention"
    },
    {
        label: "Market Reach",
        key: "activeClients",
        icon: TrendingUp,
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        trend: "Growing"
    },
    {
        label: "Delivery Rate",
        key: "completedProjects",
        icon: CheckCircle2,
        color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        trend: "Stable",
        isPercentage: true
    }
];

export const TIMELINE_VELOCITY_TEMPLATE = [
    { stage: "Concept Validation", color: "bg-emerald-500", progress: 100 },
    { stage: "Requirement Bulk", color: "bg-indigo-500", progress: 65 },
    { stage: "AI Triage", color: "bg-amber-500", progress: 40 },
    { stage: "Final Review", color: "bg-slate-200 dark:bg-slate-800", progress: 0 }
];

export const PM_STATS_TEMPLATE = [
    {
        key: "totalRequirements",
        title: "REQUIREMENTS CREATED",
        icon: FileText,
        iconColor: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/30",
        trend: "+0%",
        trendUp: true
    },
    {
        key: "openConflicts",
        title: "PENDING TRIAGE",
        icon: AlertCircle,
        iconColor: "text-red-500",
        bg: "bg-red-50 dark:bg-red-900/30",
        trend: "Action Required",
        trendUp: false,
        borderLeft: "border-l-4 border-l-red-500"
    },
    {
        key: "totalProjects",
        title: "TOTAL PROJECTS",
        icon: Layout,
        iconColor: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/30",
        trend: "Portfolio",
        trendUp: true
    },
    {
        key: "teamCount",
        title: "TEAM MEMBERS",
        icon: Users,
        iconColor: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/30",
        trend: "Active",
        trendUp: true
    }
];

export const PM_QUICK_ACTIONS_TEMPLATE = [
    {
        id: "generate",
        icon: Zap,
        title: "Generate Requirements",
        desc: "Powered by AI Analysis",
        bg: "bg-[#252f3e] text-white hover:bg-[#1e2632]",
        iconBg: "bg-white/10",
        isDark: true,
        route: "/pm/editor"
    },
    {
        id: "conflicts",
        icon: Layers,
        title: "Manage Conflicts",
        desc: "Review AI-detected issues",
        bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50",
        iconBg: "bg-slate-100 dark:bg-slate-800",
        isDark: false,
        route: "/pm/conflicts"
    },
    {
        id: "activity",
        icon: Activity,
        title: "View Activity",
        desc: "Real-time project timeline",
        bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50",
        iconBg: "bg-slate-100 dark:bg-slate-800",
        isDark: false,
        route: "/pm/timeline"
    }
];


