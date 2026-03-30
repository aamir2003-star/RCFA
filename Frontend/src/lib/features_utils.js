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
  WalletCards,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  History,
  Plus,
  Trash2,
  Edit,
  Activity,
  Calendar,
  Filter,
  Download,
  Search,
  PlusCircle,
  FilePlus,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  FileIcon,
  Mail,
  FileDown
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

// { ------------------ Workspace / Module Management ------------------ }

export const workspaceModules = [
  {
    id: 1,
    title: "Authentication",
    desc: "OAuth2 implementation with JWT token rotation and MFA support.",
    icon: Lock,
    iconBg: "bg-indigo-500/10 text-indigo-500",
    developer: {
      name: "Sarah Chen",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7wznMw4aBEo2M8XZF1jc-8_cLt51Xu72vyXJip2kPesK2pzFxZfd5TDml-qzfZ0_QcxBv2Gu1k7ZjcUQ5W0H_tcfkoxOEkeE52qn0iY3Q6SbmQcIN2Wk_kEeAvin6_IiWrRNInkV30K7jihdVHH5C9W_4JwndKXX-66tUGICm27tb2S5WUYCp4DDBS8273XLYRJzOH0VNmnEuXGLKckuMwBe51mH7Xx0ZYHuYEieL0h-CCyrbri8OA_2xy7qkeTLrcrJY8w0Bwu8",
    },
    reqCount: 12,
    status: "In Progress",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  },
  {
    id: 2,
    title: "Payment Gateway",
    desc: "Integration with Stripe and PayPal for global subscription handling.",
    icon: CreditCard,
    iconBg: "bg-emerald-500/10 text-emerald-600",
    developer: {
      name: "James Wilson",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy-eck_thqA0pOP_bawopTjcbBBdhaCYfDy0p3dcekzW5iCHrg6xhfqlp6VFpR2sORn6LjbxVV7O4puYU0C8RIgF2flbYHMUKAXJ-dhPtUvJF9cGd3LM6gVcgW3WcdflTS-M3nKSmQsaTC3NnhBvcDyWawjhJfJM5deT48OoEDAgxQb9X-26WNUdP-LkETFrs80QzEDl5zbjv3i6x3qf-WkzKhjT0HHvrmGOL97p2CiSqK0qncApQIjfoO0cBkYE8sdeYCEduQGRA",
    },
    reqCount: 8,
    status: "Pending",
    statusColor: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  },
  {
    id: 3,
    title: "Order Management",
    desc: "Real-time order tracking and inventory synchronization logic.",
    icon: ShoppingCart,
    iconBg: "bg-blue-500/10 text-blue-600",
    developer: {
      name: "Maya Rao",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXiBDLIm1w1RqEyDaxUumy1O5I0ys-cxB5-ShyKZx8HwOtKyiCQCJQ1-gMriR_A2oBEBFK80afOZO9EHXMTZmJWszoslINMed6KQTnTqTGod_m1h_cqwpZCKUb4QDnq68Z47vZZD9FRPiW15bwKihDNQkaMbcmbAZ1RipR2IP9mIsa9fM-SR3O9JxOwFRJFwT6P0Vqf_6my3U-dKwij77V6GOkJ0Le0NcG4JNxw5IdTtAjaqCVxgUTyUdLI3brcM9qtwOePaIe2K4",
    },
    reqCount: 24,
    status: "Completed",
    statusColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  },
  {
    id: 4,
    title: "Admin Dashboard",
    desc: "Internal tool for managing users, reports, and system-wide settings.",
    icon: LayoutGrid,
    iconBg: "bg-indigo-500/10 text-indigo-600",
    developer: null,
    reqCount: 15,
    status: "Draft",
    statusColor: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  },
];

