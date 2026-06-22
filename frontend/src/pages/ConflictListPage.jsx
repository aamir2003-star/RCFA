import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    AlertTriangle,
    Search,
    Filter,
    ChevronRight,
    AlertOctagon,
    Clock,
    ArrowRight,
    BrainCircuit,
    Loader2,
    Layers,
    Layout
} from "lucide-react";
import useConflictStore from "../stores/useConflictStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";

export default function ConflictListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const observerTarget = useRef(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useRef(null);
    
    const { 
        conflicts, 
        loading, 
        fetchAllPmConflicts, 
        fetchConflicts,
        pagination,
        filter,
        resetConflicts,
        subscribeToConflicts, 
        unsubscribeFromConflicts 
    } = useConflictStore();

    const { projects, fetchProjects } = useProjectStore();

    // Fetch projects on mount for navigation
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Search logic with debouncing
    const handleSearch = (q) => {
        setSearchQuery(q);
        if (debouncedSearch.current) clearTimeout(debouncedSearch.current);
        
        debouncedSearch.current = setTimeout(() => {
            resetConflicts();
            if (projectId) {
                fetchConflicts(projectId, 1, filter, false, q);
            } else {
                fetchAllPmConflicts(1, filter, false, q);
            }
        }, 500);
    };

    // Filter switching logic
    const handleFilterChange = (newStatus) => {
        if (newStatus === filter) return;
        resetConflicts();
        if (projectId) {
            fetchConflicts(projectId, 1, newStatus, false, searchQuery);
        } else {
            fetchAllPmConflicts(1, newStatus, false, searchQuery);
        }
    };

    // Project switching logic
    const handleProjectChange = (newPid) => {
        if (newPid === projectId) return;
        resetConflicts();
        setSearchQuery(""); // Clear search on project switch
        if (newPid) {
            setSearchParams({ projectId: newPid });
        } else {
            setSearchParams({});
        }
    };

    // Initial load and socket subscription
    useEffect(() => {
        if (projectId) {
            subscribeToConflicts(projectId);
        }
        
        resetConflicts();
        if (projectId) {
            fetchConflicts(projectId, 1, filter, false, searchQuery);
        } else {
            fetchAllPmConflicts(1, filter, false, searchQuery);
        }

        return () => {
            if (projectId) {
                unsubscribeFromConflicts(projectId);
            }
        };
    }, [projectId, filter, subscribeToConflicts, unsubscribeFromConflicts]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && pagination.hasMore && !loading) {
                    const nextPage = pagination.page + 1;
                    if (projectId) {
                        fetchConflicts(projectId, nextPage, filter, true, searchQuery);
                    } else {
                        fetchAllPmConflicts(nextPage, filter, true, searchQuery);
                    }
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [pagination.hasMore, loading, pagination.page, projectId, filter, searchQuery]);

    const currentProjectName = projectId && projects.length > 0
        ? (projects.find(p => p._id === projectId)?.name || "Selected Project")
        : null;

    return (
        <div className="flex flex-col gap-10 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-premium border border-indigo-500/10">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl text-foreground font-display font-[300] tracking-tight leading-none">
                                Conflict <span className="italic">Registry</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mt-3">
                                {projectId ? "Project-Specific Triage" : "Portfolio-Wide Intelligence"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-8 pt-2">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-2 bg-secondary/20 p-1 rounded-2xl border border-border/10">
                            {['open', 'resolved'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={cn(
                                        "px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                        filter === status 
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-premium scale-105" 
                                            : "text-muted hover:text-foreground hover:bg-secondary/40"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search Protocol Anomalies..."
                                className="bg-secondary/20 border border-border/10 rounded-[1.5rem] pl-12 pr-6 py-4 text-[13px] w-72 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Context Strip */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-border/10 p-4 -mx-2">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    <button
                        onClick={() => handleProjectChange(null)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-[1.8rem] whitespace-nowrap transition-all duration-500 shrink-0",
                            !projectId 
                                ? "bg-indigo-600 text-white shadow-indigo-500/20 shadow-xl" 
                                : "bg-white dark:bg-zinc-800 text-muted hover:text-foreground border border-border/10"
                        )}
                    >
                        <Layers className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Global Portfolio</span>
                    </button>

                    <div className="w-px h-10 bg-border/20 mx-2" />

                    {projects.map((proj) => (
                        <button
                            key={proj._id}
                            onClick={() => handleProjectChange(proj._id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-[1.8rem] whitespace-nowrap transition-all duration-500 shrink-0 group relative",
                                projectId === proj._id 
                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xl" 
                                    : "bg-white dark:bg-zinc-800 text-muted hover:text-foreground border border-border/10 hover:border-border/30"
                            )}
                        >
                            <Layout className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-[11px] font-black uppercase tracking-widest">{proj.name}</span>
                                {proj.conflictCount > 0 && (
                                    <span className={cn(
                                        "text-[8px] font-bold uppercase tracking-tighter",
                                        projectId === proj._id ? "opacity-60" : "text-indigo-500"
                                    )}>
                                        {proj.conflictCount} Anomalies
                                    </span>
                                )}
                            </div>
                            {projectId === proj._id && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-indigo-500 rounded-full blur-[2px]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conflict Stats Display */}
            <div className="flex items-center gap-12 px-6">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-60">Status Frequency</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-display font-[300] tracking-tighter">
                            {pagination.total}
                        </span>
                        <span className="text-xs text-indigo-500 font-black uppercase tracking-widest">{filter}</span>
                    </div>
                </div>
                
                <div className="h-10 w-px bg-border/10" />

                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-60">Architectural Context</span>
                    <span className="text-[11px] font-bold text-foreground tracking-wide uppercase opacity-80">
                        {currentProjectName || "Portfolio Consolidate"}
                    </span>
                </div>
            </div>

            {/* Conflict List Content */}
            <div className="space-y-6 min-h-[400px]">
                {conflicts.length === 0 && !loading ? (
                    <div className="premium-card p-24 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-700">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <BrainCircuit className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-display font-[300]">Synchronized Protocol</h3>
                            <p className="text-muted text-[13px] tracking-wide uppercase opacity-60">No logical contradictions detected in current batch</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {conflicts.map((conflict, i) => (
                                <Link
                                    key={conflict._id + i}
                                    to={`/pm/conflicts/${conflict._id}`}
                                    className="block group"
                                >
                                    <div className="premium-card p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-premium group transition-all relative overflow-hidden">
                                        <div className="flex items-center gap-8 relative z-10 flex-1">
                                            <div className={cn(
                                                "w-16 h-16 rounded-[22px] flex items-center justify-center border transition-all duration-500 group-hover:scale-110",
                                                conflict.severityScore >= 8 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                                conflict.severityScore >= 5 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                            )}>
                                                {conflict.severityScore >= 8 ? <AlertOctagon className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                                            </div>
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                                                    <span className="text-indigo-500">{conflict._id.substring(0, 8)}</span>
                                                    <span className="w-1 h-1 bg-border rounded-full" />
                                                    <span>{conflict.conflictType || 'Logic Contradiction'}</span>
                                                    {conflict.projectId?.name && (
                                                        <>
                                                            <span className="w-1 h-1 bg-border rounded-full" />
                                                            <span className="text-emerald-500">{conflict.projectId.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <h3 className="text-3xl font-display font-[300] tracking-tight group-hover:italic transition-all">
                                                    {conflict.explanation || "Requirement Contradiction"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary/40 rounded-lg text-[10px] font-bold text-muted">
                                                        <BrainCircuit className="w-3.5 h-3.5" />
                                                        {conflict.requirementA?.title} vs {conflict.requirementB?.title}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted opacity-60">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(conflict.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 relative z-10 shrink-0">
                                            <div className="hidden lg:flex flex-col items-end">
                                                <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1 opacity-60">Status</span>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                                    conflict.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                                                )}>
                                                    {conflict.status}
                                                </span>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/10 flex items-center justify-center text-muted group-hover:bg-black group-hover:text-white transition-all group-hover:rotate-45">
                                                <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                            </div>
                                        </div>

                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        
                        {/* Sentinel for Infinite Scroll */}
                        <div ref={observerTarget} className="h-20 flex items-center justify-center">
                            {loading && (
                                <div className="flex items-center gap-3 py-10">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Calibrating next batch...</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
