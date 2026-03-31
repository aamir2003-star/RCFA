import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Save,
    ChevronRight,
    MoreHorizontal,
    Type,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Bold,
    Italic,
    AlertTriangle,
    Plus,
    Trash2,
    Sparkles,
    Zap,
    FileText,
    ArrowLeft,
    Check,
    Search,
    Filter,
    Clock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";

// Mock AI assistant data for premium feel
const aiAssistantCards = [
    {
        id: 1,
        title: "Conflict Detected",
        desc: "This requirement conflicts with REQ-042 regarding data encryption standards.",
        icon: AlertTriangle,
        color: "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400",
        action: "Resolve Now"
    },
    {
        id: 2,
        title: "Optimization Tip",
        desc: "Consider merging this with REQ-105 to reduce database overhead.",
        icon: Zap,
        color: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20 text-indigo-600 dark:text-indigo-400",
        action: "Apply Suggestion"
    }
];

export default function RequirementEditor({ role = "bde" }) {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const navigate = useNavigate();

    const {
        requirements,
        fetchRequirements,
        addRequirement,
        updateRequirement,
        deleteRequirement,
        loading
    } = useProjectStore();

    const [selectedReq, setSelectedReq] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        category: "Functional",
        stakeholder: "Developer"
    });

    useEffect(() => {
        if (projectId) {
            fetchRequirements(projectId);
        }
    }, [projectId, fetchRequirements]);

    const filteredRequirements = requirements.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectReq = (req) => {
        setSelectedReq(req);
        setIsAdding(false);
        setFormData({
            title: req.title,
            description: req.description || "",
            priority: req.priority || "medium",
            category: req.category || "Functional",
            stakeholder: req.stakeholder || "Developer"
        });
    };

    const handleAddNew = () => {
        setSelectedReq(null);
        setIsAdding(true);
        setFormData({
            title: "",
            description: "",
            priority: "medium",
            category: "Functional",
            stakeholder: "Developer"
        });
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;

        let success = false;
        if (isAdding) {
            const result = await addRequirement({ ...formData, projectId });
            success = result.success;
            if (success) {
                setIsAdding(false);
                setSelectedReq(result.requirement);
            }
        } else if (selectedReq) {
            const result = await updateRequirement(selectedReq._id, formData);
            success = result.success;
        }

        if (success) {
            // Optional: Show success toast
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this requirement? This will also remove any associated conflicts.")) {
            await deleteRequirement(id);
            if (selectedReq?._id === id) {
                setSelectedReq(null);
                setIsAdding(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/30 dark:bg-transparent -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                {isAdding ? "Draft Requirement" : "Requirement Editor"}
                            </h1>
                            {isAdding ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20 animate-pulse">
                                    New Draft
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20">
                                    {requirements.length} Items
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                            {isAdding ? "Defining new project scope" : "Manage and refine project scope"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        Last Synced: Just now
                    </div>
                    {(selectedReq || isAdding) && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setSelectedReq(null);
                                }}
                                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleSave}
                                disabled={loading || !formData.title.trim()}
                                className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-xl shadow-slate-900/10 dark:shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                {isAdding ? "Finalize Requirement" : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Requirements Sidebar */}
                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[500px] lg:h-full shadow-2xl shadow-slate-200/20 dark:shadow-none">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Project Inventory</h2>
                                <button
                                    onClick={handleAddNew}
                                    className="p-1.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search requirements..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {filteredRequirements.map((req) => (
                                <div
                                    key={req._id}
                                    onClick={() => handleSelectReq(req)}
                                    className={cn(
                                        "p-4 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden",
                                        selectedReq?._id === req._id
                                            ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20"
                                            : "bg-white dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                req.priority === "high" || req.priority === "critical" ? "bg-red-500" :
                                                    req.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                                            )}></div>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                selectedReq?._id === req._id ? "text-slate-400" : "text-slate-400 dark:text-slate-500"
                                            )}>
                                                {req.priority} • {req.category}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, req._id)}
                                            className={cn(
                                                "opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all",
                                                selectedReq?._id === req._id
                                                    ? "hover:bg-red-500 text-slate-400 hover:text-white"
                                                    : "hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500"
                                            )}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <h3 className="text-[15px] font-bold truncate leading-tight mt-1">{req.title}</h3>
                                </div>
                            ))}

                            {filteredRequirements.length === 0 && !loading && (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                        <Inbox className="w-8 h-8" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No results found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Surface */}
                {(selectedReq || isAdding) ? (
                    <div
                        key={selectedReq?._id || "adding-new"}
                        className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500"
                    >
                        <div className="flex-1 bg-white dark:bg-[#0f1115] rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-y-auto custom-scrollbar">
                            <div className="max-w-4xl mx-auto space-y-10">
                                {/* Form Top Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <FileText className="w-3 h-3" />
                                        <span>Editing Mode</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full text-4xl font-extrabold tracking-tight border-none focus:ring-0 focus:outline-none placeholder-slate-200 dark:placeholder-slate-800 bg-transparent text-slate-900 dark:text-white p-0 shadow-none ring-0"
                                        placeholder={isAdding ? "Enter requirement title..." : "Requirement Title"}
                                        autoFocus={isAdding}
                                    />
                                </div>

                                {/* Controls Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-[24px] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                                    <FormControl label="Priority">
                                        <div className="relative">
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-3 text-[13px] font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                                <option value="critical">Critical Path</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
                                        </div>
                                    </FormControl>
                                    <FormControl label="Classification">
                                        <div className="relative">
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-3 text-[13px] font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                                            >
                                                <option value="Functional">Functional Req</option>
                                                <option value="Performance">Performance</option>
                                                <option value="Security">Security Protocol</option>
                                                <option value="Cost">Cost Optimization</option>
                                                <option value="Scalability">Scalability</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
                                        </div>
                                    </FormControl>
                                    <FormControl label="Domain Expert">
                                        <div className="relative">
                                            <select
                                                value={formData.stakeholder}
                                                onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-3 text-[13px] font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                                            >
                                                <option value="Developer">Lead Developer</option>
                                                <option value="Architect">System Architect</option>
                                                <option value="PM">Project Manager</option>
                                                <option value="Security">Security Auditor</option>
                                                <option value="Legal">Compliance Officer</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
                                        </div>
                                    </FormControl>
                                </div>

                                {/* Main Text Area */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                                        <EditorButton icon={Bold} />
                                        <EditorButton icon={Italic} />
                                        <EditorButton icon={List} />
                                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                        <EditorButton icon={LinkIcon} />
                                        <EditorButton icon={Code} />
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full min-h-[400px] bg-transparent text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed outline-none border-none focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 resize-none"
                                        placeholder="Detailed specification goes here..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Sidebar */}
                        <aside className="w-full xl:w-72 space-y-6">
                            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                        <Sparkles className="w-4.5 h-4.5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">AI Context</h3>
                                </div>

                                <div className="space-y-4">
                                    {aiAssistantCards.map((card) => (
                                        <div key={card.id} className={cn("p-4 rounded-2xl border transition-all duration-300 group hover:-translate-y-1", card.color)}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <card.icon className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{card.title}</span>
                                            </div>
                                            <p className="text-[12px] font-medium leading-relaxed opacity-90 mb-3">{card.desc}</p>
                                            <button className="text-[11px] font-black flex items-center gap-1 hover:gap-2 transition-all">
                                                {card.action}
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automation</p>
                                    <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group">
                                        <Zap className="w-4.5 h-4.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                        <div className="text-left leading-tight">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Expand Req</p>
                                            <p className="text-[10px] text-slate-500 mt-1 font-medium">Generate technical specs</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className="flex-1 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 mb-6 group hover:scale-110 transition-all duration-500">
                            <Plus className="w-10 h-10 group-hover:rotate-90 transition-all duration-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Requirement Workshop</h3>
                        <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-sm mb-8">
                            This project workspace allows you to refine existing requirements and add new ones to the project lifecycle.
                        </p>
                        <Button
                            onClick={handleAddNew}
                            className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            Draft New Requirement
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function FormControl({ label, children }) {
    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 font-bold">{label}</label>
            {children}
        </div>
    );
}

function EditorButton({ icon: Icon }) {
    return (
        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-indigo-500/10 rounded-lg transition-all">
            <Icon className="w-4 h-4" />
        </button>
    );
}

function Inbox(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    );
}
