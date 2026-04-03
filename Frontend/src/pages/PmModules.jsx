import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Box,
    Plus,
    Users,
    Cpu,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    BrainCircuit,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    X,
    UserPlus,
    Layout
} from "lucide-react";
import useProjectStore from "../stores/useProjectStore";
import useModuleStore from "../stores/useModuleStore";
import ProjectSelector from "../components/shared/ProjectSelector";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PmModules() {
    const [searchParams, setSearchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");

    const {
        projects,
        fetchProjects,
        requirements,
        fetchRequirements,
        syncRequirementsAfterModuleDelete,
        syncRequirementsAfterModuleCreate
    } = useProjectStore();
    const {
        modules,
        loading,
        fetchModules,
        createModule,
        assignDeveloper,
        deleteModule,
        fetchProjectDevelopers,
        getAssignmentSuggestions,
        generateModuleSuggestion
    } = useModuleStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const [availableDevs, setAvailableDevs] = useState([]);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isSuggestingModule, setIsSuggestingModule] = useState(false);
    const [expandedReqs, setExpandedReqs] = useState([]);
    const lastAiRef = React.useRef({ name: "", description: "" });

    const [newModule, setNewModule] = useState({
        name: "",
        description: "",
        requirementIds: []
    });

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (projectId) {
            fetchModules(projectId);
            fetchRequirements(projectId, 1, 100); // Fetch a larger batch for assignment
            fetchProjectDevelopers(projectId).then(setAvailableDevs);
        }
    }, [projectId, fetchModules, fetchRequirements, fetchProjectDevelopers]);

    const handleGenerateAiSuggestion = async () => {
        if (newModule.requirementIds.length < 2) return;

        setIsSuggestingModule(true);
        try {
            const suggestion = await generateModuleSuggestion(newModule.requirementIds);
            if (suggestion) {
                setNewModule(prev => ({
                    ...prev,
                    name: suggestion.name,
                    description: suggestion.description
                }));
                lastAiRef.current = {
                    name: suggestion.name,
                    description: suggestion.description
                };
            }
        } catch (error) {
            console.error("Failed to generate module suggestion:", error);
        } finally {
            setIsSuggestingModule(false);
        }
    };

    const handleProjectSelect = (id) => {
        setSearchParams({ projectId: id });
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();
        const result = await createModule({
            ...newModule,
            projectId,
            requirements: newModule.requirementIds
        });
        if (result.success) {
            setIsCreateModalOpen(false);
            setNewModule({ name: "", description: "", requirementIds: [] });
            // Sync requirements locally for immediate UI update
            syncRequirementsAfterModuleCreate(newModule.requirementIds, result.module._id);
        }
    };

    const handleOpenAssignModal = async (mod) => {
        setSelectedModule(mod);
        setIsAssignModalOpen(true);
        setAiSuggestion(null);
    };

    const handleGetAiSuggestion = async () => {
        setIsAiLoading(true);
        try {
            const suggestion = await getAssignmentSuggestions(selectedModule._id);
            setAiSuggestion(suggestion);
        } catch (error) {
            console.error("AI Suggestion failed:", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAssign = async (devId) => {
        const result = await assignDeveloper(selectedModule._id, devId);
        if (result.success) {
            setIsAssignModalOpen(false);
            setSelectedModule(null);
        }
    };

    if (!projectId) {
        return (
            <ProjectSelector
                projects={projects}
                onSelect={handleProjectSelect}
                title="Module Architecture"
                description="Select a project to organize requirements into architectural blocks and assign them to your engineering team."
            />
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <button onClick={() => setSearchParams({})} className="hover:text-indigo-600 transition-colors">Projects</button>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Modules</span>
                    </nav>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Box className="w-8 h-8 text-indigo-500" />
                        Architectural Modules
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Organizing <span className="text-indigo-600 font-bold underline decoration-indigo-500/20 underline-offset-4">
                            {projects.find(p => p._id === projectId)?.name || "Project"}
                        </span> requirements into implementation blocks.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-6 shadow-xl shadow-indigo-500/20 group transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    New Module
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Modules", val: modules.length, icon: Layout, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { label: "Assigned", val: modules.filter(m => m.assignedTo).length, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { label: "Pending", val: modules.filter(m => !m.assignedTo).length, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    { label: "Coverage", val: `${Math.min(100, Math.round((modules.reduce((acc, m) => acc + (m.requirements?.length || 0), 0) / (requirements.length || 1)) * 100))}%`, icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-1">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-2", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.val}</span>
                    </div>
                ))}
            </div>

            {/* Module Grid */}
            {loading && modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Assembling Architecture...</p>
                </div>
            ) : modules.length === 0 ? (
                <div className="bg-white dark:bg-[#0f1115] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-20 text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                        <Cpu className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Modules Defined</h3>
                        <p className="text-slate-500 max-w-sm mt-2">Start by grouping your project requirements into logical implementation modules like "Auth", "Payments", or "UI Components".</p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="rounded-2xl px-8">
                        Get Started
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod) => (
                        <motion.div
                            layout
                            key={mod._id}
                            className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/5 dark:shadow-none hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 transition-colors">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        mod.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            mod.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                    )}>
                                        {mod.status || 'Pending'}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            const res = await deleteModule(mod._id);
                                            if (res.success) {
                                                // Sync requirements locally for immediate UI update
                                                syncRequirementsAfterModuleDelete(mod._id);
                                            }
                                        }}
                                        className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">{mod.name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5rem] mb-6 leading-relaxed">
                                {mod.description || "No description provided for this architectural block."}
                            </p>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Requirements</span>
                                    <span className="text-slate-900 dark:text-white">{mod.requirements?.length || 0} items</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {mod.requirements?.slice(0, 3).map((req, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-[8px] font-bold text-slate-400 rounded-md border border-slate-100 dark:border-slate-800">
                                            {typeof req === 'object' ? req.title : 'Requirement'}
                                        </span>
                                    ))}
                                    {mod.requirements?.length > 3 && (
                                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-[8px] font-black text-indigo-500 rounded-md">
                                            +{mod.requirements.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                {mod.assignedTo ? (
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-indigo-500/20">
                                            {mod.assignedTo.name?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none">{mod.assignedTo.name}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Assigned Developer</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <div className="size-8 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                            <UserPlus className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting Lead</p>
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => handleOpenAssignModal(mod)}
                                    className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    {mod.assignedTo ? 'Reassign' : 'Assign'}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Module Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-[#0f1115] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Define Architecture</h2>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Create an implementation block</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateModule} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module Name</label>
                                                <button
                                                    type="button"
                                                    disabled={newModule.requirementIds.length < 2 || isSuggestingModule}
                                                    onClick={handleGenerateAiSuggestion}
                                                    className={cn(
                                                        "flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                                                        newModule.requirementIds.length >= 2
                                                            ? "text-indigo-500 hover:text-indigo-600"
                                                            : "text-slate-300 cursor-not-allowed"
                                                    )}
                                                >
                                                    {isSuggestingModule ? (
                                                        <><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</>
                                                    ) : (
                                                        <><BrainCircuit className="w-3 h-3" /> Auto-Draft with AI</>
                                                    )}
                                                </button>
                                            </div>
                                            <input
                                                required
                                                disabled={isSuggestingModule}
                                                placeholder='e.g. Identity & Auth'
                                                value={newModule.name}
                                                onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none",
                                                    isSuggestingModule && "opacity-50 cursor-not-allowed"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context / Focus Area</label>
                                            <input
                                                disabled={isSuggestingModule}
                                                placeholder='e.g. JWT, OAuth, MFA'
                                                value={newModule.description}
                                                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none",
                                                    isSuggestingModule && "opacity-50 cursor-not-allowed"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link Requirements ({newModule.requirementIds.length} selected)</label>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 h-64 overflow-y-auto custom-scrollbar">
                                            <div className="grid grid-cols-1 gap-2">
                                                {requirements.filter(r => !r.moduleId).length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                                        <Search className="w-8 h-8 text-slate-300 mb-2" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                                            All requirements are <br /> already assigned
                                                        </p>
                                                    </div>
                                                ) : (
                                                    requirements.filter(r => !r.moduleId).map((req) => (
                                                        <div
                                                            key={req._id}
                                                            className={cn(
                                                                "flex flex-col gap-2 p-4 rounded-2xl border transition-all",
                                                                newModule.requirementIds.includes(req._id)
                                                                    ? "bg-white dark:bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                                                                    : "bg-transparent border-transparent hover:bg-white/50"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <label className="flex items-center gap-4 cursor-pointer flex-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={newModule.requirementIds.includes(req._id)}
                                                                        onChange={(e) => {
                                                                            const ids = e.target.checked
                                                                                ? [...newModule.requirementIds, req._id]
                                                                                : newModule.requirementIds.filter(id => id !== req._id);
                                                                            setNewModule({ ...newModule, requirementIds: ids });
                                                                        }}
                                                                    />
                                                                    <div className={cn(
                                                                        "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                                        newModule.requirementIds.includes(req._id) ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 dark:border-slate-700"
                                                                    )}>
                                                                        {newModule.requirementIds.includes(req._id) && <Plus className="w-3 h-3" />}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{req.title}</p>
                                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.category || 'General'} • {req.priority}</p>
                                                                    </div>
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setExpandedReqs(prev =>
                                                                            prev.includes(req._id)
                                                                                ? prev.filter(id => id !== req._id)
                                                                                : [...prev, req._id]
                                                                        );
                                                                    }}
                                                                    className="p-1 px-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                                                                >
                                                                    {expandedReqs.includes(req._id) ? "Hide" : "Details"}
                                                                </button>
                                                            </div>

                                                            {expandedReqs.includes(req._id) && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                                                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                                                            {req.description || "No description available for this requirement."}
                                                                        </p>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl px-8">Cancel</Button>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-12 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                                        Architect Module
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Assign Developer Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-[#0f1115] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Assignment Lead</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Select executor for {selectedModule?.name}</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors font-black">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* AI Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Intelligence Suggestion</h4>
                                        <button
                                            onClick={handleGetAiSuggestion}
                                            disabled={isAiLoading}
                                            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                                        >
                                            {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                                            {isAiLoading ? "Analyzing..." : "Get Suggestion"}
                                        </button>
                                    </div>

                                    {aiSuggestion ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl p-6 border border-indigo-500/20"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                                                    {availableDevs.find(d => d._id === aiSuggestion.suggestedDeveloperId)?.name?.charAt(0) || 'D'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">
                                                            {availableDevs.find(d => d._id === aiSuggestion.suggestedDeveloperId)?.name || "Recommended Expert"}
                                                        </p>
                                                        <span className="text-[10px] font-black text-indigo-600">
                                                            {Math.round(aiSuggestion.confidence * 100)}% Match
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed italic mb-4">
                                                        "{aiSuggestion.reasoning}"
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleAssign(aiSuggestion.suggestedDeveloperId)}
                                                        className="w-full bg-white dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
                                                    >
                                                        Accept Suggestion →
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="p-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-center">
                                            <BrainCircuit className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click 'Get Suggestion' for AI Insights</p>
                                        </div>
                                    )}
                                </div>

                                {/* Manual List */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Members</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {availableDevs.map(dev => (
                                            <div
                                                key={dev._id}
                                                onClick={() => handleAssign(dev._id)}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-indigo-500/40 hover:bg-white dark:hover:bg-slate-900 cursor-pointer transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-500/40 transition-all">
                                                        {dev.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{dev.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 truncate w-40">{dev.email}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100" />
                                            </div>
                                        ))}
                                        {availableDevs.length === 0 && (
                                            <div className="p-4 text-center text-slate-400 italic text-xs font-bold">
                                                No developers found in this project.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
