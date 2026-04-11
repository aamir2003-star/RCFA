export const CONFLICT_STATUS_VARIANT = {
    open: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    resolved: "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700",
    default: "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
};

export const RESOLUTION_TYPES = {
    DEVELOPER_PROPOSAL: 'developer_proposal',
    AI_RESOLUTION: 'ai_resolution'
};

export const CONFLICT_TYPES = {
    FUNCTIONAL: 'Functional Contradiction',
    TECHNICAL: 'Technical Limitation',
    SECURITY: 'Security Violation',
    PERFORMANCE: 'Performance Degrade'
};
