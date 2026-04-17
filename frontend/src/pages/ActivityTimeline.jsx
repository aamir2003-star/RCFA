import React, { useEffect, useState, useMemo } from "react";
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
import {
    ACTIVITY_ICONS,
    ACTIVITY_COLORS,
    TIMELINE_GROUPS
} from "../constants/timeline";


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
    
    // Reset hours to compare dates only
    const today = new Date(now.setHours(0,0,0,0));
    const entryDate = new Date(new Date(timestamp).setHours(0,0,0,0));
    
    const diffTime = today - entryDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "This Week";
    
    // For anything older, return the actual date as the group
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

export default function ActivityTimeline() {
    const { pmActivity, fetchPmActivity, projects, fetchProjects } = useProjectStore();
    const [filterType, setFilterType] = useState("all");
    const [timeframe, setTimeframe] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const timeframes = [
        { id: "all", label: "Real-time" },
        { id: "today", label: "Today" },
        { id: "yesterday", label: "Yesterday" },
        { id: "week", label: "Last 7 Days" },
        { id: "month", label: "Last 30 Days" },
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchPmActivity(timeframe), fetchProjects()]);
            setLoading(false);
        };
        loadData();
    }, [fetchPmActivity, fetchProjects, timeframe]);

    // Filter activities - Memoized
    const filteredActivities = useMemo(() => {
        return pmActivity.filter(a => {
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
    }, [pmActivity, filterType, searchQuery]);

    // Group by date - Memoized - Preserves order by using the original array order
    const groupedData = useMemo(() => {
        const groups = [];
        const groupMap = {};

        filteredActivities.forEach(activity => {
            const groupName = getDateGroup(activity.timestamp);
            if (!groupMap[groupName]) {
                groupMap[groupName] = [];
                groups.push(groupName);
            }
            groupMap[groupName].push(activity);
        });

        return { groups, groupMap };
    }, [filteredActivities]);

    if (loading && pmActivity.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium">Calibrating activity trail...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 h-full animate-in fade-in duration-700">
            {/* Sidebar Filters */}
            <aside className="w-full xl:w-80 flex flex-col gap-8 shrink-0">
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8 sticky top-24">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Search Trail</h3>
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Event Types</h3>
                        <div className="space-y-2">
                            {[
                                { key: "all", label: "All Events", icon: FileText, color: "text-slate-500" },
                                { key: "conflict", label: "Conflicts", icon: AlertTriangle, color: "text-red-500" },
                                { key: "resolution", label: "Resolved", icon: CheckCircle, color: "text-emerald-500" },
                                { key: "requirement", label: "Requirements", icon: PlusCircle, color: "text-indigo-500" },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilterType(f.key)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 border",
                                        filterType === f.key
                                            ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg scale-[1.02]"
                                            : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <f.icon className={cn("w-4 h-4", filterType === f.key ? "text-inherit" : f.color)} />
                                        <span className="text-sm font-bold tracking-tight">{f.label}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black",
                                        filterType === f.key ? "opacity-60" : "text-slate-400"
                                    )}>
                                        {f.key === "all"
                                            ? pmActivity.length
                                            : pmActivity.filter(a => a.type === f.key).length
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                         <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Population Statistics</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-center border border-red-100/50 dark:border-red-900/20">
                                    <p className="text-2xl font-black text-red-500">{pmActivity.filter(a => a.type === 'conflict').length}</p>
                                    <p className="text-[9px] font-bold text-red-400 uppercase mt-1">Conflicts</p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-center border border-emerald-100/50 dark:border-emerald-900/20">
                                    <p className="text-2xl font-black text-emerald-500">{pmActivity.filter(a => a.type === 'resolution').length}</p>
                                    <p className="text-[9px] font-bold text-emerald-400 uppercase mt-1">Resolved</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </aside>

            {/* Main Timeline Section */}
            <div className="flex-1 space-y-10 pb-10">
                <div className="flex flex-col gap-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Audit Engine</span>
                        </div>
                        <h1 className="text-5xl font-display font-[300] tracking-tight text-slate-900 dark:text-white leading-none">
                            System <span className="italic">Activity</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 max-w-xl">
                            Real-time audit trail of all project modifications. Monitoring <span className="text-indigo-600 font-bold">{filteredActivities.length}</span> documented interactions.
                        </p>
                    </div>

                    {/* Timeframe Navigator */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 w-fit">
                        {timeframes.map((tf) => (
                            <button
                                key={tf.id}
                                onClick={() => setTimeframe(tf.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    timeframe === tf.id
                                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-premium scale-105"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                                )}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && pmActivity.length > 0 ? (
                    <div className="flex items-center gap-3 py-4 text-indigo-500 animate-pulse">
                         <Loader2 className="w-5 h-5 animate-spin" />
                         <span className="text-xs font-black uppercase tracking-widest">Synchronizing Archives...</span>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center flex flex-col items-center gap-6 shadow-xl shadow-slate-100 dark:shadow-none">
                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-900/30">
                            <BrainCircuit className="w-10 h-10 opacity-70" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-medium text-slate-900 dark:text-white tracking-tight">Timeline Quiescent</h3>
                            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                                {searchQuery ? "No documented anomalies match your search parameters." : "No architectural events recorded for this timeframe window."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-7 top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-800/80"></div>

                        <div className="space-y-16 relative">
                            {groupedData.groups.map(groupName => {
                                const items = groupedData.groupMap[groupName];
                                return (
                                    <div key={groupName} className="relative animate-in fade-in slide-in-from-left-4 duration-700">
                                        <div className="flex items-center gap-4 mb-12">
                                            <div className="z-20 flex flex-col items-start gap-1">
                                                 <span className={cn(
                                                    "text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-premium",
                                                    groupName === "Today"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-black text-white dark:bg-zinc-800 dark:text-slate-400"
                                                )}>{groupName}</span>
                                                <div className="h-0.5 w-12 bg-indigo-500/30 rounded-full mt-2 ml-1" />
                                            </div>
                                        </div>
                                        <div className="space-y-12 pl-2">
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

const TimelineEntry = React.memo(({ item }) => {
    const IconComponent = ACTIVITY_ICONS[item.type] || PlusCircle;
    const colors = ACTIVITY_COLORS[item.type] || ACTIVITY_COLORS.requirement;

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
                        : item.type === 'resolution'
                            ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 border-l-4 border-l-emerald-500"
                            : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800"
                )}>
                    <p className={cn(
                        "text-sm leading-relaxed",
                        item.type === 'resolution' ? "font-black text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"
                    )}>
                        {item.title}
                    </p>

                    {item.type === 'resolution' && item.description && (
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded">
                                    {item.strategyType || "Strategy"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 italic">Resolution Path Applied</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium border-l-2 border-emerald-200 dark:border-emerald-800 pl-3 py-1">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {(item.reqA && item.reqB) && (
                        <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                            <BrainCircuit className="w-3.5 h-3.5" />
                            Impact Area: {item.reqA} <span className="text-indigo-500">↔</span> {item.reqB}
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
});