export const availableTeamMembers = [
  {
    id: 1,
    name: "Elena Garcia",
    role: "Frontend Engineer",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9iCV79bhwh_Z2lz4LpMqw4ytQLw6pE7-SjKan_6jxu7YdBQZTCF63H8ZE34-3gLxb8fkpWotP3XpZ2ZNSr-bCXweFeBDl-I6ChJiUixdeWXtPIIZfwNIvg_xd3mMGikWC74IhPJC2-rByz77eB9rjdqGg3trVFYnkD9UbUupSeM3y9IKldQgYmEJJKywfN9YxvBU7oggbEsQ40yux5_HDMOq-qRua8VuOK2HIjIDndKzp8BGUAK35_uwtdbP_VMxIF7oLRhD8sUA",
    status: "online",
  },
  {
    id: 2,
    name: "Tom Harrison",
    role: "Security Architect",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqjbbfy2qkuVXNsVHaBs_rX5i3ZL8Hl6ohPvY6ZkTY5jd_UW3KVP3Xl2fOD_oz6Fo-A5IMoUIkbWaf5LM_zR65XUBVwLAVP5XY2YbbckoycOz8tmJISVBLres4TwYwFzD9bp0T6WLvldAYxfUI1wHo9aNRb3Rq3-_8GKksogX7W-mOZif0wlHCfgWtkl_IGDqgDy6Figw2YdVPBQCSThOnFqRhXjVVYL1vAaZJ6RAPYpx7mw8eeSeX02i33gflt7eTWzz2qi2besk",
    status: "online",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Full Stack (1 Busy)",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL0Rm76l9yXoE4XK_yQekfh-eX8F5We6blOQjw4oZeuZDWfKSaaIQCmCTqmNrPdxkTBvIa4c3c1wm166Bj-uy_nHpoETZ4N9-qUrYkTnRPXty5KP02DqklftDQ_V_AyllnhEh5tDczGJLpy_9oM09JeNJlnhPaFSFj7OIYlnNJtzmHQ6-gxFY7ClcuCvqgLvCkTf_Q9rrvgBZRsIKRTbOeIwrLRcCwGw5ORW5wZjT2fEGhizVyeA7u8BAb3MSTnqu3T3j9Mb3buAc",
    status: "away",
  },
];

// { ------------------ Requirement Editor ------------------ }

export const requirementPriorities = [
  { id: "high", label: "High", color: "bg-red-500" },
  { id: "medium", label: "Medium", color: "bg-amber-500" },
  { id: "low", label: "Low", color: "bg-blue-500" },
];

export const requirementModules = [
  { id: "auth", label: "Authentication", icon: Lock },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
];

export const aiAssistantCards = [
  {
    id: 1,
    type: "ambiguity",
    title: "Ambiguity Warning",
    desc: '"The account should be locked automatically" could be interpreted as a soft lock (time-out) or hard lock (requires support intervention).',
    action: "Refine Language",
    color: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400",
    icon: AlertTriangle
  },
  {
    id: 2,
    type: "missing",
    title: "Missing Edge Case",
    desc: "What happens if the user session expires while they are entering the MFA token?",
    action: "Add to Requirement",
    color: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400",
    icon: HelpCircle
  },
  {
    id: 3,
    type: "security",
    title: "Security Suggestion",
    desc: "Consider adding rate limiting to the MFA verification endpoint to prevent brute-forcing of the 6-digit codes.",
    action: "Apply Recommendation",
    color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    icon: Shield
  },
  {
    id: 4,
    type: "conflict",
    title: "Conflict Found",
    desc: "This conflicts with REQ-042 which states administrative sessions should never expire on trusted IPs.",
    action: null,
    color: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 border-dashed",
    icon: AlertOctagon
  }
];

// { ------------------ Conflict Detection ------------------ }

export const conflictDetails = {
  id: "CONF-124",
  status: "Critical",
  impact: "High",
  reqA: {
    id: "REQ-08",
    title: "System Scalability",
    version: "v2.4",
    content: "The system architecture must support horizontal scaling up to 10,000 concurrent requests per second. To ensure performance, all session data and historical audit logs must be cached in memory for immediate access.",
    highlight: "Audit logs must be retained in active memory for a minimum of 36 months to support instant scalability analysis and reporting.",
    owner: "Architecture Team"
  },
  reqB: {
    id: "REQ-14",
    title: "Data Retention Policy",
    version: "v1.1",
    content: "To comply with global data privacy regulations (GDPR/CCPA), the platform must minimize data exposure and optimize storage costs.",
    highlight: "All non-essential audit logs and PII must be offloaded to cold storage after 90 days and completely purged from active production environments.",
    owner: "Compliance Team"
  },
  aiAnalysis: "The conflict arises from the retention duration mismatch. REQ-08 mandates 36 months of active memory storage for audit logs for scalability metrics, while REQ-14 mandates cold storage offloading after 90 days for compliance. This creates a technical impossibility in the current production environment."
};

