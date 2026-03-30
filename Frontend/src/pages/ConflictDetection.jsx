import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
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
    ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { conflictDetails, resolutionSuggestions } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function ConflictDetection() {
    const { id, status, impact, reqA, reqB, aiAnalysis } = conflictDetails;

    return (
        <MainLayout role="pm">
            <div className="flex flex-col gap-8 pb-10">
                {/* Breadcrumbs & Title Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Projects</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Project Phoenix</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Conflicts</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-slate-900 dark:text-white font-black">{id}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Conflict {id}</h1>
                                <div className="flex gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 text-[10px] font-black uppercase tracking-wider">
                                        {status} Conflict
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
                                        {impact} Impact
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                Detected between
                                <span className="text-indigo-600 dark:text-indigo-400">{reqA.id}: {reqA.title}</span>
                                <span>&</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{reqB.id}: {reqB.title}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                                <MessageSquare className="w-4 h-4" />
                                Start Discussion
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest">
                                <CheckCircle className="w-4 h-4" />
                                Resolve Conflict
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Comparison View */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RequirementCard req={reqA} />
                            <RequirementCard req={reqB} />
                        </div>

                        {/* AI Analysis Logic Box */}
                        <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="flex items-start gap-5 relative z-10">
                                <div className="mt-1 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-indigo-900 dark:text-indigo-300 font-black text-sm uppercase tracking-widest">AI Logic Conflict Detection</h3>
                                    <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed font-medium">
                                        {aiAnalysis}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        </div>
                    </div>

                    {/* Right: AI Resolution Sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    <Bolt className="w-4 h-4 text-indigo-500" />
                                    Resolution Suggestions
                                </h3>
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full tracking-tight">
                                    {resolutionSuggestions.length} Proposals
                                </span>
                            </div>

                            <div className="space-y-4">
                                {resolutionSuggestions.map((suggestion) => (
                                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                                ))}
                            </div>

                            {/* Helpful Tools */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Helpful Assistant Tools</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 hover:bg-white transition-all group gap-2">
                                        <History className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">View History</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 hover:bg-white transition-all group gap-2">
                                        <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Invite Team</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bottom Bar Controls */}
                <div className="mt-4 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2.5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="size-8 rounded-full border-2 border-white dark:border-[#0f1115] bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="size-8 rounded-full border-2 border-white dark:border-[#0f1115] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                +2
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-bold italic tracking-tight">Requirement owners have been notified via Slack sync.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-colors">
                            Dismiss Conflict
                        </button>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <Button className="bg-[#1e2532] hover:bg-slate-800 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95 text-xs uppercase tracking-widest">
                            Finalize Resolution
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function RequirementCard({ req }) {
    return (
        <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">{req.id}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">{req.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.version}</span>
            </div>
            <div className="p-7 flex-1 flex flex-col gap-5">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                    {req.content}
                </p>
                <div className="bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500 p-5 rounded-2xl shadow-sm">
                    <p className="text-red-900 dark:text-red-300 font-bold text-sm leading-relaxed italic">
                        {req.highlight}
                    </p>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Users className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner: {req.owner}</span>
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
