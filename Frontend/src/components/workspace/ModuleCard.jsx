import React from "react";
import { FileText, GripVertical, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function ModuleCard({ module }) {
    const { title, desc, icon: Icon, iconBg, developer, reqCount, status, statusColor } = module;

    return (
        <div className="bg-white dark:bg-[#0f1115] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", iconBg)}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors" />
                </div>

                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-5 line-clamp-2 leading-relaxed">
                    {desc}
                </p>

                <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-2.5">
                        {developer ? (
                            <>
                                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm">
                                    <img
                                        src={developer.avatar}
                                        alt={developer.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {developer.name}
                                </span>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 italic">
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                                    <span className="text-[10px] font-bold">+</span>
                                </div>
                                <span className="text-xs font-semibold">Unassigned</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <FileText className="w-4 h-4" />
                        <span className="text-[11px] font-extrabold tracking-tight">
                            {reqCount} Requirements
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", statusColor)}>
                        {status}
                    </span>
                    {status === "Completed" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 drop-shadow-sm" />
                    ) : !developer ? (
                        <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-lg text-[10px] font-black hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 transition-all duration-300 shadow-sm">
                            Assign
                        </button>
                    ) : (
                        <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline underline-offset-4 decoration-2">
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
