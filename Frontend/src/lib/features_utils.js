import {
  AlertTriangle,
  Archive,
  BarChart2,
  CheckCircle,
  CreditCard,
  FileText,
  GitCommit,
  Layers,
  LayoutGrid,
  MessageSquare,
  Shield,
  ShoppingCart,
  UserPlus,
  Users,
  Zap,
  Rocket,
  BrainCircuit,
  Boxes,
  Lock,
  WalletCards
} from "lucide-react";

export const bdeStats = [
  {
    title: "TOTAL PROJECTS",
    value: "42",
    subtext: "+5.2%",
    subtextColor: "text-emerald-500",
    icon: Archive,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
  },
  {
    title: "CONFLICTS DETECTED",
    value: "12",
    subtext: "+3 today",
    subtextColor: "text-red-500",
    icon: AlertTriangle,
    color: "text-red-500 bg-transparent",
  },
  {
    title: "ACTIVE TEAMS",
    value: "14",
    subtext: "Stable",
    subtextColor: "text-slate-400",
    icon: Users,
    color: "text-slate-400 bg-transparent",
  },
  {
    title: "OVERALL PROGRESS",
    value: "78%",
    isProgress: true,
    icon: BarChart2,
    color: "text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
  },
];

export const bdeProjects = [
  {
    title: "Core API Infrastructure",
    desc: "Scaling the backend infrastructure for high-concurrency websocket...",
    status: "3 CONFLICTS",
    statusColor: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-transparent",
    progress: 64,
    progressColor: "bg-blue-500",
    avatars: 2,
    moreAvatars: "+5",
    icon: Boxes,
    iconBg: "bg-blue-100 text-blue-500 dark:bg-blue-500/20",
  },
  {
    title: "v2.0 UI Redesign",
    desc: "Migration from legacy CSS components to Tailwind-based desig...",
    status: "RESOLVING",
    statusColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent",
    progress: 92,
    progressColor: "bg-indigo-500",
    avatars: 2,
    moreAvatars: null,
    icon: Rocket,
    iconBg: "bg-indigo-100 text-indigo-500 dark:bg-indigo-500/20",
  },
  {
    title: "Data Encryption Module",
    desc: "Implementing end-to-end encryption for all enterprise-tier customer...",
    status: "5 CONFLICTS",
    statusColor: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-transparent",
    progress: 15,
    progressColor: "bg-amber-500",
    avatars: 1,
    moreAvatars: "+2",
    icon: Lock,
    iconBg: "bg-amber-100 text-amber-500 dark:bg-amber-500/20",
  },
  {
    title: "Billing System Integration",
    desc: "Synchronizing Stripe billing cycles with internal resource tracking.",
    status: "CLEAN",
    statusColor: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent",
    progress: 45,
    progressColor: "bg-emerald-500",
    avatars: 1,
    moreAvatars: null,
    icon: WalletCards,
    iconBg: "bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20",
  },
  {
    title: "AI Content Generator",
    desc: "Building a multimodal content engine for social media automation.",
    status: "1 CONFLICT",
    statusColor: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-transparent",
    progress: 33,
    progressColor: "bg-purple-500",
    avatars: 2,
    moreAvatars: null,
    icon: BrainCircuit,
    iconBg: "bg-purple-100 text-purple-500 dark:bg-purple-500/20",
  },
];

// { ------------------ dev-utils ------------------ }

export const devStats = [
  {
    title: "MODULES ASSIGNED",
    value: "12",
    subtext: "+2 this week",
    color:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
    icon: LayoutGrid,
  },
  {
    title: "PENDING CONFLICTS",
    value: "4",
    subtext: "2 critical priority",
    color:
      "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500",
    icon: AlertTriangle,
  },
  {
    title: "OPEN DISCUSSIONS",
    value: "8",
    subtext: "3 waiting for you",
    color:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30",
    icon: MessageSquare,
  },
  {
    title: "REQUIREMENTS MET",
    value: "85%",
    isProgress: true,
    color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
    icon: CheckCircle,
  },
];

