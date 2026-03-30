import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import {
    Box,
    Code,
    FileText,
    Search,
    Filter,
    ChevronRight,
    Terminal,
    Cpu
} from "lucide-react";
import { devModules } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function DevModules() {
    return (
        <MainLayout role="dev">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <Terminal className="w-8 h-8 text-indigo-500" />
                            My Modules
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage technical specifications and implementation progress.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/40 transition-all w-64"
                            />
                        </div>
                        <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {devModules.map((mod, i) => (
                        <div key={i} className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/5 dark:shadow-none hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", mod.statusColor)}>
                                    {mod.statusBadge}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{mod.title}</h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">{mod.project}</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Build Readiness</span>
                                    <span>85%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full w-[85%]"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reqs</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{mod.reqs}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conflicts</p>
                                    <p className="text-lg font-black text-red-500">{mod.conflicts}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tasks</p>
                                    <p className="text-lg font-black text-indigo-500">{mod.threads}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <button className="flex-1 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
                                    View Specs
                                </button>
                                <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-indigo-600 transition-colors">
                                    <Code className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
