import React, { useEffect, useState } from "react";
import {
    Search,
    Calendar,
    Filter,
    Download,
    MoreHorizontal,
    ChevronDown,
    CheckCircle,
    MessageCircle,
    AlertTriangle,
    PlusCircle,
    Loader2,
    FileText,
    BrainCircuit
} from "lucide-react";
import { Button } from "../components/ui/Button";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";

const ICON_MAP = {
    requirement: PlusCircle,
    conflict: AlertTriangle,
    resolution: CheckCircle,
};

const ICON_COLOR_MAP = {
    requirement: { icon: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    conflict: { icon: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
    resolution: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
};

function formatTimeAgo(timestamp) {
    if (!timestamp) return "";
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function getDateGroup(timestamp) {
    if (!timestamp) return "Earlier";
    const now = new Date();
    const date = new Date(timestamp);
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "This Week";
    return "Earlier";
}

export default function ActivityTimeline() {
    const { pmActivity, fetchPmActivity, projects, fetchProjects } = useProjectStore();
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchPmActivity(), fetchProjects()]);
            setLoading(false);
        };
        loadData();
    }, [fetchPmActivity, fetchProjects]);

    // Filter activities
    const filteredActivities = pmActivity.filter(a => {
        if (filterType !== "all" && a.type !== filterType) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                a.title?.toLowerCase().includes(q) ||
                a.projectName?.toLowerCase().includes(q) ||
                a.type?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    // Group by date
    const grouped = {};
    filteredActivities.forEach(activity => {
        const group = getDateGroup(activity.timestamp);
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(activity);
    });

    const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium">Loading activity timeline...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 h-full">
            {/* Sidebar Filters */}
            <aside className="w-full xl:w-80 flex flex-col gap-8 shrink-0">
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Search Trail</h3>
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Event Types</h3>
                        <div className="space-y-2">
                            {[
                                { key: "all", label: "All Events", icon: FileText, color: "text-slate-500" },
                                { key: "conflict", label: "Conflicts", icon: AlertTriangle, color: "text-red-500" },
                                { key: "requirement", label: "Requirements", icon: PlusCircle, color: "text-indigo-500" },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilterType(f.key)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl transition-colors border",
                                        filterType === f.key
                                            ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-900/30"
                                            : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <f.icon className={cn("w-4 h-4", f.color)} />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{f.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">
                                        {f.key === "all"
                                            ? pmActivity.length
                                            : pmActivity.filter(a => a.type === f.key).length
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Summary</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-center">
                                <p className="text-2xl font-black text-red-500">{pmActivity.filter(a => a.type === 'conflict').length}</p>
                                <p className="text-[9px] font-bold text-red-400 uppercase mt-1">Conflicts</p>
                            </div>
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-center">
                                <p className="text-2xl font-black text-indigo-500">{pmActivity.filter(a => a.type === 'requirement').length}</p>
                                <p className="text-[9px] font-bold text-indigo-400 uppercase mt-1">Requirements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Timeline Section */}
            <div className="flex-1 space-y-10 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">System Activity</h1>
                        <p className="text-sm font-bold text-slate-500">
                            Real-time audit trail of all project modifications. {filteredActivities.length} event{filteredActivities.length !== 1 ? 's' : ''} found.
                        </p>
                    </div>
                </div>

                {filteredActivities.length === 0 ? (
                    <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Activity Yet</h3>
                        <p className="text-slate-500 max-w-sm">
                            {searchQuery ? "No activities match your search criteria." : "Create requirements or run conflict analysis to generate activity entries."}
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-7 top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800/50 rounded-full"></div>

                        <div className="space-y-12 relative">
                            {groupOrder.map(groupName => {
                                const items = grouped[groupName];
                                if (!items || items.length === 0) return null;
                                return (
                                    <div key={groupName} className="relative">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className={cn(
                                                "z-10 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ml-2",
                                                groupName === "Today"
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                            )}>{groupName}</div>
                                        </div>
                                        <div className="space-y-10 pl-2">
                                            {items.map(item => (
                                                <TimelineEntry key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TimelineEntry({ item }) {
    const IconComponent = ICON_MAP[item.type] || PlusCircle;
    const colors = ICON_COLOR_MAP[item.type] || ICON_COLOR_MAP.requirement;

    return (
        <div className="flex gap-8 relative group">
            {/* Icon Node */}
            <div className={cn("size-14 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-[#f6f7f7] dark:border-[#16181c] shadow-lg transition-transform duration-500 group-hover:scale-110", colors.bg, colors.icon)}>
                <IconComponent className="w-6 h-6" />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-500/5 transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize">{item.action}</span>
                            <span className="text-xs font-bold text-slate-500 leading-none">• {item.type}</span>
                        </div>
                        <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-tight">
                            {item.projectName}
                        </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{formatTimeAgo(item.timestamp)}</span>
                </div>

                <div className={cn(
                    "p-4 rounded-xl border mb-4",
                    item.type === 'conflict'
                        ? "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 border-l-4 border-l-red-500"
                        : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800"
                )}>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.title}
                    </p>
                    {item.reqA && item.reqB && (
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5" />
                            {item.reqA} vs {item.reqB}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex gap-2">
                        {item.priority && (
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                                item.priority === 'high' ? "bg-red-100 text-red-600" : item.priority === 'medium' ? "bg-amber-100 text-amber-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                                {item.priority}
                            </span>
                        )}
                        {item.severityScore && (
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                                item.severityScore >= 8 ? "bg-red-100 text-red-600" : item.severityScore >= 5 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                            )}>
                                Severity {item.severityScore}
                            </span>
                        )}
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                            item.status === 'resolved' || item.status === 'approved' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        )}>
                            {item.status || item.type}
                        </span>
                    </div>
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