export const resolutionSuggestions = [
  {
    id: 1,
    type: "Recommended",
    match: "98%",
    title: "Hybrid Log Management",
    desc: "Store raw audit logs in cold storage after 90 days (Compliance), but maintain aggregated, anonymized performance metrics in active memory for 36 months (Scalability).",
    color: "text-emerald-600 dark:text-emerald-400",
    isRecommended: true
  },
  {
    id: 2,
    type: "Compromise",
    match: "82%",
    title: "Extended Production Buffer",
    desc: "Extend active storage to 180 days to allow for broader trend analysis while reducing the scalability window from 3 years to 6 months.",
    color: "text-slate-400",
    isRecommended: false
  },
  {
    id: 3,
    type: "Aggressive Merge",
    match: "45%",
    title: "On-Demand Retrieval",
    desc: "Eliminate active memory storage. Implement high-speed retrieval from cold storage for scalability reporting on-the-fly.",
    color: "text-slate-400",
    isRecommended: false,
    opacity: "opacity-70"
  }
];

// { ------------------ Activity Timeline ------------------ }

export const timelineActivities = [
  {
    id: 1,
    type: "conflict",
    icon: AlertTriangle,
    iconColor: "text-red-600 dark:text-red-400",
    bgIcon: "bg-red-100 dark:bg-red-900/30",
    user: {
      name: "AI System",
      avatar: "https://i.pravatar.cc/100?u=ai",
      action: "detected a conflict"
    },
    time: "2 hours ago",
    date: "Today",
    content: "High priority conflict detected in Lunar Explorer V2. Conflict between #REQ-802 and #REQ-915 regarding API rate limits.",
    tags: ["Critical", "System Alert"]
  },
  {
    id: 2,
    type: "requirement",
    icon: PlusCircle,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bgIcon: "bg-indigo-100 dark:bg-indigo-900/30",
    user: {
      name: "Marcus Wright",
      avatar: "https://i.pravatar.cc/100?u=marcus",
      action: "created"
    },
    time: "5 hours ago",
    date: "Today",
    title: "#REQ-942: Payment Gateway Integration",
    content: "Implement secure Stripe connect integration for multi-vendor payouts including automated tax calculation...",
  },
  {
    id: 3,
    type: "comment",
    icon: MessageCircle,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgIcon: "bg-blue-100 dark:bg-blue-900/30",
    user: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/100?u=sarah",
      action: "commented on"
    },
    time: "Today, 09:12 AM",
    date: "Today",
    title: "Conflict #C-122",
    content: "The AI recommendation looks solid. I've adjusted the latency requirements to match the new proposal.",
    isComment: true
  },
  {
    id: 4,
    type: "resolution",
    icon: CheckCircle,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgIcon: "bg-emerald-100 dark:bg-emerald-900/30",
    user: {
      name: "Conflict Resolver AI",
      avatar: "https://i.pravatar.cc/100?u=ai-resolve",
      action: "resolved"
    },
    time: "Yesterday, 4:45 PM",
    date: "Yesterday",
    title: "#C-118: Memory Allocation Loop",
    approvers: ["David", "Emma"],
    status: "Resolved"
  }
];

// { ------------------ Conflict Resolution Discussion ------------------ }

export const discussionParticipants = [
  { id: 1, name: "Sarah Chen", role: "Legal Lead", avatar: "https://i.pravatar.cc/100?u=sarah", online: true },
  { id: 2, name: "Alex Rivera", role: "Sr. Engineer", avatar: "https://i.pravatar.cc/100?u=alex", online: true },
  { id: 3, name: "Jamie Smith", role: "Product Manager", avatar: "https://i.pravatar.cc/100?u=jamie", online: false },
  { id: 4, name: "Elena Garcia", role: "Frontend Engineer", avatar: "https://i.pravatar.cc/100?u=elena", online: true }
];

