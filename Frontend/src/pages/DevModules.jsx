import React, { useEffect, useState } from "react";
import {
    Box,
    Code,
    FileText,
    Search,
    Filter,
    ChevronRight,
    Terminal,
    Cpu,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    Layers
} from "lucide-react";
import useModuleStore from "../stores/useModuleStore";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DevModules() {
    const { user } = useAuthStore();
    const { modules, loading: modulesLoading, fetchMyModules, updateModuleStatus } = useModuleStore();
    const { conflicts, fetchConflicts } = useProjectStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedModule, setExpandedModule] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        if (user?._id) {
            fetchMyModules(user._id);
        }
    }, [user?._id, fetchMyModules]);

    // Fetch conflicts for all projects the developer is involved in
    useEffect(() => {
        if (modules.length > 0) {
            const projectIds = [...new Set(modules.map(m => m.projectId))];
            projectIds.forEach(id => fetchConflicts(id));
        }
    }, [modules, fetchConflicts]);

    const handleStatusUpdate = async (moduleId, currentStatus) => {
        let nextStatus = "";
        if (!currentStatus || currentStatus === 'pending') nextStatus = 'in-progress';
        else if (currentStatus === 'in-progress') nextStatus = 'completed';
        else return;

        setUpdatingStatus(moduleId);
        await updateModuleStatus(moduleId, nextStatus);
        setUpdatingStatus(null);
    };

    const filteredModules = modules.filter(mod =>
        mod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRequirementConflicts = (reqId) => {
        return conflicts.filter(c =>
            (c.requirementA === reqId || c.requirementB === reqId ||
                c.requirementA?._id === reqId || c.requirementB?._id === reqId) &&
            c.status === 'open'
        );
    };

    if (modulesLoading && modules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching assigned modules...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Workspace</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Assigned Modules</span>
                    </nav>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-indigo-500" />
                        My Implementation Blocks
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Viewing <span className="text-indigo-600 font-bold underline decoration-indigo-500/20 underline-offset-4">
                            {modules.length} modules
                        </span> assigned for technical development.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search blocks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            {filteredModules.length === 0 ? (
                <div className="bg-white dark:bg-[#0f1115] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-20 text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                        <Cpu className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Modules Assigned</h3>
                        <p className="text-slate-500 max-w-sm mt-2">You don't have any architectural modules assigned to you yet. Check with your PM for active project assignments.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredModules.map((mod) => (
                        <motion.div
                            layout
                            key={mod._id}
                            className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/5 dark:shadow-none hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white duration-500">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    mod.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        mod.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                    {mod.status || 'Pending'}
                                </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">{mod.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed italic line-clamp-2 min-h-[2.5rem]">
                                {mod.description || "Experimental implementation block for core architecture."}
                            </p>

                            {/* Requirements Preview */}
                            <div className="space-y-4 mb-6 flex-1">
                                <button
                                    onClick={() => setExpandedModule(expandedModule === mod._id ? null : mod._id)}
                                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-left group/btn"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                                            <Layers className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white">Specs & Requirements</p>
                                            <p className="text-[9px] font-bold text-slate-400">{mod.requirements?.length || 0} items identified</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300", expandedModule === mod._id && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {expandedModule === mod._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 p-2"
                                        >
                                            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                                {mod.requirements?.map((req, idx) => {
                                                    const reqConflicts = getRequirementConflicts(req._id || req);
                                                    const hasConflicts = reqConflicts.length > 0;

                                                    return (
                                                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "size-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                                                    hasConflicts ? "bg-red-50 dark:bg-red-500/10" : "bg-indigo-50 dark:bg-indigo-500/10"
                                                                )}>
                                                                    <div className={cn("size-1.5 rounded-full", hasConflicts ? "bg-red-500 animate-pulse" : "bg-indigo-500")} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">{typeof req === 'object' ? req.title : 'Requirement item'}</p>
                                                                        {hasConflicts && (
                                                                            <span className="flex items-center gap-1 text-[7px] font-black text-red-500 uppercase tracking-tighter bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded-md">
                                                                                <AlertCircle className="w-2.5 h-2.5" /> {reqConflicts.length} Conflict{reqConflicts.length > 1 ? 's' : ''}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{typeof req === 'object' ? req.category : 'General'}</p>
                                                                </div>
                                                            </div>
                                                            {typeof req === 'object' && req.description && (
                                                                <p className="text-[9px] text-slate-500 leading-relaxed pl-8 border-l border-slate-100 dark:border-slate-800 ml-2.5">
                                                                    {req.description}
                                                                </p>
                                                            )}
                                                            {hasConflicts && (
                                                                <div className="mt-1 pl-8 space-y-1">
                                                                    {reqConflicts.map((c, ci) => (
                                                                        <div key={ci} className="text-[8px] text-red-400/80 font-medium italic flex items-center gap-1.5">
                                                                            <div className="w-1 h-1 bg-red-400/50 rounded-full" />
                                                                            {c.explanation || "AI detected contradiction with another specification."}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(mod._id, mod.status)}
                                    disabled={mod.status === 'completed' || updatingStatus === mod._id}
                                    className={cn(
                                        "flex-1 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-950/10 dark:shadow-none flex items-center justify-center gap-2",
                                        mod.status === 'completed'
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 scale-100"
                                            : mod.status === 'in-progress'
                                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]"
                                                : "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:scale-[1.02]"
                                    )}
                                >
                                    {updatingStatus === mod._id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : mod.status === 'completed' ? (
                                        <><CheckCircle2 className="w-3 h-3" /> Block Completed</>
                                    ) : mod.status === 'in-progress' ? (
                                        <><Clock className="w-3 h-3" /> Deliver Implementation</>
                                    ) : (
                                        <><Cpu className="w-3 h-3" /> Start Implementation</>
                                    )}
                                </button>
                                <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-500/20 shadow-sm relative group/code">
                                    <Code className="w-4 h-4" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">CODE SPECS</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

