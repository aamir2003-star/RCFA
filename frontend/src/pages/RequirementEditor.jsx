import React, { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Search, Plus, FileText, AlertTriangle, Check, X, Sparkles,
    Trash2, ChevronRight, Maximize2, Minimize2, Lightbulb,
    Zap, Save, ArrowLeft, Inbox, Clock, Folder, Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import {
    REQUIREMENT_CATEGORIES,
    REQUIREMENT_PRIORITIES,
    STAKEHOLDERS,
    SMART_TEMPLATES
} from "../constants/requirements";
import ProjectSelector from "../components/shared/ProjectSelector";


export default function RequirementEditor() {
    const [searchParams, setSearchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const navigate = useNavigate();

    const {
        projects,
        fetchProjects,
        requirements,
        fetchRequirements,
        addRequirement,
        updateRequirement,
        deleteRequirement,
        generateAiRequirements,
        approveRequirement,
        pagination,
        loading,
        error: storeError,
        clearError
    } = useProjectStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReq, setSelectedReq] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [quickTitle, setQuickTitle] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: 'medium',
        category: 'Functional',
        stakeholder: 'Developer'
    });

    useEffect(() => {
        if (!projectId) {
            fetchProjects();
        } else {
            fetchRequirements(projectId, currentPage);
            // Clear selections when switching projects
            setSelectedReq(null);
            setIsAdding(false);
        }
        return () => clearError(); // Clear errors on unmount
    }, [projectId, fetchRequirements, fetchProjects, currentPage, clearError]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    const filteredRequirements = useMemo(() => {
        return requirements.filter(req =>
            req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.stakeholder.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [requirements, searchTerm]);


    const handleSelectReq = useCallback((req) => {
        setSelectedReq(req);
        setIsAdding(false);
        setFormData({
            title: req.title,
            description: req.description || "",
            priority: req.priority || "medium",
            category: req.category || "Functional",
            stakeholder: req.stakeholder || "Developer"
        });
    }, []);

    const handleAddNew = useCallback(() => {
        setSelectedReq(null);
        setIsAdding(true);
        setFormData({
            title: "",
            description: "",
            priority: 'medium',
            category: 'Functional',
            stakeholder: 'Developer'
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!formData.title.trim()) {
            toast.error("Requirement title is required");
            return;
        }

        let result;
        if (isAdding) {
            result = await addRequirement({ ...formData, projectId });
            if (result.success) {
                setIsAdding(false);
                setSelectedReq(result.requirement);
            }
        } else if (selectedReq) {
            result = await updateRequirement(selectedReq._id, formData);
        }

        if (result?.success) {
            toast.success(isAdding ? "Requirement created" : "Requirement updated");
        } else {
            toast.error(result?.message || "Failed to save requirement");
        }
    }, [formData, isAdding, projectId, selectedReq, addRequirement, updateRequirement]);

    const handleQuickAdd = useCallback(async (e) => {
        if (e.key === 'Enter' && quickTitle.trim()) {
            const result = await addRequirement({
                projectId,
                title: quickTitle,
                description: "Drafting...",
                priority: 'medium',
                category: 'Functional',
                stakeholder: 'Developer',
                status: 'draft'
            });
            if (result.success) {
                setQuickTitle("");
                toast.success("Quick-added to inventory!", { icon: '⚡' });
            }
        }
    }, [quickTitle, projectId, addRequirement]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this requirement?")) {
            const result = await deleteRequirement(id);
            if (result.success) {
                toast.success("Requirement deleted");
                if (selectedReq?._id === id) {
                    setSelectedReq(null);
                    setIsAdding(false);
                }
            }
        }
    }, [deleteRequirement, selectedReq]);

    const handleApprove = useCallback(async () => {
        if (!selectedReq) return;
        const result = await approveRequirement(selectedReq._id);
        if (result.success) {
            toast.success("Requirement approved!");
            setSelectedReq({ ...selectedReq, status: 'approved' });
        }
    }, [selectedReq, approveRequirement]);

    const applyTemplate = useCallback((text) => {
        setFormData(prev => ({ ...prev, description: text }));
        toast.success("Template applied!", { icon: '📝' });
    }, []);


    return (
        <div className="flex flex-col lg:h-full bg-slate-50/30 dark:bg-transparent -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
            {!projectId ? (
                <ProjectSelector
                    projects={projects}
                    onSelect={(id) => setSearchParams({ projectId: id })}
                    title="Requirement Discovery"
                    description="Choose a project to begin brainstorming and refining technical specifications. All requirements are scoped per project."
                    loading={loading}
                />
            ) : (
                <>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSearchParams({})} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {isAdding ? "Draft Requirement" : "Requirement Workshop"}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {(selectedReq || isAdding) && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setIsAdding(false); setSelectedReq(null); }} className="px-4 py-2.5 text-xs font-bold text-slate-500">Cancel</button>
                                    <Button onClick={handleSave} disabled={loading || !formData.title.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        {isAdding ? "Finalize" : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 flex-1 lg:overflow-hidden">
                        {/* Sidebar Inventory */}
                        <div className="w-full lg:w-80 flex flex-col gap-6">
                            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[400px] lg:h-full shadow-2xl shadow-slate-200/20">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 space-y-4 text-slate-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</h2>
                                        <button onClick={handleAddNew} className="p-1.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:scale-105 transition-all"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Quick add + Enter..."
                                            value={quickTitle}
                                            onChange={(e) => setQuickTitle(e.target.value)}
                                            onKeyDown={handleQuickAdd}
                                            className="w-full bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                    <AnimatePresence mode="popLayout">
                                        {filteredRequirements.map((req) => (
                                            <RequirementCard
                                                key={req._id}
                                                req={req}
                                                isSelected={selectedReq?._id === req._id}
                                                onSelect={handleSelectReq}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </AnimatePresence>

                                    {filteredRequirements.length === 0 && !loading && (
                                        <div className="p-12 text-center text-slate-400">
                                            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">No Items</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Page {pagination.page}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                                        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={!pagination.hasNext} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editor Surface */}
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {(selectedReq || isAdding) ? (
                                    <motion.div
                                        key={selectedReq?._id || "adding"}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className={cn(
                                            "bg-white dark:bg-[#0f1115]/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl",
                                            isFocusMode ? "fixed inset-4 sm:inset-8 z-50 pointer-events-auto" : "relative min-h-[500px] lg:h-[calc(100vh-180px)]"
                                        )}
                                    >
                                        <div className="p-6 sm:p-8 flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="max-w-3xl mx-auto space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <FileText className="w-3 h-3" />
                                                        <span>{selectedReq?.status === 'review' ? 'AI Suggestion' : 'Drafting Environment'}</span>
                                                    </div>
                                                    <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-500">
                                                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {selectedReq?.status === 'review' && (
                                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Sparkles className="w-5 h-5 text-amber-600" />
                                                            <p className="text-sm font-bold text-amber-900 dark:text-amber-400">Review AI Suggestion</p>
                                                        </div>
                                                        <button onClick={handleApprove} className="px-4 py-1.5 bg-amber-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-amber-600/20">Approve</button>
                                                    </div>
                                                )}

                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full text-4xl font-extrabold tracking-tight border-none focus:ring-0 bg-transparent text-slate-900 dark:text-white p-0"
                                                    placeholder="Requirement Title..."
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormControl label="Expert Domain">
                                                        <select value={formData.stakeholder} onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer">
                                                            {STAKEHOLDERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                        </select>
                                                        <ChevronRight className="absolute right-4 top-[38px] w-3 h-3 rotate-90 text-slate-400" />
                                                    </FormControl>
                                                    <FormControl label="Classification">
                                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer">
                                                            {REQUIREMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                        <ChevronRight className="absolute right-4 top-[38px] w-3 h-3 rotate-90 text-slate-400" />
                                                    </FormControl>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            Specifications
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Templates:</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(SMART_TEMPLATES[formData.stakeholder] || []).map((tmp, idx) => (
                                                            <button key={idx} onClick={() => applyTemplate(tmp.text)} className="px-3 py-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:bg-slate-100 transition-all">
                                                                {tmp.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        className="w-full min-h-[300px] bg-slate-50 dark:bg-slate-900/50 border-none rounded-3xl p-6 text-sm font-medium leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                        placeholder="Begin drafting detailed obligations..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="min-h-[300px] lg:h-[calc(100vh-180px)] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 mb-6">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Requirement Workshop</h3>
                                        <p className="text-slate-500 text-xs font-medium max-w-xs mb-6">Select an item from the inventory or start a new draft to begin specified work.</p>
                                        <Button onClick={handleAddNew} className="bg-slate-900 dark:bg-indigo-600 text-white font-black px-6 py-2.5 rounded-xl">Draft New</Button>
                                    </div>
                                )}
                            </AnimatePresence>
                            {isFocusMode && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsFocusMode(false)} />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function FormControl({ label, children }) {
    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
            {children}
        </div>
    );
}

const RequirementCard = React.memo(({ req, isSelected, onSelect, onDelete }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => onSelect(req)}
            className={cn(
                "p-4 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden",
                isSelected
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20"
                    : "bg-white dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 hover:border-indigo-500"
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {req.stakeholder}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <button onClick={(e) => onDelete(e, req._id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
            <h3 className="text-[14px] font-bold truncate leading-tight mb-1">{req.title}</h3>
            <p className={cn(
                "text-[10px] line-clamp-2 leading-relaxed mb-2 font-medium",
                isSelected ? "text-slate-300" : "text-slate-500"
            )}>
                {req.description || "No description provided."}
            </p>
            {req.status === 'review' && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-600 text-[9px] font-bold uppercase tracking-widest border border-amber-200">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Review
                </div>
            )}
        </motion.div>
    );
});
