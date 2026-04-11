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
        { to: "/dev/modules", icon: Box, label: "Modules" },
        { to: "/dev/conflicts/discussion", icon: MessageSquare, label: "Discussions", matchSubPath: "/discussion" },
        { to: "/dev/conflicts", icon: AlertTriangle, label: "Conflicts" }
    ],
    pm: [
        { to: "/pm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/pm/editor", icon: FileText, label: "Requirements" },
        { to: "/pm/modules", icon: Box, label: "Modules" },
        { to: "/pm/conflicts/discussion", icon: MessageSquare, label: "Discussions", matchSubPath: "/discussion" },
        { to: "/pm/conflicts", icon: AlertTriangle, label: "Conflicts" },
        { to: "/pm/timeline", icon: Clock, label: "Activity" },
        { to: "/pm/team", icon: Users, label: "Team" },
        { to: "/pm/analytics", icon: BarChart, label: "Analytics" }
    ],
    bde: [
        { to: "/bde/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/bde/projects", icon: Folder, label: "Projects" },
        { to: "/bde/editor", icon: Layers, label: "Specifications" },
        { to: "/bde/analytics", icon: BarChart, label: "Analytics" },
        { to: "/bde/teams", icon: Users, label: "Teams" },
        { to: "/bde/reports", icon: FileText, label: "Reports" }
    ]
};