export const discussionMessages = [
  {
    id: 1,
    user: discussionParticipants[0],
    time: "Oct 24, 09:12 AM",
    content: "I've noticed a major conflict between Requirement A (GDPR Compliance) and Requirement B (Audit Trail). GDPR requires data deletion after 30 days of inactivity, but the Audit Trail requirement insists on a 7-year retention for financial records. Some of our PII is coupled with these records.",
    replies: [
      {
        id: 2,
        user: discussionParticipants[1],
        time: "Oct 24, 10:45 AM",
        content: "Good catch @Sarah. We might need to implement a data pseudonymization layer here. I propose the following schema adjustment for the retention logic:",
        code: `{
  "retention_policy": "hybrid",
  "pii_expiry": "30d",
  "transaction_record": "7y",
  "mask_pii_on_expiry": true
}`,
        proposal: {
          title: "Implement PII Masking after 30 days while keeping masked logs for 7 years.",
          votes: { up: 8, down: 0 }
        }
      },
      {
        id: 3,
        user: discussionParticipants[2],
        time: "Oct 25, 02:15 PM",
        content: "I reviewed the compliance docs and it seems Alex's proposal aligns with the 'Privacy by Design' guidelines. Attaching the relevant section from the auditor's handbook.",
        attachment: {
          name: "Auditor_Guidelines_v4.pdf",
          size: "1.2 MB",
          type: "PDF Document"
        }
      }
    ]
  }
];

// { ------------------ Team Management ------------------ }

export const teamStats = [
  {
    title: "Total Members",
    value: "42",
    subtext: "+3 this month",
    icon: Users,
    color: "text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Active Developers",
    value: "28",
    subtext: "65% Capacity",
    icon: Activity,
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Pending Invitations",
    value: "05",
    subtext: "Expiring soon",
    icon: Mail,
    color: "text-amber-600 dark:text-amber-400"
  },
  {
    title: "High Workload",
    value: "08",
    subtext: "Action Required",
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400"
  }
];

export const teamRoster = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Software Project Manager",
    avatar: "https://i.pravatar.cc/100?u=sarahj",
    workload: 85,
    status: "Busy",
    statusColor: "bg-red-500",
    statusBg: "bg-red-50 dark:bg-red-900/20",
    statusText: "text-red-600 dark:text-red-400"
  },
  {
    id: 2,
    name: "Liam O'Connor",
    role: "System Architect",
    avatar: "https://i.pravatar.cc/100?u=liam",
    workload: 42,
    status: "Available",
    statusColor: "bg-emerald-500",
    statusBg: "bg-emerald-50 dark:bg-emerald-900/20",
    statusText: "text-emerald-600 dark:text-emerald-400"
  },
  {
    id: 3,
    name: "Maya Rodriguez",
    role: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/100?u=maya",
    workload: 60,
    status: "In Meeting",
    statusColor: "bg-amber-500",
    statusBg: "bg-amber-50 dark:bg-amber-900/20",
    statusText: "text-amber-600 dark:text-amber-400"
  },
  {
    id: 4,
    name: "Brian Thompson",
    role: "Resolution Officer",
    avatar: "https://i.pravatar.cc/100?u=brian",
    workload: 15,
    status: "Available",
    statusColor: "bg-emerald-500",
    statusBg: "bg-emerald-50 dark:bg-emerald-900/20",
    statusText: "text-emerald-600 dark:text-emerald-400"
  }
];

export const bdeTeams = [
  {
    id: 1,
    name: "Enterprise Solutions",
    lead: "Sarah Jenkins",
    members: 12,
    revenue: "$1.2M",
    growth: "+14%",
    status: "Active",
    color: "bg-indigo-500"
  },
  {
    id: 2,
    name: "SME Strategy",
    lead: "Liam O'Connor",
    members: 8,
    revenue: "$0.8M",
    growth: "+8%",
    status: "On Track",
    color: "bg-emerald-500"
  },
  {
    id: 3,
    name: "Global Ops",
    lead: "Maya Rodriguez",
    members: 15,
    revenue: "$2.5M",
    growth: "+22%",
    status: "High Performance",
    color: "bg-amber-500"
  }
];

export const bdeSettings = {
  profile: {
    name: "Alex Rivera",
    email: "alex.rivera@spectra.ai",
    role: "Business Development Executive",
    avatar: "https://i.pravatar.cc/100?u=alexr"
  },
  notifications: [
    { id: 1, type: "Project Alert", label: "New Project Creation", enabled: true },
    { id: 2, type: "System", label: "Weekly Analytics Report", enabled: true },
    { id: 3, type: "Teams", label: "Team Milestone Reached", enabled: false }
  ],
  security: {
    mfaEnabled: true,
    lastPasswordChange: "2024-03-15"
  }
};
