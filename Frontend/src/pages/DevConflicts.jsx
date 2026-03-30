import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import {
    AlertTriangle,
    ShieldAlert,
    Zap,
    Code,
    CheckCircle2,
    ArrowRight,
    Terminal,
    BarChart3
} from "lucide-react";
import { devActiveConflicts } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function DevConflicts() {
    return (
        <MainLayout role="dev">
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
                    <ImpactCard title="Critical Impact" value="4" sub="Immediate attention" color="text-red-500" bg="bg-red-500/10" />
                    <ImpactCard title="Resolved Today" value="12" sub="+8% from yesterday" color="text-emerald-500" bg="bg-emerald-500/10" />
                    <ImpactCard title="Avg. Resolution Time" value="4.2h" sub="-15% efficiency" color="text-indigo-500" bg="bg-indigo-500/10" />
                </div>

                {/* Conflicts List */}
                <div className="space-y-6">
                    {devActiveConflicts.map((conf, i) => (
                        <div key={i} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5 dark:shadow-none hover:border-red-500/30 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border", conf.priorityColor)}>
                                            {conf.priority} Priority
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {conf.id || 'CONF-' + (100 + i)}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{conf.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                                        Contradiction detected between {conf.module} and legacy core logic. This affects data integrity and scalability metrics for the upcoming sprint.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                                <Code className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{conf.module}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                                <BarChart3 className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">High Impact</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full lg:w-fit shrink-0">
                                    <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest">
                                        Launch Resolver
                                        <Zap className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black px-8 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all text-xs uppercase tracking-widest">
                                        View Discussion
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
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
