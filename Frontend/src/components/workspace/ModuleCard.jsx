import React from "react";
import { FileText, GripVertical, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function ModuleCard({ module }) {
    const { title, desc, icon: Icon, iconBg, developer, reqCount, status, statusColor } = module;

    return (
        <div className="premium-card p-8 group transition-all duration-500 hover:shadow-pill">
            <div className="flex items-start justify-between mb-8">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inset-subtle border border-border/20",
                    iconBg
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <GripVertical className="w-5 h-5 text-muted opacity-20 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity" />
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-display font-[300] text-foreground tracking-tight leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                    {title}
                </h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed line-clamp-2 font-sans opacity-80">
                    {desc}
                </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {developer ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border/20 shadow-premium">
                                <img
                                    src={developer.avatar}
                                    alt={developer.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                                {developer.name}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group-hover:text-foreground transition-colors">
                            <div className="w-8 h-8 rounded-full bg-secondary/30 border border-dashed border-border/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-muted">+</span>
                            </div>
                            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Unassigned</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-muted">
                    <FileText className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{reqCount} REQS</span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-inset-subtle border border-border/10",
                    statusColor
                )}>
                    {status}
                </span>
                {!developer ? (
                    <button className="pill-button bg-black dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 hover:shadow-pill transition-all">
                        Assign
                    </button>
                ) : (
                    <button className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] hover:text-foreground transition-colors">
                        Modify
                    </button>
                )}
            </div>
        </div>
    );
}
