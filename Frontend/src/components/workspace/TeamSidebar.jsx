import React from "react";
import { Sparkles, Zap, ChevronRight, Lock, UserPlus } from "lucide-react";
import { availableTeamMembers } from "../../lib/features_utils";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

export function TeamSidebar() {
    return (
        <aside className="w-85 flex flex-col gap-6 shrink-0 h-fit sticky top-24">
            <div className="premium-card p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-border/10 pb-6">
                    <h3 className="text-xl font-display font-[300] text-foreground">
                        Project Team
                    </h3>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            {availableTeamMembers.filter(m => m.status === 'online').length} Live
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">
                        Available Operatives
                    </p>
                    <div className="space-y-4">
                        {availableTeamMembers.map((member) => (
                            <div
                                key={member.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group cursor-grab active:cursor-grabbing",
                                    member.status === 'away'
                                        ? "bg-secondary/10 border-border/10 opacity-50"
                                        : "bg-secondary/30 border-border/10 hover:border-black dark:hover:border-white hover:bg-transparent"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-xl object-cover shadow-premium group-hover:scale-105 transition-transform"
                                        />
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 size-3 border-2 border-white dark:border-black rounded-full",
                                            member.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                                        )}></div>
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-foreground leading-none">
                                            {member.name}
                                        </p>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                {member.status === 'away' ? (
                                    <Lock className="w-3.5 h-3.5 text-muted/30" />
                                ) : (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-4 h-4 text-muted" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-dashed border-border/40 text-muted hover:text-foreground hover:border-foreground/40 hover:bg-secondary/20 transition-all duration-300 group">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Add Collaborator</span>
                </button>

                {/* AI Suggestion Card */}
                <div className="bg-black dark:bg-white text-white dark:text-black rounded-3xl p-6 relative overflow-hidden shadow-pill group transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center border border-white/20 dark:border-black/5">
                            <Sparkles className="w-4 h-4 text-white dark:text-black animate-pulse" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">Strategic Suggestion</p>
                    </div>
                    <p className="text-[13px] leading-relaxed mb-6 relative z-10 opacity-90 font-sans">
                        Elena Garcia is optimized for the <span className="font-bold underline">Admin Dashboard</span> based on current velocity.
                    </p>
                    <button className="w-full bg-white dark:bg-black text-black dark:text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] relative z-10 hover:opacity-90 transition-opacity shadow-premium">
                        Accept Recommendation
                    </button>
                    {/* Subtle glass effect overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 dark:bg-black/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>
            </div>
        </aside>
    );
}
