import React from "react";
import {
    ShieldAlert,
    Zap,
    Code,
    Terminal,
    BarChart3,
    AlertTriangle,
    MessageSquare
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../lib/api";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";

export default function DevConflicts() {
    const { currentProject } = useProjectStore();

    const { data: conflictsData, isLoading } = useQuery({
        queryKey: ["conflicts", currentProject?._id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/${currentProject?._id}`);
            return response.data;
        },
        enabled: !!currentProject?._id
    });

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-indigo-500">Scanning Pipeline...</div>;

    const conflicts = conflictsData?.conflicts || [];

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                        Pipeline Conflicts
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Resolve technical contradictions in requirement specifications.</p>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImpactCard title="Potential Impact" value={conflicts.length} sub="Identified Conflicts" color="text-red-500" bg="bg-red-500/10" />
                <ImpactCard title="Analyzed" value="100%" sub="Of Requirements" color="text-emerald-500" bg="bg-emerald-500/10" />
                <ImpactCard title="Avg. Severity" value={conflicts.length ? (conflicts.reduce((a, b) => a + (b.severityScore || 0), 0) / conflicts.length).toFixed(1) : "0"} sub="Across Project" color="text-indigo-500" bg="bg-indigo-500/10" />
            </div>

            {/* Conflicts List */}
            <div className="space-y-6">
                {conflicts.map((conf, i) => (
                    <div key={conf._id} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5 dark:shadow-none hover:border-red-500/30 transition-all duration-300 group">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                                        conf.severityScore >= 8 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {conf.severityScore >= 8 ? "CRITICAL" : "HIGH"}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{conf._id.slice(-6).toUpperCase()}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{conf.conflictType}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                                    {conf.explanation || `Contradiction detected between requirements ${conf.requirementA?.title} and ${conf.requirementB?.title}.`}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                            <Code className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{conf.conflictType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 text-amber-500">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Severity {conf.severityScore}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full lg:w-fit shrink-0">
                                <Link
                                    to={`/dev/conflicts/${conf._id}/discussion`}
                                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                                >
                                    Join Discussion
                                    <Zap className="w-4 h-4" />
                                </Link>
                                <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black px-8 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all text-xs uppercase tracking-widest">
                                    Triage Info
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
function ImpactCard({ title, value, sub, color, bg }) {
    return (
        <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
                <div className={cn("p-1.5 rounded-lg", bg)}>
                    <Terminal className={cn("w-4 h-4", color)} />
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{sub}</p>
            </div>
        </div>
    );
}
