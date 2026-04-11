import React from "react";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { TeamSidebar } from "../components/workspace/TeamSidebar";
import { workspaceModules } from "../lib/features_utils";
import { Plus, Search, Filter, LayoutGrid, List, AlertCircle, FileCheck, History, Code, Shield, Cpu, Database } from "lucide-react";
import { Button } from "../components/ui/Button";
import useProjectStore from "../stores/useProjectStore";
import useModuleStore from "../stores/useModuleStore";
import { useEffect } from "react";

export default function WorkspacePage() {
    const { currentProject, projectStats } = useProjectStore();
    const { modules, fetchModules, loading } = useModuleStore();

    useEffect(() => {
        if (currentProject?._id) {
            fetchModules(currentProject._id);
        }
    }, [currentProject?._id, fetchModules]);

    const getIconForModule = (index) => {
        const icons = [Code, Shield, Cpu, Database];
        return icons[index % icons.length];
    };

    return (
        <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/20 pb-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">Project Environment</span>
                    </div>
                    <h1 className="text-6xl font-display font-[300] text-foreground tracking-tight leading-[1.1]">
                        {currentProject?.name || "Select Workspace"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 pt-2">
                        <div className="flex items-center gap-3 group translate-y-0 hover:-translate-y-0.5 transition-transform duration-300">
                            <FileCheck className="w-4.5 h-4.5 text-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Requirements</span>
                                <span className="text-sm font-bold text-foreground">{projectStats?.requirements?.total || 0} Total</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-border/20"></div>
                        <div className="flex items-center gap-3 group translate-y-0 hover:-translate-y-0.5 transition-transform duration-300">
                            <AlertCircle className="w-4.5 h-4.5 text-red-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Conflicts</span>
                                <span className="text-sm font-bold text-foreground">{projectStats?.conflicts?.total || 0} Detected</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-border/20"></div>
                        <div className="flex items-center gap-3">
                            <History className="w-4.5 h-4.5 text-emerald-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Active Cycle</span>
                                <span className="text-sm font-bold text-foreground">Sprint 04</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-foreground transition-colors" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            className="pl-11 pr-4 py-3 rounded-full border border-border/20 bg-secondary/30 text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white transition-all w-64 placeholder:text-muted/60"
                        />
                    </div>
                    <button className="pill-button bg-black dark:bg-white text-white dark:text-black text-[11px] uppercase tracking-[0.2em] px-8 py-3.5 hover:shadow-pill transition-all">
                        <Plus className="w-4 h-4 inline-block mr-2" />
                        New Module
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-12">
                {/* Main Content Area */}
                <div className="flex-1 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-display font-[300] text-foreground">Architecture Modules</h2>
                            <p className="text-[13px] text-muted font-sans tracking-wide">Assign specialized roles to resolve technical debt.</p>
                        </div>
                        <div className="flex items-center gap-1 bg-secondary/30 p-1.5 rounded-2xl border border-border/10">
                            <button className="p-2.5 rounded-xl bg-black dark:bg-white shadow-pill text-white dark:text-black transition-all">
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-2.5 rounded-xl text-muted hover:text-foreground transition-all">
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules?.map((module, idx) => (
                            <ModuleCard
                                key={module._id}
                                module={{
                                    ...module,
                                    title: module.name,
                                    desc: module.description,
                                    icon: getIconForModule(idx),
                                    iconBg: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
                                    status: "Active",
                                    statusColor: "bg-emerald-50 text-emerald-600",
                                    reqCount: module.requirementCount || 0
                                }}
                            />
                        ))}

                        {/* Add New Module Placeholder Card */}
                        <button className="premium-card border-dashed border-border/40 p-10 flex flex-col items-center justify-center gap-6 text-muted hover:text-foreground hover:border-foreground/40 hover:bg-secondary/20 transition-all duration-500 group min-h-[280px]">
                            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-dashed border-border/60 group-hover:scale-110 transition-all duration-500 shadow-inset-subtle">
                                <Plus className="w-8 h-8 opacity-40 group-hover:opacity-100" />
                            </div>
                            <div className="text-center space-y-2">
                                <span className="block font-display font-[300] text-xl">Ingest Component</span>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Expand Architecture</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <TeamSidebar />
            </div>
        </div>
    );
}
