import { User, Bell, Shield, Globe, Users, Database, Terminal, Key, Cpu } from "lucide-react";

export const SETTINGS_NAV_ITEMS = {
    bde: [
        { id: 'profile', icon: User, label: "Profile" },
        { id: 'notifications', icon: Bell, label: "Notifications" },
        { id: 'security', icon: Shield, label: "Security" },
        { id: 'language', icon: Globe, label: "Language & Region" }
    ],
    pm: [
        { id: 'profile', icon: User, label: "Profile Info", active: true },
        { id: 'team', icon: Users, label: "Team Permissions", active: false },
        { id: 'alerts', icon: Bell, label: "Conflict Alerts", active: false },
        { id: 'legal', icon: Shield, label: "Legal Compliance", active: false },
        { id: 'vault', icon: Database, label: "Vault Sync", active: false }
    ],
    dev: [
        { id: 'profile', icon: User, label: "General Profile", active: true },
        { id: 'ide', icon: Terminal, label: "IDE Sync", active: false },
        { id: 'api', icon: Key, label: "API Access", active: false },
        { id: 'security', icon: Shield, label: "Security", active: false },
        { id: 'localization', icon: Globe, label: "Localization", active: false }
    ]
};

export const NOTIF_PREFERENCES_TEMPLATE = [
    { id: 'email_alerts', label: "Email Alerts", type: "CRITICAL UPDATES", enabled: true },
    { id: 'push_notifs', label: "Push Notifications", type: "REAL-TIME DETECTION", enabled: true },
    { id: 'weekly_report', label: "Weekly Portfolio Report", type: "STRATEGIC INSIGHTS", enabled: false }
];

export const PM_PROTOCOLS_TEMPLATE = [
    {
        id: 'auto_escalate',
        label: "Auto-Escalation",
        description: "Escalate conflicts unresolved for >48h to Legal.",
        enabled: true
    },
    {
        id: 'ai_weight',
        label: "AI Voting Weight",
        description: "Grant AI-Resolver 25% weight in consensus.",
        enabled: false
    }
];

export const DEV_ENVIRONMENT_PREFERENCES = [
    { id: 'vault_sync', label: "Enable AI-Vault Sync", desc: "Automatically back up conflict resolution patterns to the private cloud.", enabled: true },
    { id: 'webhooks', label: "Real-time Pipeline Webhooks", desc: "Receive atomic updates on module contradiction spikes.", enabled: true },
    { id: 'analytics', label: "Developer Analytics", desc: "Share anonymous performance metrics to improve the Conflict AI model.", enabled: false }
];