export const devModules = [
  {
    title: "Authentication Service",
    project: "Project: Core API",
    statusBadge: "IN PROGRESS",
    statusColor:
      "bg-amber-100/50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-transparent",
    reqs: 24,
    conflicts: 2,
    threads: 5,
  },
  {
    title: "Payment Gateway",
    project: "Project: Billing V2",
    statusBadge: "BLOCKED",
    statusColor:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-transparent",
    reqs: 18,
    conflicts: 3,
    threads: 12,
  },
];

export const devActiveConflicts = [
  {
    priority: "CRITICAL",
    priorityColor: "bg-red-500",
    title: "Schema mismatch on User metadata payload",
    module: "Auth Service",
  },
  {
    priority: "HIGH",
    priorityColor: "bg-amber-500",
    title: "Redundant API endpoint logic duplication",
    module: "Payment Gateway",
  },
];

export const devTimeline = [
  {
    type: "completed",
    title: "Completed Requirement #122",
    time: "2 hours ago • Auth Service",
    icon: CheckCircle,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    type: "comment",
    title: "Commented on Conflict #45",
    time: '4 hours ago • "Need clarification on field data types"',
    icon: MessageSquare,
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30",
  },
  {
    type: "alert",
    title: "New high-priority conflict detected",
    time: "6 hours ago • Billing Module",
    icon: AlertTriangle,
    color: "text-red-500 bg-red-50 dark:bg-red-900/30",
  },
  {
    type: "update",
    title: "Updated status to In Progress",
    time: "Yesterday • Analytics API",
    icon: GitCommit,
    color: "text-slate-400 bg-slate-50 dark:bg-slate-800/50 border",
  },
];

// { ------------------ PM-utils ------------------ }

export const pmStats = [
  {
    title: "REQUIREMENTS CREATED",
    value: "128",
    trend: "+12%",
    trendUp: true,
    icon: FileText,
    iconColor: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    title: "CONFLICTS DETECTED",
    value: "12",
    trend: "-5%",
    trendUp: false,
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/30",
    borderLeft: "border-l-4 border-l-red-500",
  },
  {
    title: "MODULES CREATED",
    value: "45",
    trend: "+8%",
    trendUp: true,
    icon: LayoutGrid,
    iconColor: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    title: "DEVELOPERS ASSIGNED",
    value: "18",
    trend: "+2%",
    trendUp: true,
    icon: Users,
    iconColor: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
];

export const pmProjects = [
  {
    title: "FinTech Core Revamp",
    statusBadge: "ON TRACK",
    statusColor:
      "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    updatedInfo: "Updated 2h ago • 3 conflicts pending",
    progress: 75,
    progressColor: "bg-emerald-500",
    icon: { bg: "bg-blue-500", element: CreditCard },
    avatars: 3,
    extraAvatars: 4,
  },
  {
    title: "E-Commerce AI Chatbot",
    statusBadge: "AT RISK",
    statusColor:
      "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
    updatedInfo: "Updated 5h ago • 9 conflicts pending",
    progress: 32,
    progressColor: "bg-orange-500",
    icon: { bg: "bg-orange-500", element: ShoppingCart },
    avatars: 1,
    extraAvatars: 2,
  },
  {
    title: "HealthTech Data Pipeline",
    statusBadge: "ON TRACK",
    statusColor:
      "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    updatedInfo: "Updated 12h ago • 0 conflicts",
    progress: 90,
    progressColor: "bg-emerald-500",
    icon: { bg: "bg-emerald-500", element: Shield },
    avatars: 2,
    extraAvatars: 0,
  },
];

export const quickActions = [
  {
    icon: Zap,
    title: "Generate Requirements",
    desc: "Powered by AI Analysis",
    bg: "bg-[#252f3e] text-white hover:bg-[#1e2632]",
    iconBg: "bg-white/10",
    isDark: true,
  },
  {
    icon: Layers,
    title: "Create Modules",
    desc: "Define architectural blocks",
    bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    isDark: false,
  },
  {
    icon: UserPlus,
    title: "Invite Team Members",
    desc: "Add developers or stakeholders",
    bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    isDark: false,
  },
];
