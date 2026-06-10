import React from "react";
import {
    Database,
    Plus,
    Search,
    Filter,
    Code,
    Book,
    ShieldCheck,
    Cpu,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";

const specs = [
    { title: "AES-256 Implementation", category: "Security", owner: "Senior Dev", lastUpdate: "2h ago", coverage: "95%" },
    { title: "Real-time SSE Pipeline", category: "Infrastructure", owner: "Architect", lastUpdate: "1d ago", coverage: "80%" },
    { title: "Auth Flow Logic V3", category: "Authentication", owner: "Senior Dev", lastUpdate: "3d ago", coverage: "100%" },
];

export default function DevVault() {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Database className="w-8 h-8 text-indigo-500" />
                        Technical Vault
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Contribute and manage technical specifications for the AI resolution engine.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                        <Plus className="w-4 h-4" />
                        Add Technical Spec
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Specs", val: "142", icon: Book, color: "text-indigo-500" },
                    { label: "AI Coverage", val: "88%", icon: ShieldCheck, color: "text-emerald-500" },
                    { label: "Active Threads", val: "12", icon: Cpu, color: "text-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Specs List */}
            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/5">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Specifications</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search Vault..." className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm w-64" />
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {specs.map((spec, i) => (
                        <div key={i} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    <Code className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{spec.title}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                        <span className="text-indigo-500">{spec.category}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{spec.owner}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness</p>
                                    <p className="font-bold text-emerald-500">{spec.coverage}</p>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updated</p>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{spec.lastUpdate}</p>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
