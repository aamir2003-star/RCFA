import React, { useEffect, useState } from "react";
import {
    Users,
    Search,
    Filter,
    SortAsc,
    MoreVertical,
    ArrowRight,
    Shield,
    Mail,
    Activity,
    AlertTriangle,
    Terminal,
    Gavel,
    Loader2,
    Briefcase,
    Info
} from "lucide-react";
import { Button } from "../components/ui/Button";
import useTeamStore from "../stores/useTeamStore";
import { cn } from "../lib/utils";

export default function TeamManagement() {
    const { members, stats, loading, fetchTeam } = useTeamStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const displayStats = [
        {
            title: "Total Developers",
            value: stats.totalDevs.toString(),
            subtext: "System Wide",
            icon: Users,
            color: "text-indigo-600 dark:text-indigo-400"
        },
        {
            title: "Available Now",
            value: stats.availableDevs.toString(),
            subtext: "0 Projects",
            icon: Activity,
            color: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: "High Workload",
            value: stats.highLoadDevs.toString(),
            subtext: "> 2 Projects",
            icon: AlertTriangle,
            color: "text-amber-600 dark:text-amber-400"
        },
        {
            title: "Avg Projects/Dev",
            value: stats.averageWorkload.toString(),
            subtext: "Utilization",
            icon: Briefcase,
            color: "text-blue-600 dark:text-blue-400"
        }
    ];

    const filteredMembers = members.filter(member =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium tracking-tight">Syncing Developer Roster...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-12">
            {/* Header Section */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Resource Management</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Developer Directory</span>
                    </nav>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Talent Roster</h1>
                    <p className="text-sm font-bold text-slate-500 max-w-2xl leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                        Monitor developer bandwidth and assign resources effectively across global projects.
                        Currently tracking {stats.totalDevs} specialized engineers.
                    </p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStats.map((stat, i) => (
                    <div key={i} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none group hover:-translate-y-1 transition-all duration-500">
                        <div className={cn("inline-flex p-3 rounded-2xl mb-5 shadow-lg shadow-current/10", stat.color.replace('text-', 'bg-').replace('600', '500/10'))}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.title}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                                <span className={cn("text-[10px] font-black uppercase tracking-tight", stat.color)}>{stat.subtext}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                <section className="xl:col-span-8 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Engineers</h3>
                            <p className="text-xs font-bold text-slate-400 tracking-tight">{filteredMembers.length} available resources found</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-72"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Developer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Load Index</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignments</th>
                                    <th className="px-8 py-5 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredMembers.map((member) => {
                                    const workloadPercent = Math.min((member.projectCount || 0) * 33.3, 100);
                                    let statusColor = "text-emerald-500";
                                    let statusBg = "bg-emerald-500/10";
                                    let statusText = "AVAILABLE";

                                    if ((member.projectCount || 0) > 2) {
                                        statusColor = "text-red-500";
                                        statusBg = "bg-red-500/10";
                                        statusText = "OVERLOADED";
                                    } else if ((member.projectCount || 0) > 0) {
                                        statusColor = "text-indigo-500";
                                        statusBg = "bg-indigo-500/10";
                                        statusText = "MODERATE";
                                    }

                                    return (
                                        <tr key={member._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-black text-lg border border-slate-200 dark:border-slate-700 shadow-xs group-hover:border-indigo-500/50 transition-colors">
                                                        {member.name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white transition-colors tracking-tight">{member.name}</p>
                                                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="w-52 space-y-2">
                                                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                                                        <span className={cn(statusColor, "px-2 py-0.5 rounded-lg", statusBg)}>{statusText}</span>
                                                        <span className="text-slate-400">{member.projectCount || 0} PROJ</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all duration-1000", workloadPercent > 66 ? 'bg-red-500' : workloadPercent > 0 ? 'bg-indigo-500' : 'bg-emerald-500')}
                                                            style={{ width: `${Math.max(workloadPercent, 5)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {(member.projects || []).length > 0 ? (
                                                        member.projects.slice(0, 2).map((proj, i) => (
                                                            <span key={i} className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-linear-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                                                                {proj}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-300 italic tracking-tight">No active projects</span>
                                                    )}
                                                    {(member.projects || []).length > 2 && (
                                                        <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                                            +{(member.projects.length - 2)} More
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="xl:col-span-4 flex flex-col gap-8 w-full">
                    {/* Workload Matrix */}
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Load Matrix</h3>
                            <div className="p-2 bg-indigo-500/10 rounded-xl">
                                <Activity className="w-5 h-5 text-indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    label: 'Overloaded',
                                    desc: '> 2 projects assigned',
                                    color: 'bg-red-500',
                                    count: stats.highLoadDevs
                                },
                                {
                                    label: 'In Production',
                                    desc: '1-2 projects assigned',
                                    color: 'bg-indigo-500',
                                    count: stats.inProductionCount
                                },
                                {
                                    label: 'Available',
                                    desc: '0 projects assigned',
                                    color: 'bg-emerald-500',
                                    count: stats.availableDevs
                                },
                            ].map((level) => {
                                const percent = stats.totalDevs > 0 ? (level.count / stats.totalDevs) * 100 : 0;
                                return (
                                    <div key={level.label} className="space-y-2 group/item">
                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-500">{level.label}</span>
                                                <div className="relative">
                                                    <Info className="w-3 h-3 text-slate-300 group-hover/item:text-indigo-400 transition-colors cursor-help" />
                                                    <div className="absolute bottom-full left-0 mb-2 w-32 p-2 bg-slate-900 text-[9px] text-white font-bold rounded-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity z-30 shadow-xl">
                                                        {level.desc}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-slate-900 dark:text-white">{level.count} Units</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000", level.color)}
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
                                <Terminal className="w-5 h-5 text-indigo-500" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Utilization</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">
                                        {Math.round((1 - (stats.availableDevs / (stats.totalDevs || 1))) * 100)}% Active Workload
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                        <div className="relative z-10 space-y-6">
                            <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-bold text-white tracking-tight leading-tight">Optimize your Team Assignments</h4>
                                <p className="text-xs font-bold text-indigo-100/70 leading-relaxed italic">
                                    Use the Load Matrix to identify bottlenecks. Aim for an average workload of <span className="text-white">1.8 projects</span> per developer for maximum velocity.
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
