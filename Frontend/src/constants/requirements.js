export const REQUIREMENT_STATUS = {
    DRAFT: 'draft',
    REVIEW: 'review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CONFLICT: 'conflict'
};

export const REQUIREMENT_CATEGORIES = [
    'Functional',
    'Technical',
    'UI/UX',
    'Security',
    'Performance',
    'Integration',
    'Scalability',
    'Cost'
];

export const REQUIREMENT_PRIORITIES = [
    { value: 'low', label: 'Low Priority', color: 'bg-emerald-500' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-500' },
    { value: 'high', label: 'High Priority', color: 'bg-red-500' },
    { value: 'critical', label: 'Critical Path', color: 'bg-red-600' }
];

export const STAKEHOLDERS = [
    { value: 'Developer', label: 'Lead Developer' },
    { value: 'Architect', label: 'System Architect' },
    { value: 'PM', label: 'Project Manager' },
    { value: 'Security', label: 'Security Auditor' },
    { value: 'Legal', label: 'Compliance Officer' }
];

export const AI_ASSISTANT_CARDS_TEMPLATE = [
    {
        id: 1,
        title: "Conflict Detected",
        desc: "This requirement conflicts with existing architectural standards.",
        iconName: 'AlertTriangle',
        color: "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400",
        action: "Resolve Now"
    },
    {
        id: 2,
        title: "Optimization Tip",
        desc: "Consolidate this specification to reduce redundant logic.",
        iconName: 'Zap',
        color: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20 text-indigo-600 dark:text-indigo-400",
        action: "Apply Suggestion"
    }
];

export const SMART_TEMPLATES = {
    'Developer': [
        { label: 'Scale', text: 'Must support up to 10k concurrent users with <200ms latency.' },
        { label: 'Auth', text: 'Implement OAuth2.0 with JWT rotating refresh tokens.' },
        { label: 'Audit', text: 'Log all state changes to a secure, tamper-proof audit trail.' }
    ],
    'Legal': [
        { label: 'GDPR', text: 'Explicit user consent required before collecting any PII data.' },
        { label: 'Right to Erase', text: 'All user data must be permanently deletable within 48 hours of request.' },
        { label: 'Sovereignty', text: 'Data must be stored on servers physically located within EU borders.' }
    ]
};
