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

    const stats = [
        {
            label: "Total Projects",
            value: bdeStats?.totalProjects || 0,
            icon: FileText,
            color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
            trend: "+12% this month"
        },
        {
            label: "Active Conflicts",
            value: bdeStats?.totalConflicts || 0,
            icon: AlertCircle,
            color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
            trend: "Needs attention"
        },
        {
            label: "Market Reach",
            value: bdeStats?.activeClients || 0,
            icon: TrendingUp,
            color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            trend: "Growing"
        },
        {
            label: "Delivery Rate",
            value: `${bdeStats?.completedProjects || 0}%`,
            icon: CheckCircle2,
            color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            trend: "Stable"
        }
    ];

    return (
        <div className="space-y-8 p-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reporting Engine</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Portfolio insights and project health analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                    <Button className="font-black bg-indigo-600 text-white rounded-xl px-6">
                        Live Analytics
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900/40 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm group hover:border-indigo-500/50 transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="w-3 h-3" />
                                12%
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{stat.value}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Project Health Table */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900/40 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white">
                                <BarChart className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Project Health Monitor</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter..."
                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Requirements</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conflicts</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {projects.length > 0 ? projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 font-bold text-xs flex items-center justify-center">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{project.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{project.status || "In Planning"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-xs font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                                                {project.requirementCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={cn(
                                                "text-xs font-black px-2 py-1 rounded-md",
                                                (project.conflictCount || 0) > 5
                                                    ? "bg-red-50 text-red-600 dark:bg-red-900/20"
                                                    : (project.conflictCount || 0) > 0
                                                        ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                                                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                                            )}>
                                                {project.conflictCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[60px]">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            (project.conflictCount || 0) > 5 ? "bg-red-500 animate-pulse" : (project.conflictCount || 0) > 0 ? "bg-amber-500" : "bg-emerald-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, (project.conflictCount || 1) * 10)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => navigate(`/bde/editor?projectId=${project._id}`)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
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

                {/* Regional Breakdown / Sidebar Metrics */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-all duration-700"></div>
                        <TrendingUp className="w-12 h-12 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-black mb-2 tracking-tight">AI Efficiency Score</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">Your requirement handling speed has improved by <span className="text-indigo-400 font-bold">24%</span> with automated conflict resolution.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Benchmark Progress</span>
                                <span className="text-2xl font-black">8.4<span className="text-sm text-slate-500">/10</span></span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-indigo-500 to-blue-500 w-[84%] rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/40 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800/60 transition-all hover:shadow-xl hover:shadow-slate-200/10 dark:hover:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Timeline Velocity</h4>
                            <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="space-y-6">
                            {[
                                { stage: "Concept Validation", color: "bg-emerald-500", progress: 100 },
                                { stage: "Requirement Bulk", color: "bg-indigo-500", progress: 65 },
                                { stage: "AI Triage", color: "bg-amber-500", progress: 40 },
                                { stage: "Final Review", color: "bg-slate-200 dark:bg-slate-800", progress: 0 }
                            ].map((item) => (
                                <div key={item.stage} className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.stage}</span>
                                        <span className="text-[10px] font-black text-slate-400">{item.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.progress}%` }}></div>
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
