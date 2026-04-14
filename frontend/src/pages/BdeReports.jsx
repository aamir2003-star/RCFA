import React, { useEffect } from "react";
import {
    BarChart,
    PieChart,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter,
    Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../stores/useProjectStore";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { REPORTS_STATS_TEMPLATE, TIMELINE_VELOCITY_TEMPLATE } from "../constants/dashboard";
import { downloadCSV, formatProjectBrief, calculateProgress } from "../lib/exportUtils";

export default function BdeReports() {
    const navigate = useNavigate();
    const {
        projects,
        bdeStats,
        fetchProjects,
        fetchBdeStats,
        loading
    } = useProjectStore();

    useEffect(() => {
        fetchProjects();
        fetchBdeStats();
    }, [fetchProjects, fetchBdeStats]);

    const statsConfig = REPORTS_STATS_TEMPLATE.map(stat => ({
        ...stat,
        value: stat.key === 'completedProjects'
            ? (bdeStats?.totalProjects > 0 ? Math.round((bdeStats?.completedProjects / bdeStats?.totalProjects) * 100) : 0)
            : (bdeStats?.[stat.key] || 0)
    }));

    return (
        <div className="space-y-12 p-1">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-border/20 pb-12 mb-16 gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] shadow-premium">
                            Operational Ledger
                        </div>
                    </div>
                    <h1 className="text-5xl font-display font-[300] tracking-tight text-foreground">Reporting Engine</h1>
                    <p className="text-base text-muted font-sans tracking-wide">Autonomous portfolio insights and project health synthesis</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => downloadCSV(projects.map(formatProjectBrief), "Portfolio_Audit")}
                        className="group flex items-center gap-3 px-6 py-3 bg-secondary/30 border border-border/10 rounded-2xl text-[11px] font-black text-muted uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500"
                    >
                        <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                        Export Audit
                    </button>
                    <Button
                        onClick={() => navigate("/bde/analytics")}
                        className="font-black bg-black dark:bg-white text-white dark:text-black rounded-2xl px-8 h-12 shadow-pill hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Live Analytics
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statsConfig.map((stat) => (
                    <div key={stat.label} className="premium-card p-8 group transition-all duration-500 hover:scale-[1.01]">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-3 rounded-2xl shadow-premium transition-transform duration-500 group-hover:scale-110", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-muted uppercase tracking-[0.25em] mb-2">{stat.label}</p>
                        <h3 className="text-4xl font-display font-[300] text-foreground tracking-tight mb-3">{stat.value}</h3>
                        <p className="text-[11px] text-muted opacity-60 font-medium tracking-wide">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Project Health Table */}
                <div className="xl:col-span-2 premium-card overflow-hidden">
                    <div className="p-8 border-b border-border/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-pill">
                                <BarChart className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-xl font-display font-[300] text-foreground tracking-tight">Project Health Monitor</h3>
                                <p className="text-[12px] text-muted font-sans tracking-wide">Real-time vector analysis across portfolio</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group/search w-full sm:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within/search:text-foreground transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filter signals..."
                                    className="w-full bg-secondary/30 border border-border/10 rounded-2xl pl-12 pr-6 py-2.5 text-[12px] font-sans outline-none focus:border-black/20 dark:focus:border-white/20 transition-all shadow-inset-subtle"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/20">
                                <tr>
                                    <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.2em] opacity-60">Project Signal</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.2em] opacity-60 text-center">Load</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.2em] opacity-60 text-center">Signals</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.2em] opacity-60">Risk Vector</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.2em] opacity-60 text-right">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {projects.length > 0 ? projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-secondary/10 transition-colors group/row">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-secondary/50 border border-border/10 font-display font-[300] text-sm flex items-center justify-center group-hover/row:scale-110 transition-transform duration-500">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-foreground group-hover/row:text-indigo-500 transition-colors tracking-tight">{project.name}</p>
                                                    <p className="text-[10px] text-muted font-[800] uppercase tracking-widest opacity-60">{project.status || "Pre-Operational"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[11px] font-black px-3 py-1 bg-secondary/40 border border-border/10 rounded-full font-mono">
                                                {project.requirementCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={cn(
                                                "text-[11px] font-black px-3 py-1 rounded-full border shadow-sm",
                                                (project.conflictCount || 0) > 5
                                                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                                    : (project.conflictCount || 0) > 0
                                                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            )}>
                                                {project.conflictCount || 0} Alert{(project.conflictCount || 0) !== 1 && 's'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden min-w-[80px]">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1500 ease-out",
                                                            calculateProgress(project) > 80 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :
                                                                calculateProgress(project) > 40 ? "bg-amber-500" : "bg-rose-500"
                                                        )}
                                                        style={{ width: `${calculateProgress(project)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted w-8 tabular-nums">
                                                    {calculateProgress(project)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => navigate(`/bde/project-details?projectId=${project._id}`)}
                                                className="w-10 h-10 bg-secondary/20 border border-border/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-black dark:hover:bg-white text-muted hover:text-white dark:hover:text-black hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">No projects found</p>
                                                <p className="text-xs text-slate-500">You haven't created any projects yet.</p>
                                                <Button
                                                    onClick={() => navigate("/bde/projects")}
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4 rounded-xl"
                                                >
                                                    Start First Project
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Metrics */}
                <div className="space-y-8">
                    <div className="bg-black dark:bg-white rounded-[3rem] p-10 text-white dark:text-black shadow-pill relative overflow-hidden group transition-all duration-700 hover:scale-[1.02]">
                        <div className="relative z-10 space-y-8">
                            <div className="p-5 rounded-[2rem] bg-indigo-500 inline-block shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-transform duration-700 group-hover:scale-110">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50">Core Optimization</h4>
                                <p className="text-3xl font-display font-[300] tracking-tight leading-tight">AI Efficiency Intelligence</p>
                            </div>
                            <p className="text-base font-sans tracking-wide leading-relaxed opacity-70">
                                Autonomous requirement synthesis has achieved a <span className="text-indigo-400 dark:text-indigo-600 font-bold">28.4% improvement</span> in target resolution velocity.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-white/10 dark:border-black/10">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">System Benchmark</span>
                                    <span className="text-3xl font-display font-[300]">8.9<span className="text-sm opacity-40">/10</span></span>
                                </div>
                                <div className="h-1.5 bg-white/10 dark:bg-black/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[89%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative effects */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 dark:bg-black/5 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-150"></div>
                    </div>

                    <div className="premium-card p-10 group transition-all duration-500 hover:scale-[1.01]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h4 className="text-2xl font-display font-[300] text-foreground tracking-tight">Timeline Velocity</h4>
                                <p className="text-[12px] text-muted font-sans tracking-wide">Signal phase analysis</p>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-2xl border border-border/10">
                                <Clock className="w-6 h-6 text-muted" />
                            </div>
                        </div>
                        <div className="space-y-10">
                            {TIMELINE_VELOCITY_TEMPLATE.map((item) => (
                                <div key={item.stage} className="space-y-3 group/item">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[11px] font-black text-muted uppercase tracking-[0.2em] group-hover/item:text-foreground transition-colors">{item.stage}</span>
                                        <span className="text-[13px] font-display font-[300] text-foreground">{item.progress}%</span>
                                    </div>
                                    <div className="h-1 bg-secondary/30 rounded-full overflow-hidden relative">
                                        <div className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1500 ease-out", item.color)} style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
