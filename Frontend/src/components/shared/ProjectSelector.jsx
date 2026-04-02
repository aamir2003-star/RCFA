import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Folder, Box, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ProjectSelector({
    projects = [],
    onSelect,
    title = "Project Discovery",
    description = "Choose a context to begin deep analysis and health diagnostics.",
    loading = false
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = useMemo(() => {
        return projects.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    <Folder className="w-3 h-3" />
                    Select Context
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                    {description}
                </p>
                <div className="max-w-md mx-auto relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-xl shadow-slate-200/20 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 leading-normal">
                {filteredProjects.map((project, i) => (
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={project._id}
                        onClick={() => onSelect(project._id)}
                        className="group bg-white dark:bg-[#0f1115]/60 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl cursor-pointer hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-colors",
                                i % 3 === 0 ? "bg-indigo-600" : i % 3 === 1 ? "bg-blue-600" : "bg-purple-600"
                            )}>
                                <Box className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {project.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight pr-8">{project.name}</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6">
                            {project.description || "No project description provided."}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex -space-x-2">
                                {project.team?.slice(0, 3).map((member, idx) => (
                                    <div key={idx} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0f1115] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                                        {member.name?.charAt(0) || 'D'}
                                    </div>
                                ))}
                                {project.team?.length > 3 && (
                                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0f1115] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-400">
                                        +{project.team.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                Launch Intel
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Inbox className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matches found</p>
                </div>
            )}
        </div>
    );
}
