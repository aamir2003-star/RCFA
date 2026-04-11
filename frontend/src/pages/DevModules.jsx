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
    Layers,
    Activity
} from "lucide-react";
import useModuleStore from "../stores/useModuleStore";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DevModules() {
    const { user } = useAuthStore();
    const { modules, loading: modulesLoading, fetchUserModules, updateModuleStatus } = useModuleStore();
    const { conflicts, fetchConflicts } = useProjectStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedModule, setExpandedModule] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        if (user?._id) {
            fetchUserModules(user._id);
        }
    }, [user?._id, fetchUserModules]);

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
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <Activity className="w-10 h-10 animate-spin text-muted/40" />
                <span className="font-display font-[300] text-2xl text-muted italic">Synchronizing Module Registry...</span>
            </div>
        );
    }

    return (
        <div className="space-y-16 max-w-7xl mx-auto pb-24 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-6xl text-foreground font-display font-[300] tracking-tight">
                        Implementation <span className="italic">Blocks</span>
                    </h1>
                    <p className="text-[12px] font-bold text-muted uppercase tracking-[0.25em]">
                        Orchestrating {modules.length} Assigned Modules
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                        <input
                            type="text"
                            placeholder="Filter registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-secondary/20 border-none rounded-full py-5 pl-14 pr-10 text-[13px] font-sans placeholder-muted/40 focus:ring-1 focus:ring-foreground/10 w-72 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            {filteredModules.length === 0 ? (
                <div className="premium-card p-20 text-center flex flex-col items-center gap-6 border-dashed opacity-60">
                    <Cpu className="w-12 h-12 text-muted/20" />
                    <p className="font-display font-[300] text-2xl text-muted italic">No module signals detected.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredModules.map((mod) => (
                        <div
                            key={mod._id}
                            className="premium-card p-10 flex flex-col space-y-10 group hover:border-foreground/10 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 rounded-[22px] bg-secondary flex items-center justify-center text-muted group-hover:text-foreground group-hover:bg-secondary/80 transition-all shadow-inset-subtle border border-border/10">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-border/10 shadow-inset-subtle",
                                    mod.status === 'completed' ? 'bg-emerald-500/5 text-emerald-600' :
                                        mod.status === 'in-progress' ? 'bg-indigo-500/5 text-indigo-600' :
                                            'bg-secondary/50 text-muted'
                                )}>
                                    {mod.status || 'Pending'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-display font-[300] tracking-tight group-hover:italic transition-all">{mod.name}</h3>
                                <p className="text-[12px] text-muted-foreground leading-relaxed font-sans line-clamp-2 italic">
                                    {mod.description || "Experimental implementation block for core architecture."}
                                </p>
                            </div>

                            <div className="space-y-4 flex-1">
                                <button
                                    onClick={() => setExpandedModule(expandedModule === mod._id ? null : mod._id)}
                                    className="w-full flex items-center justify-between p-5 rounded-3xl bg-secondary/20 hover:bg-secondary/40 transition-all border border-border/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-4 h-4 text-indigo-400" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Specifications</p>
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-muted transition-transform duration-500", expandedModule === mod._id && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {expandedModule === mod._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden space-y-3 pt-2"
                                        >
                                            {mod.requirements?.map((req, idx) => {
                                                const reqConflicts = getRequirementConflicts(req._id || req);
                                                const hasConflicts = reqConflicts.length > 0;

                                                return (
                                                    <div key={idx} className="p-5 rounded-3xl bg-secondary/10 border border-border/5 space-y-3">
                                                        <div className="flex items-start gap-4">
                                                            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", hasConflicts ? "bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.5)]" : "bg-indigo-400")} />
                                                            <div className="flex-1">
                                                                <p className="text-[13px] font-display font-[500] leading-tight">{typeof req === 'object' ? req.title : 'Requirement'}</p>
                                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1 opacity-60">{typeof req === 'object' ? req.category : 'General'}</p>
                                                            </div>
                                                        </div>
                                                        {hasConflicts && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-400/5 border border-red-400/10 text-[9px] font-bold text-red-500 uppercase tracking-widest">
                                                                <AlertCircle className="w-3 h-3" /> Contradiction Detected
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-8 border-t border-border/10 flex items-center gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(mod._id, mod.status)}
                                    disabled={mod.status === 'completed' || updatingStatus === mod._id}
                                    className={cn(
                                        "flex-1 font-bold py-5 rounded-[22px] text-[10px] uppercase tracking-[0.2em] transition-all shadow-pill flex items-center justify-center gap-3",
                                        mod.status === 'completed'
                                            ? "bg-emerald-500/5 text-emerald-600 border border-emerald-500/10"
                                            : mod.status === 'in-progress'
                                                ? "bg-black text-white hover:shadow-premium"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                    )}
                                >
                                    {updatingStatus === mod._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-muted" />
                                    ) : mod.status === 'completed' ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Block Secured</>
                                    ) : mod.status === 'in-progress' ? (
                                        <><Clock className="w-4 h-4" /> Deliver Specifications</>
                                    ) : (
                                        <><Cpu className="w-4 h-4" /> Initialize Workspace</>
                                    )}
                                </button>
                                <button className="w-14 h-14 bg-secondary flex items-center justify-center text-muted rounded-[22px] hover:text-foreground hover:bg-secondary/80 transition-all shadow-inset-subtle border border-border/10">
                                    <Code className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
