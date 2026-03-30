import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { discussionMessages, discussionParticipants } from "../lib/features_utils";
import { cn } from "../lib/utils";

export default function ConflictResolution() {
    const { id } = useParams(); // Conflict ID
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { currentProject } = useProjectStore();

    // Fetch Conflict Details
    const { data: conflict, isLoading, error } = useQuery({
        queryKey: ["conflict", id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/${currentProject?._id}`);
            // Find the specific conflict in the list (temporary until individual GET /conflicts/:id is added)
            return response.data.conflicts.find(c => c._id === id);
        },
        enabled: !!id && !!currentProject?._id
    });

    // Vote Mutation
    const voteMutation = useMutation({
        mutationFn: async (voteData) => {
            return await api.post("/votes", voteData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            // In a real app, Socket.io would handle the update, but invalidation ensures sync
        }
    });

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse">Loading intelligence...</div>;
    if (error || !conflict) return <div className="p-10 text-center text-red-500 font-bold">Conflict not found or error loading.</div>;

    const handleVote = (resolutionId) => {
        voteMutation.mutate({
            conflictId: id,
            choice: resolutionId,
            comment: "Stakeholder decision via Triage Center"
        });
    };

    return (
        <div className="flex flex-col h-full xl:flex-row gap-8 overflow-hidden">
            {/* Main Discussion Area */}
            <div className="flex-1 flex flex-col bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none overflow-hidden">
                {/* Discussion Header */}
                <div className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        <span>{currentProject?.name || "Project"}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600 dark:text-indigo-400">#{id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {conflict.conflictType}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                    conflict.status === 'open'
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", conflict.status === 'open' ? "bg-emerald-500" : "bg-slate-400")}></span>
                                    {conflict.status}
                                </div>
                                <span className="text-xs font-bold text-slate-400 tracking-tight italic">
                                    Severity Score: {conflict.severityScore} ({conflict.severityColor})
                                </span>
                            </div>
                        </div>
                        {conflict.status === 'open' && (
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest">
                                <CheckCircle className="w-4 h-4" />
                                Resolve Conflict
                            </Button>
                        )}
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {discussionMessages.map((msg) => (
                        <MessageItem key={msg.id} msg={msg} />
                    ))}
                </div>

                {/* Reply Area */}
                <div className="p-6 bg-slate-50/50 dark:bg-[#0f1115]/50 border-t border-slate-200 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-indigo-500/50 transition-all">
                        <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50">
                            <ToolbarButton icon={Bold} />
                            <ToolbarButton icon={Italic} />
                            <ToolbarButton icon={LinkIcon} />
                            <ToolbarButton icon={CodeIcon} />
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <ToolbarButton icon={AtSign} />
                        </div>
                        <textarea
                            className="w-full border-none focus:ring-0 text-[15px] font-medium dark:bg-slate-900 dark:text-white p-5 resize-none placeholder-slate-400"
                            placeholder="Add your comment or propose a resolution..."
                            rows="3"
                        ></textarea>
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/50">
                            <button className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-widest">
                                <Paperclip className="w-4 h-4" />
                                Attach files
                            </button>
                            <Button className="bg-[#1e2532] hover:bg-slate-800 text-white font-black px-8 py-2 rounded-xl shadow-lg shadow-slate-900/10 text-xs uppercase tracking-widest active:scale-95 transition-all">
                                Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full xl:w-85 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6">
                {/* Participants */}
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Participants</h3>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[10px] font-black">{discussionParticipants.length}</span>
                    </div>
                    <div className="space-y-4">
                        {discussionParticipants.map((p) => (
                            <div key={p.id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={p.avatar} alt={p.name} className="size-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                                        {p.online && <div className="absolute -bottom-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f1115]"></div>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">{p.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{p.role}</p>
                                    </div>
                                </div>
                                <button className="p-1 px-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        <button className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all duration-300 group">
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Invite Others</span>
                        </button>
                    </div>
                </div>

                {/* Conflicting Requirements */}
                <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Affected Requirements</h3>
                    <div className="space-y-3">
                        <RequirementTiny
                            iconBg="bg-indigo-100 dark:bg-indigo-900/30"
                            id={`REQ-${conflict.requirementA?._id?.slice(-4).toUpperCase()}`}
                            title={conflict.requirementA?.title}
                        />
                        <RequirementTiny
                            iconBg="bg-amber-100 dark:bg-amber-900/30"
                            id={`REQ-${conflict.requirementB?._id?.slice(-4).toUpperCase()}`}
                            title={conflict.requirementB?.title}
                        />
                    </div>
                </div>

                {/* AI Resolution Strategies */}
                {conflict.resolutions?.length > 0 && (
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">AI Proposed Strategies</h3>
                        </div>
                        <div className="space-y-4">
                            {conflict.resolutions.map((res) => (
                                <div key={res._id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                                            {res.strategyType}
                                        </span>
                                        <button
                                            onClick={() => handleVote(res._id)}
                                            disabled={voteMutation.isLoading}
                                            className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                            Vote
                                        </button>
                                    </div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                        {res.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                        {res.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feasibility Impact */}
                <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-3xl p-6 relative overflow-hidden text-white shadow-2xl shadow-indigo-500/20 border border-indigo-500/20 group hover:-translate-y-1 transition-all duration-500 mt-auto">
                    <div className="flex items-center gap-2.5 mb-5 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Intelligent Impact Audit</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline Hit</p>
                                <p className="text-xl font-black text-indigo-400">{conflict.feasibility?.timelineImpact || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget Hit</p>
                                <p className="text-xl font-black text-amber-400">{conflict.feasibility?.costImpact || "N/A"}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Risk Level</span>
                                <span className={cn(
                                    "font-black",
                                    conflict.feasibility?.riskLevel === 'High' ? "text-red-400" : "text-emerald-400"
                                )}>{conflict.feasibility?.riskLevel || "Low"}</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    conflict.feasibility?.riskLevel === 'High' ? "bg-red-500 w-[85%]" : "bg-emerald-500 w-[30%]"
                                )}></div>
                            </div>
                        </div>
                        {conflict.explanation && (
                            <p className="text-[11px] text-slate-400 font-bold border-l-2 border-indigo-500/30 pl-3 py-1 italic">
                                {conflict.explanation}
                            </p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}

function MessageItem({ msg }) {
    return (
        <div className="flex gap-6 group">
            <div className="shrink-0 flex flex-col items-center gap-2">
                <img src={msg.user.avatar} alt={msg.user.name} className="size-11 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">{msg.user.name}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.time}</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[15px] font-medium leading-relaxed bg-white/30 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    {msg.content}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                    </button>
                    <button className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-all">
                        <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Replies */}
                {msg.replies && (
                    <div className="mt-8 ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800/50 space-y-8">
                        {msg.replies.map(reply => (
                            <div key={reply.id} className="flex gap-4 relative group/reply">
                                <div className="absolute -left-[34px] top-6 w-8 border-t-2 border-slate-100 dark:border-slate-800/50 rounded-full"></div>
                                <img src={reply.user.avatar} alt={reply.user.name} className="size-9 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{reply.user.name}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{reply.time}</span>
                                    </div>

                                    <div className="text-slate-700 dark:text-slate-300 text-[14px] font-medium leading-relaxed">
                                        {reply.content}
                                    </div>

                                    {reply.code && (
                                        <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[13px] text-blue-300 overflow-x-auto border border-slate-800 shadow-xl relative group/code">
                                            <pre><code>{reply.code}</code></pre>
                                            <button className="absolute top-4 right-4 p-2 text-slate-500 hover:text-indigo-400 transition-colors opacity-0 group-hover/code:opacity-100">
                                                <CodeIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {reply.proposal && (
                                        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em]">Proposed Solution</p>
                                            <p className="text-base font-extrabold text-slate-900 dark:text-white">{reply.proposal.title}</p>
                                            <div className="flex items-center gap-3">
                                                <button className="bg-white dark:bg-indigo-900/50 border border-slate-200 dark:border-indigo-800 px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2.5 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                                                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                                                    {reply.proposal.votes.up}
                                                </button>
                                                <button className="bg-white dark:bg-indigo-900/50 border border-slate-200 dark:border-indigo-800 px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2.5 hover:border-red-600 hover:text-red-600 transition-all shadow-sm">
                                                    <ThumbsDown className="w-4 h-4 text-red-500" />
                                                    {reply.proposal.votes.down}
                                                </button>
                                                <button className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest ml-auto hover:underline underline-offset-4 decoration-2">
                                                    Approve Solution
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {reply.attachment && (
                                        <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 w-fit cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all group/file">
                                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-600 group-hover/file:scale-110 transition-transform">
                                                <FileIcon className="w-6 h-6" />
                                            </div>
                                            <div className="pr-6">
                                                <p className="text-sm font-black text-slate-900 dark:text-white">{reply.attachment.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{reply.attachment.size} • {reply.attachment.type}</p>
                                            </div>
                                            <Download className="w-5 h-5 text-slate-300 group-hover/file:text-indigo-600 transition-colors" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon }) {
    return (
        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700/50 rounded-lg transition-all">
            <Icon className="w-4 h-4" />
        </button>
    );
}

function RequirementTiny({ id, title, iconBg }) {
    return (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", iconBg)}>
                    <FileIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{id}</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{title}</p>
        </div>
    );
}

