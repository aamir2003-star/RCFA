import React, { useState, useEffect } from "react";
import {
    ShieldAlert,
    Zap,
    Code,
    Terminal,
    BarChart3,
    AlertTriangle,
    MessageSquare,
    Layers,
    Clock,
    Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import useProjectStore from "../stores/useProjectStore";
import useConflictStore from "../stores/useConflictStore";
import useAuthStore from "../stores/useAuthStore";
import { cn } from "../lib/utils";

export default function DevConflicts() {
    const { currentProject } = useProjectStore();
    const {
        conflicts,
        fetchConflicts,
        fetchAllDevConflicts,
        loading,
        pagination,
        filter,
        resetConflicts,
        initSocket
    } = useConflictStore();
    const { user } = useAuthStore();
    const observerTarget = React.useRef(null);

    // Filter switching logic
    const handleFilterChange = (newStatus) => {
        if (newStatus === filter) return;
        resetConflicts();
        if (currentProject) {
            fetchConflicts(currentProject._id, 1, newStatus);
        } else {
            fetchAllDevConflicts(1, newStatus);
        }
    };

    // Initial load
    useEffect(() => {
        resetConflicts();
        if (currentProject) {
            fetchConflicts(currentProject._id, 1, filter);
        } else {
            fetchAllDevConflicts(1, filter);
        }

        const userId = user?._id || user?.id;
        if (userId) {
            const cleanup = initSocket(currentProject?._id, userId);
            return cleanup;
        }
    }, [currentProject?._id, user?._id, user?.id]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && pagination.hasMore && !loading) {
                    const nextPage = pagination.page + 1;
                    if (currentProject) {
                        fetchConflicts(currentProject._id, nextPage, filter, true);
                    } else {
                        fetchAllDevConflicts(nextPage, filter, true);
                    }
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [pagination.hasMore, loading, pagination.page, currentProject, filter]);

    return (
        <div className="space-y-20 pb-32 max-w-7xl mx-auto px-4 md:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-border/10 pb-20">
                <div className="space-y-6 text-left">
                    <h1 className="text-6xl text-foreground font-display font-[300] tracking-tight leading-[1.1]">
                        Architectural <span className="italic">Contradictions</span>
                    </h1>
                    <p className="text-muted text-xl leading-relaxed max-w-2xl font-sans tracking-[0.18px] opacity-80">
                        {currentProject
                            ? `Synthesized anomalies identified within the ${currentProject.name} repository.`
                            : "A collaborative global registry of technical conflicts across all active protocols."}
                    </p>
                    
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 pt-8 no-print">
                        {['open', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleFilterChange(status)}
                                className={cn(
                                    "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300",
                                    filter === status 
                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-premium scale-105" 
                                        : "bg-secondary/40 text-muted hover:bg-secondary/60 hover:text-foreground"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conflicts List */}
            <div className="space-y-12">
                {conflicts.map((conf, i) => (
                    <div key={conf._id} className="premium-card p-12 group transition-all duration-700 relative overflow-hidden active:scale-[0.995]">
                        {/* Status Accents */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500",
                            conf.status === 'resolved' ? "bg-emerald-500" : (conf.severityScore >= 8 ? "bg-red-500" : "bg-amber-500")
                        )} />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-left">
                            <div className="flex-1 space-y-8">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className={cn(
                                        "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border",
                                        conf.status === 'resolved' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                                        (conf.severityScore >= 8 ? "bg-red-500/5 text-red-500 border-red-500/10" : "bg-amber-500/5 text-amber-500 border-amber-500/10")
                                    )}>
                                        {conf.status === 'resolved' ? 'Resolution Synchronized' : (conf.severityScore >= 8 ? "Critical Protocol Breach" : "Specification Alignment Required")}
                                    </div>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-40">System ID #{conf._id.slice(-8).toUpperCase()}</span>
                                </div>

                                <h2 className="text-4xl font-display font-[300] text-foreground leading-[1.2] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {conf.conflictType} — {conf.explanation?.split('.')[0]}.
                                </h2>

                                <div className="flex flex-wrap items-center gap-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[18px] bg-secondary/50 flex items-center justify-center text-muted group-hover:text-black dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-black group-hover:shadow-pill transition-all duration-500">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em] mb-1">Impact Radius</span>
                                            <span className="text-[13px] font-bold text-foreground tracking-widest uppercase">
                                                {conf.affectedModules?.length > 0 
                                                    ? conf.affectedModules.join(" & ") 
                                                    : (conf.requirementA?.moduleName || 'System Core')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[18px] bg-secondary/50 flex items-center justify-center text-muted group-hover:text-black dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-black group-hover:shadow-pill transition-all duration-500">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em] mb-1">Analytic Intensity</span>
                                            <span className="text-[13px] font-bold text-foreground tracking-widest uppercase">
                                                {Math.round((conf.aiConfidence || 0) * 100)}% Confidence • {conf.feasibility?.riskLevel || 'Med'} Risk
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[18px] bg-secondary/50 flex items-center justify-center text-muted group-hover:text-black dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-black group-hover:shadow-pill transition-all duration-500">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em] mb-1">Collaboration</span>
                                            <span className="text-[13px] font-bold text-foreground tracking-widest uppercase">
                                                {(conf.discussions?.length || 0) + (conf.proposals?.length || 0)} Active Signals
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <Link
                                    to={`/dev/conflicts/${conf._id}/discussion`}
                                    className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.3em] py-6 px-12 shadow-pill group-hover:scale-[1.05] transition-all duration-500 flex items-center gap-3"
                                >
                                    Join Discussion
                                    <Activity className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Sentinel element for Infinite Scroll */}
                <div ref={observerTarget} className="h-20 flex items-center justify-center">
                    {loading && (
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 animate-spin text-muted/40" />
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest">Hydrating Registry...</span>
                        </div>
                    )}
                    {!pagination.hasMore && conflicts.length > 0 && (
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-20">— End of Architectural History —</span>
                    )}
                </div>

                {conflicts.length === 0 && !loading && (
                    <div className="py-40 px-12 text-center space-y-10 bg-secondary/10 rounded-[40px] border border-dashed border-border/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent blur-3xl" />
                        <ShieldAlert className="w-16 h-16 text-muted/20 mx-auto relative z-10" />
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-4xl font-display font-[300] text-foreground tracking-tight italic">
                                {filter === 'open' ? 'Protocol Harmony Intact' : 'No Resolved Historical Data'}
                            </h3>
                            <p className="text-muted text-[17px] font-sans font-[300] max-w-lg mx-auto leading-relaxed tracking-wide opacity-70">
                                {filter === 'open' 
                                    ? 'No architectural contradictions identified in current specification manifolds.'
                                    : 'Your project history is clear of past reconciled contradictions.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
