import {
    LayoutDashboard,
    Box,
    FileText,
    AlertTriangle,
    MessageSquare,
    Settings,
    Layers,
    History,
    BarChart,
    Users,
    Folder
} from "lucide-react";

export const NAV_ITEMS = {
    dev: [
        { to: "/dev/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/dev/modules", icon: Box, label: "My Modules" },
        { to: "/dev/editor", icon: FileText, label: "Specifications" },
        { to: "/dev/vault", icon: Layers, label: "Technical Vault" },
        { to: "/dev/conflicts", icon: AlertTriangle, label: "Conflicts", badge: 4 },
        { to: "/dev/discussions", icon: MessageSquare, label: "Discussions" },
        { type: 'separator', label: 'SYSTEMS' },
        { to: "/dev/settings", icon: Settings, label: "Settings" },
    ],
    pm: [
        { to: "/pm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/pm/workspace", icon: Box, label: "Workspace" },
        { to: "/pm/editor", icon: FileText, label: "Requirements" },
        { to: "/pm/conflicts", icon: AlertTriangle, label: "Conflicts", badge: 12 },
        { to: "/pm/timeline", icon: History, label: "Timeline" },
        { to: "/pm/analytics", icon: BarChart, label: "Analytics" },
        { to: "/pm/team", icon: Users, label: "Team" },
        { to: "/pm/settings", icon: Settings, label: "Settings" },
    ],
    bde: [
        { to: "/bde/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/bde/projects", icon: Folder, label: "Projects" },
        { to: "/bde/teams", icon: Users, label: "Teams" },
        { to: "/bde/analytics", icon: BarChart, label: "Analytics" },
        { to: "/bde/settings", icon: Settings, label: "Settings" },
    ]
};
