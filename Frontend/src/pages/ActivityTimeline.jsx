import React from "react";
import {
    Search,
    Calendar,
    Filter,
    Download,
    MoreHorizontal,
    ChevronDown,
    CheckCircle,
    MessageCircle,
    AlertTriangle,
    PlusCircle,
    UserPlus
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { timelineActivities } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function ActivityTimeline() {
    return (
        <div className="flex flex-col xl:flex-row gap-8 h-full">
            {/* Sidebar Filters */}
            <aside className="w-full xl:w-80 flex flex-col gap-8 shrink-0">
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Search Trail</h3>
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Event Types</h3>
                        <div className="space-y-2">
                            <FilterToggle label="Conflicts" icon={AlertTriangle} color="text-red-500" defaultChecked />
                            <FilterToggle label="Requirements" icon={PlusCircle} color="text-indigo-500" defaultChecked />
                            <FilterToggle label="Resolutions" icon={CheckCircle} color="text-emerald-500" defaultChecked />
                            <FilterToggle label="Discussions" icon={MessageCircle} color="text-blue-500" defaultChecked />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Projects</h3>
                        <button className="w-full flex items-center justify-between p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-100 dark:border-indigo-900/30">
                            <span>All Projects</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    <Button className="w-full bg-[#1e2532] hover:bg-slate-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95">
                        <Download className="w-4.5 h-4.5" />
                        Export Audit Log
                    </Button>
                </div>
            </aside>

            {/* Main Timeline Section */}
            <div className="flex-1 space-y-10 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">System Activity</h1>
                        <p className="text-sm font-bold text-slate-500">Real-time audit trail of all project modifications and AI resolutions.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                            <Calendar className="w-4 h-4" />
                            Oct 2023
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Timeline View */}
                <div className="relative">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-7 top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800/50 rounded-full"></div>

                    <div className="space-y-12 relative">
                        {/* Group: Today */}
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="z-10 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 ml-2">Today</div>
                            </div>

                            <div className="space-y-10 pl-2">
                                {timelineActivities.filter(a => a.date === 'Today').map(item => (
                                    <TimelineEntry key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Group: Yesterday */}
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="z-10 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ml-2">Yesterday</div>
                            </div>

                            <div className="space-y-10 pl-2">
                                {timelineActivities.filter(a => a.date === 'Yesterday').map(item => (
                                    <TimelineEntry key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center pt-8">
                            <button className="px-8 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all active:scale-95">
                                View Older Activities
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterToggle({ label, icon: Icon, color, defaultChecked }) {
    return (
        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer group transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
            <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", color)} />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
            </div>
            <input
                type="checkbox"
                defaultChecked={defaultChecked}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-transparent"
            />
        </label>
    );
}

function TimelineEntry({ item }) {
    const { icon: Icon, bgIcon, iconColor, user, time, content, tags, title, isComment, approvers, status } = item;

    return (
        <div className="flex gap-8 relative group">
            {/* Icon Node */}
            <div className={cn("size-14 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-[#f6f7f7] dark:border-[#16181c] shadow-lg transition-transform duration-500 group-hover:scale-110", bgIcon, iconColor)}>
                <Icon className="w-6 h-6" />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-500/5 transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{user.name}</span>
                                <span className="text-xs font-bold text-slate-500 leading-none">{user.action}</span>
                            </div>
                            {title && <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-tight">{title}</span>}
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{time}</span>
                </div>

                {isComment ? (
                    <div className="relative pl-6 py-1">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/30 rounded-full"></div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
                            "{content}"
                        </p>
                    </div>
                ) : content ? (
                    <div className={cn(
                        "p-4 rounded-xl border mb-4",
                        item.type === 'conflict' ? "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 border-l-4 border-l-red-500" : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800"
                    )}>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {content}
                        </p>
                    </div>
                ) : null}

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex gap-2">
                        {tags?.map(tag => (
                            <span key={tag} className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                                tag === 'Critical' ? "bg-red-100 text-red-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                                {tag}
                            </span>
                        ))}
                        {approvers && (
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {approvers.map(a => (
                                        <div key={a} className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[8px] font-black uppercase">{a[0]}</div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Approved by {approvers.join(' & ')}</span>
                            </div>
                        )}
                    </div>
                    {status && (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.1em]">{status}</span>
                    )}
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
