import React from "react";
import {
    MessageSquare,
    Code,
    Terminal,
    Hash,
    AtSign,
    Paperclip,
    Send,
    ChevronRight,
    Search
} from "lucide-react";
import { discussionMessages } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function DevDiscussions() {
    return (
        <div className="flex flex-col h-full lg:flex-row gap-8 overflow-hidden">
            {/* Sidebar: Channels/Threads */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pb-6">
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/5 dark:shadow-none space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Channels</h3>
                        <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">6 Active</span>
                    </div>
                    <div className="space-y-1">
                        <ChannelItem icon={Hash} label="general-dev" active />
                        <ChannelItem icon={Terminal} label="pipeline-conflicts" badge="3" />
                        <ChannelItem icon={Code} label="module-integration" />
                        <ChannelItem icon={MessageSquare} label="design-sync" />
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Direct Messages</h3>
                        <div className="space-y-4">
                            <UserItem name="Sarah Chen" role="PM" online />
                            <UserItem name="Liam O'Connor" role="Architect" online />
                            <UserItem name="Brian Thompson" role="QA" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content: Thread */}
            <div className="flex-1 flex flex-col bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-hidden">
                {/* Thread Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">pipeline-conflicts</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">High Priority Implementation Sync</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search thread..." className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/40 transition-all w-48" />
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {discussionMessages.map((msg, i) => (
                        <div key={i} className="flex gap-6 group">
                            <img src={msg.user.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform shrink-0" alt="avatar" />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-slate-900 dark:text-white text-base">{msg.user.name}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.time}</span>
                                </div>
                                <div className="bg-linear-to-br from-white to-slate-50 dark:from-slate-800/40 dark:to-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 text-sm font-medium leading-relaxed shadow-sm">
                                    {msg.content}
                                </div>
                                {msg.code && (
                                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto relative group/code">
                                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">typescript</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        </div>
                                        <pre className="text-[13px] font-mono text-blue-300"><code>{msg.code}</code></pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-8 bg-slate-50/50 dark:bg-[#0f1115]/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2.5 shadow-xl shadow-slate-200/10 dark:shadow-none focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all flex items-end gap-3">
                        <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea
                            rows="1"
                            placeholder="Propose a resolution or drop a snippet..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 dark:text-white resize-none py-3"
                        ></textarea>
                        <div className="flex items-center gap-2">
                            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                                <AtSign className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChannelItem({ icon: Icon, label, active, badge }) {
    return (
        <button className={cn(
            "flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group",
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:text-slate-900 dark:hover:text-white"
        )}>
            <div className="flex items-center gap-3">
                <Icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                <span className="tracking-tight">{label}</span>
            </div>
            {badge && (
                <span className={cn("px-1.5 py-0.5 rounded-lg text-[9px] font-black", active ? "bg-white/20 text-white" : "bg-red-500/10 text-red-500")}>
                    {badge}
                </span>
            )}
        </button>
    );
}

function UserItem({ name, role, online }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={`https://i.pravatar.cc/100?u=${name}`} className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform" alt={name} />
                    {online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f1115] rounded-full"></div>}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">{name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{role}</p>
                </div>
            </div>
            <button className="p-1 text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
