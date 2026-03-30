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
        <div className="flex flex-col gap-8 w-full max-w-full pb-10">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            {currentProject?.name || "Select a Project"}
                        </h1>
                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-indigo-500" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {projectStats?.requirements?.total || 0} Requirements
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {projectStats?.conflicts?.total || 0} Conflicts
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500">
                                <History className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">
                                    Active Sprint
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search modules, requirements..."
                            className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full sm:w-64"
                        />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        Create Module
                    </Button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Modules</h2>
                            <p className="text-sm font-bold text-slate-500 mt-0.5">Prioritize development cycles by reordering modules.</p>
                        </div>
                        <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <button className="p-2 rounded-lg bg-white dark:bg-[#0f1115] shadow-sm text-indigo-600 transition-all">
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
                                <List className="w-4 h-4" />
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
                        <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300 group min-h-[220px]">
                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs">Add Module</span>
                        </button>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <TeamSidebar />
            </div>
        </div>
    );
}
