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
    Folder,
    Clock
} from "lucide-react";

export const NAV_ITEMS = {
    dev: [
        { to: "/dev/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/dev/editor", icon: FileText, label: "Specifications" },
        { to: "/dev/conflicts", icon: AlertTriangle, label: "Conflicts", badge: 4 },
        { type: 'separator', label: 'SYSTEMS' },
        { to: "/dev/settings", icon: Settings, label: "Settings" },
    ],
    pm: [
        { to: "/pm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/pm/editor", icon: FileText, label: "Requirements" },
        { to: "/pm/conflicts", icon: AlertTriangle, label: "Conflicts" },
        { to: "/pm/timeline", icon: Clock, label: "Activity" },
        { to: "/pm/team", icon: Users, label: "Team" },
        { type: 'separator', label: 'SYSTEMS' },
        { to: "/pm/analytics", icon: BarChart, label: "Analytics" },
        { to: "/pm/settings", icon: Settings, label: "Settings" },
    ],
    bde: [
        { to: "/bde/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/bde/projects", icon: Folder, label: "Projects" },
        { type: 'separator', label: 'SYSTEMS' },
        { to: "/bde/settings", icon: Settings, label: "Settings" },
    ]
};
