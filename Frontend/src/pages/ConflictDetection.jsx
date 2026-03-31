import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronRight,
    AlertTriangle,
    Shield,
    BrainCircuit,
    Bolt,
    Keyboard,
    History,
    Users,
    CheckCircle,
    MessageSquare,
    Edit,
    Trash2,
    AlertOctagon,
    ArrowRight,
    Loader2,
    TrendingDown,
    DollarSign,
    Clock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import useConflictStore from "../stores/useConflictStore";

export default function ConflictDetection() {
    const { conflictId } = useParams();
    const navigate = useNavigate();
    const { conflicts, loading, resolveConflict } = useConflictStore();

    const conflict = useMemo(() => {
        return conflicts.find(c => c._id === conflictId);
    }, [conflicts, conflictId]);

    const handleResolve = async () => {
        if (!conflictId) return;
        const result = await resolveConflict(conflictId);
        if (result.success) {
            alert("Conflict marked as resolved");
        } else {
            alert("Error resolving conflict: " + result.message);
        }
    };

    if (loading && !conflict) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium">Loading conflict analysis...</p>
            </div>
        );
    }

    if (!conflict) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conflict Not Found</h3>
                <p className="text-slate-500">The conflict you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    // Map backend severity score to UI impact labels
    const impactLabel = conflict.severityScore >= 8 ? "High" : conflict.severityScore >= 5 ? "Medium" : "Low";
    const impactColor = conflict.severityScore >= 8 ? "text-red-500" : conflict.severityScore >= 5 ? "text-amber-500" : "text-emerald-500";
    const impactBg = conflict.severityScore >= 8 ? "bg-red-50 dark:bg-red-500/10" : conflict.severityScore >= 5 ? "bg-amber-50 dark:bg-amber-500/10" : "bg-emerald-50 dark:bg-emerald-500/10";

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="hover:text-indigo-500 cursor-pointer" onClick={() => navigate(-1)}>Triage</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-indigo-500">Analysis ID: {conflict._id.substring(0, 8)}</span>
            </div>

            {/* Main Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                    <div className={cn("p-5 rounded-[2rem] shadow-xl shadow-current/5", impactBg, impactColor)}>
                        {conflict.severityScore >= 8 ? <AlertOctagon className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", impactBg, impactColor, "border-current/20")}>
                                {impactLabel} Impact
                            </div>
                            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                AI Analysis Active
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {conflict.explanation || "Requirement Contradiction"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-indigo-500" />
                            Detection Pipeline: 7-Step Cross-Module Semantic Verification
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-2xl border-slate-200 dark:border-slate-800 h-14 px-8 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-900">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discuss
                    </Button>
                    <Button
                        onClick={handleResolve}
                        disabled={conflict.status === 'resolved'}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                        {conflict.status === 'resolved' ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resolved
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resolve Conflict
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Component Comparison */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 z-20 animate-pulse">
                                <Bolt className="w-6 h-6" />
                            </div>
                            <div className="absolute w-[80%] h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                        </div>

                        {[
                            { req: conflict.requirementA, color: "indigo" },
                            { req: conflict.requirementB, color: "emerald" }
                        ].map((item, i) => (
                            <div key={i} className={cn(
                                "group bg-white dark:bg-[#0f1115] border rounded-[2.5rem] p-8 transition-all hover:shadow-2xl relative overflow-hidden",
                                i === 0 ? "border-indigo-500/20 hover:border-indigo-500/50" : "border-emerald-500/20 hover:border-emerald-500/50"
                            )}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                        i === 0 ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        Source Requirement {i === 0 ? 'A' : 'B'}
                                    </div>
                                    <Edit className="w-4 h-4 text-slate-300 hover:text-indigo-500 cursor-pointer" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {item.req?.title}
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                    {item.req?.description}
                                </p>
                                <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                        <Keyboard className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Module</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.req?.module || 'Global'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <BrainCircuit className="absolute top-10 right-10 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Bolt className="w-6 h-6 text-yellow-400 fill-current" />
                            AI Reasoning & Analysis
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <p className="text-indigo-100 leading-relaxed font-medium">
                                    {conflict.aiAnalysis || "The system has detected a logical cross-module conflict. Requirement A specifies a restrictive rule that directly contradicts the operational flexibility required by Requirement B."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                    <TrendingDown className="w-5 h-5 text-red-400 mt-1" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Operational Risk</p>
                                        <p className="text-sm font-medium text-white/80">Potential delay of {conflict.estimatedRiskDays || 5} days in module synchronization due to logic gaps.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                    <DollarSign className="w-5 h-5 text-emerald-400 mt-1" />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Financial Impact</p>
                                        <p className="text-sm font-medium text-white/80">Estimated cost of oversight: ${conflict.estimatedCost || '2,500'} USD in rework effort.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            AI Suggestions
                        </h3>
                        <div className="space-y-4">
                            {(conflict.suggestions || ["Renegotiate priority of Requirement A", "Add conditional logic to Requirement B", "Merge into a unified requirement document"]).map((suggestion, i) => (
                                <div key={i} className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Resolution {i + 1}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {suggestion}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-8 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white h-12 font-bold uppercase tracking-widest text-[10px]">
                            Generate More Options
                        </Button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Conflict Metadata</h4>
                        <div className="space-y-6">
                            {[
                                { icon: Clock, label: "Detected On", val: new Date(conflict.createdAt).toLocaleString() },
                                { icon: Shield, label: "Pipeline Step", val: "Step 7: Final Verification" },
                                { icon: Users, label: "Stakeholders", val: "PM, BDE, Client" },
                                { icon: History, label: "Audit Log", val: "v1.4.2 Analysis" }
                            ].map((meta, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                                        <meta.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{meta.label}</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{meta.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuggestionCard({ suggestion }) {
    return (
        <div className={cn(
            "group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5",
            suggestion.opacity
        )}>
            <div className="flex items-center justify-between mb-4">
                <span className={cn("text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5", suggestion.color)}>
                    {suggestion.isRecommended && <Bolt className="w-3 h-3 animate-pulse" />}
                    {suggestion.type}
                </span>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-700">{suggestion.match} Match</span>
            </div>
            <h4 className="text-slate-900 dark:text-white font-extrabold text-[15px] mb-2 leading-tight">{suggestion.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5 font-medium">{suggestion.desc}</p>
            <button className={cn(
                "w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95",
                suggestion.isRecommended
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            )}>
                Apply Suggestion
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {suggestion.isRecommended && (
                <div className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-bounce"></div>
            )}
        </div>
    );
}
