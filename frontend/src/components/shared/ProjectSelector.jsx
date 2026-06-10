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
        <div className="max-w-6xl mx-auto space-y-16 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-indigo-500/20 shadow-premium">
                    <Folder className="w-3.5 h-3.5" />
                    Project Ledger
                </div>
                <div className="space-y-4">
                    <h1 className="text-6xl font-display font-[300] tracking-tight text-foreground">{title}</h1>
                    <p className="text-lg text-muted font-sans max-w-lg mx-auto leading-relaxed tracking-wide">
                        {description}
                    </p>
                </div>
                <div className="max-w-md mx-auto relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan for active signals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary/30 border border-border/10 rounded-[2rem] py-5 pl-14 pr-8 text-[14px] font-sans outline-none focus:border-black/20 dark:focus:border-white/20 transition-all shadow-inset-subtle"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 leading-normal">
                {filteredProjects.map((project, i) => (
                    <motion.div
                        whileHover={{ y: -12, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        key={project._id}
                        onClick={() => onSelect(project._id)}
                        className="premium-card p-10 cursor-pointer group transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div className={cn(
                                "w-14 h-14 rounded-[2rem] flex items-center justify-center text-white shadow-pill transition-transform duration-500 group-hover:scale-110",
                                i % 3 === 0 ? "bg-indigo-500" : i % 3 === 1 ? "bg-blue-500" : "bg-violet-500"
                            )}>
                                <Box className="w-7 h-7" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-sm">
                                {project.status || "Operational"}
                            </span>
                        </div>
                        <h3 className="text-2xl font-display font-[300] text-foreground mb-3 leading-tight tracking-tight group-hover:text-indigo-500 transition-colors">{project.name}</h3>
                        <p className="text-[13px] text-muted font-sans leading-relaxed mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                            {project.description || "Synthesizing architectural documentation and team alignment protocols."}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-border/10">
                            <div className="flex -space-x-3">
                                {project.team?.slice(0, 3).map((member, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-black shadow-sm group-hover:translate-x-1 transition-transform">
                                        {member.name?.charAt(0) || 'D'}
                                    </div>
                                ))}
                                {project.team?.length > 3 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary/80 flex items-center justify-center text-[10px] font-black text-muted shadow-sm">
                                        +{project.team.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                Launch Intel
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProjects.length === 0 && !loading && (
                <div className="py-40 px-10 text-center space-y-8 bg-secondary/5 rounded-[3rem] border border-dashed border-border/20">
                    <Inbox className="w-16 h-16 text-muted/20 mx-auto" />
                    <div className="space-y-4">
                        <h3 className="text-3xl font-display font-[300] text-foreground italic">Pipeline Exhausted</h3>
                        <p className="text-muted font-sans text-base max-w-md mx-auto leading-relaxed tracking-wide">
                            We couldn't locate any active signals matching your search criteria.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
