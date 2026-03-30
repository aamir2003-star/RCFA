import React from "react";
import { Sparkles, Zap, ChevronRight, Lock, UserPlus } from "lucide-react";
import { availableTeamMembers } from "../../lib/features_utils";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

export function TeamSidebar() {
    return (
        <aside className="w-85 flex flex-col gap-6 shrink-0">
            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Team Members
                    </h3>
                    <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] px-2.5 py-1 rounded-full font-black tracking-tight">
                        {availableTeamMembers.filter(m => m.status === 'online').length} Online
                    </span>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        Available for Assignment
                    </p>
                    <div className="space-y-3">
                        {availableTeamMembers.map((member) => (
                            <div
                                key={member.id}
                                className={cn(
                                    "flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 group cursor-grab active:cursor-grabbing",
                                    member.status === 'away'
                                        ? "bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-60"
                                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                                )}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="relative">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                                        />
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 size-3.5 border-2 border-white dark:border-[#0f1115] rounded-full",
                                            member.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                                        )}></div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                                            {member.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                {member.status === 'away' ? (
                                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                                ) : (
                                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-slate-300">⋮⋮</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all duration-300 group">
                    <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Invite Stakeholder</span>
                </button>

                {/* AI Suggestion Card */}
                <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-2xl p-5 relative overflow-hidden text-white shadow-xl shadow-indigo-500/20 border border-indigo-500/20 group hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center gap-2.5 mb-3 relative z-10">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">AI Suggestion</p>
                    </div>
                    <p className="text-xs text-slate-300 mb-5 relative z-10 leading-relaxed font-medium">
                        Based on historical sprint velocity and skill matching, <b>Elena Garcia</b> is recommended for the <b>Admin Dashboard</b> module.
                    </p>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2 h-9 text-[10px] tracking-wide relative z-10 shadow-lg shadow-indigo-700/20">
                        Apply Recommendation
                    </Button>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>
            </div>
        </aside>
    );
}
