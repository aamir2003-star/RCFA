import React from "react";
import { Link } from "react-router-dom";
import {
    AlertTriangle,
    Search,
    Filter,
    ChevronRight,
    AlertOctagon,
    Clock,
    User,
    ArrowRight,
    BrainCircuit
} from "lucide-react";
import { pmConflicts } from "../lib/features_utils";

export default function ConflictListPage() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                        Conflict Triage
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Review and resolve logical contradictions across project requirements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search identification..."
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                        />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-500 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Conflict Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Conflicts", val: "12", color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
                    { label: "High Impact", val: "04", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    { label: "Resolved Today", val: "08", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-1 items-center md:items-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-black ${stat.color}`}>{stat.val}</span>
                            <span className="text-xs font-bold text-slate-400">/ Total</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Conflict List Content */}
            <div className="space-y-4">
                {pmConflicts.map((conflict, i) => (
                    <Link
                        key={i}
                        to={`/pm/conflicts/${conflict.id}`}
                        className="block group"
                    >
                        <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`p-4 rounded-2xl ${conflict.status === 'Critical' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' :
                                    conflict.status === 'Active' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                                        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
                                    } group-hover:scale-110 transition-transform duration-500`}>
                                    {conflict.status === 'Critical' ? <AlertOctagon className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="text-indigo-500">{conflict.id}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{conflict.project}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                        {conflict.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <BrainCircuit className="w-3.5 h-3.5" />
                                            {conflict.reqA} vs {conflict.reqB}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {conflict.time}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 relative z-10">
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Impact Level</p>
                                    <p className={`font-black uppercase tracking-tighter ${conflict.impact === 'High' ? 'text-red-500' :
                                        conflict.impact === 'Medium' ? 'text-amber-500' :
                                            'text-emerald-500'
                                        }`}>{conflict.impact}</p>
                                </div>
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned To</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{conflict.owner}</p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all group-hover:rotate-45">
                                    <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
