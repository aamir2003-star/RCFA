import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import {
    ChevronRight,
    CheckCircle,
    Bold,
    Italic,
    Link as LinkIcon,
    Code as CodeIcon,
    AtSign,
    Paperclip,
    Trash2,
    UserPlus,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    File as FileIcon,
    Download,
    Reply,
    Check,
    Zap,
    Plus,
    X,
    ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useState, useRef } from "react";

export default function ConflictResolution() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { currentProject } = useProjectStore();
    const [comment, setComment] = useState("");
    const [isProposing, setIsProposing] = useState(false);
    const [proposalText, setProposalText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const proposalFileInputRef = useRef(null);

    // Fetch Conflict Details
    const { data: conflict, isLoading, error } = useQuery({
        queryKey: ["conflict", id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/detail/${id}`);
            return response.data.conflict;
        },
        enabled: !!id
    });

    // Fetch Votes
    const { data: voteResults } = useQuery({
        queryKey: ["conflict-votes", id],
        queryFn: async () => {
            const response = await api.get(`/votes/${id}`);
            return response.data;
        },
        enabled: !!id
    });

    // Mutations
    const confirmMutation = useMutation({
        mutationFn: ({ resId, type }) => api.patch(`/conflicts/${id}/confirm`, { resolutionId: resId, type }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            toast.success("Conflict Resolution Confirmed");
            navigate("/pm/conflicts");
        }
    });

    const commentMutation = useMutation({
        mutationFn: (formData) => api.post(`/conflicts/${id}/comment`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            setComment("");
            setSelectedFiles([]);
            toast.success("Comment added");
        }
    });

    const proposalMutation = useMutation({
        mutationFn: (formData) => api.post(`/conflicts/${id}/propose`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            setProposalText("");
            setSelectedFiles([]);
            setIsProposing(false);
            toast.success("Proposal submitted");
        }
    });

    const voteMutation = useMutation({
        mutationFn: (proposalId) => api.post(`/conflicts/proposals/${proposalId}/vote`),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            toast.success("Vote updated");
        }
    });

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-indigo-500">Initializing Resolution Strategy...</div>;
    if (error || !conflict) return <div className="p-10 text-center text-red-500 font-bold">Conflict intel unavailable.</div>;

    // Determine highest voted AI resolution
    const highestVotedResId = voteResults?.tally ? Object.entries(voteResults.tally).reduce((a, b) => b[1] > a[1] ? b : a, ["", 0])[0] : null;

    // Determine highest voted Developer Proposal
    const topProposal = conflict.proposals?.length > 0
        ? [...conflict.proposals].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))[0]
        : null;

    const handleSendComment = (e) => {
        if (!comment.trim() && selectedFiles.length === 0) return;
        const formData = new FormData();
        formData.append("message", comment);
        selectedFiles.forEach(file => formData.append("attachments", file));
        commentMutation.mutate(formData);
    };

    const handleSumbitProposal = (e) => {
        e.preventDefault();
        if (!proposalText.trim()) return;
        const formData = new FormData();
        formData.append("text", proposalText);
        selectedFiles.forEach(file => formData.append("attachments", file));
        proposalMutation.mutate(formData);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full xl:flex-row gap-8 overflow-hidden">
            {/* Main Discussion Area */}
            <div className="flex-1 flex flex-col bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Discussion Header */}
                <div className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md z-20">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 hover:text-indigo-500 transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </button>
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

                        <div className="flex items-center gap-3">
                            {conflict.status !== 'resolved' && (
                                <button
                                    onClick={() => setIsProposing(true)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all text-[11px] uppercase tracking-widest whitespace-nowrap"
                                >
                                    <Zap className="w-4 h-4" />
                                    Propose Solution
                                </button>
                            )}
                            {conflict.status === 'resolved' && (
                                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 text-right">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1 text-right">Resolution Active</p>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                            Locked on {new Date(conflict.pmResolution?.confirmedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {conflict.discussions?.map((msg, i) => (
                        <div key={i} className="flex gap-6 group">
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                <img src={msg.user?.avatar || `https://ui-avatars.com/api/?name=${msg.user?.name}`} alt={msg.user?.name} className="size-11 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-slate-900 dark:text-white text-base">{msg.user?.name}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="text-slate-700 dark:text-slate-300 text-[15px] font-medium leading-relaxed bg-white/30 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    {msg.message}

                                    {msg.attachments?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {msg.attachments.map((url, idx) => (
                                                <a key={idx} href={api.defaults.baseURL + url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-all group/file">
                                                    {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                        <img src={api.defaults.baseURL + url} alt="attachment" className="size-12 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                            <Paperclip className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div className="pr-2">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ATTACHMENT</p>
                                                        <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 truncate max-w-[100px]">View Detail</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!conflict.discussions || conflict.discussions.length === 0) && (
                        <div className="text-center py-20 text-slate-400 font-bold italic">No developer comments yet.</div>
                    )}
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-[#0f1115]/50 border-t border-slate-200 dark:border-slate-800">
                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2">
                            {selectedFiles.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-xs font-bold">
                                    <Paperclip className="w-3 h-3" />
                                    {file.name}
                                    <button onClick={() => removeFile(i)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-indigo-500/50 transition-all">
                        <textarea
                            className="w-full border-none focus:ring-0 text-[15px] font-medium dark:bg-slate-900 dark:text-white p-5 resize-none placeholder-slate-400"
                            placeholder="Add PM perspective or resolution guidance..."
                            rows="2"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
                                    PM Directive
                                </span>
                            </div>
                            <button
                                onClick={handleSendComment}
                                disabled={commentMutation.isLoading || (!comment.trim() && selectedFiles.length === 0)}
                                className="bg-[#1e2532] hover:bg-slate-800 text-white font-black px-8 py-2 rounded-xl shadow-lg text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full xl:w-85 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6">
                {/* Community Consensus Engine */}
                {conflict.proposals?.length > 0 && (
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consensus Engine</h3>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-widest">
                                {conflict.proposals.length} Proposals
                            </span>
                        </div>
                        <div className="space-y-4">
                            {[...conflict.proposals].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)).map((prop) => (
                                <div key={prop._id} className={cn(
                                    "p-4 rounded-xl border transition-all group",
                                    topProposal?._id === prop._id ? "border-emerald-500 bg-emerald-500/5" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
                                    conflict.pmResolution?.resolutionId === prop._id ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500" : ""
                                )}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <img src={prop.user?.avatar || `https://ui-avatars.com/api/?name=${prop.user?.name}`} className="w-5 h-5 rounded-full border border-white" alt="" />
                                            <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                                {prop.user?.name}
                                            </span>
                                            {topProposal?._id === prop._id && (
                                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" />
                                                    Top Rated
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            {prop.votes?.length || 0} Votes
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-3">
                                        {prop.text}
                                    </p>

                                    {prop.attachments?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {prop.attachments.map((url, idx) => (
                                                <a key={idx} href={api.defaults.baseURL + url} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                                                    <Paperclip className="w-2.5 h-2.5" />
                                                    Attachment {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1.5">
                                                {prop.votes?.slice(0, 3).map((v, i) => (
                                                    <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-slate-800 bg-slate-200" />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {prop.votes?.length || 0} Votes
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => voteMutation.mutate(prop._id)}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-all active:scale-90",
                                                prop.votes?.includes(user?._id)
                                                    ? "bg-indigo-500 text-white"
                                                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {conflict.status !== 'resolved' && (
                                        <button
                                            onClick={() => confirmMutation.mutate({ resId: prop._id, type: 'developer_proposal' })}
                                            disabled={confirmMutation.isLoading}
                                            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            Confirm Developer Selection
                                        </button>
                                    )}
                                    {conflict.pmResolution?.resolutionId === prop._id && (
                                        <div className="w-full flex items-center justify-center gap-2 text-emerald-600 py-2.5 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle className="w-3 h-3" />
                                            Active Resolution
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Resolution Strategies */}
                {conflict.resolutions?.length > 0 && (
                    <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Strategy Recommender</h3>
                        </div>
                        <div className="space-y-4">
                            {conflict.resolutions.map((res) => (
                                <div key={res._id} className={cn(
                                    "p-4 rounded-xl border transition-all group",
                                    res._id === highestVotedResId ? "border-indigo-500 bg-indigo-500/5" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
                                    conflict.pmResolution?.resolutionId === res._id ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500" : ""
                                )}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                                                {res.strategyType}
                                            </span>
                                            {res._id === highestVotedResId && (
                                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1">
                                                    <ThumbsUp className="w-2.5 h-2.5" />
                                                    Consensus
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => voteMutation.mutate(res._id)}
                                                className={cn(
                                                    "p-1.5 rounded-lg transition-all active:scale-90",
                                                    (voteResults?.userVotes?.[res._id])
                                                        ? "bg-indigo-500 text-white"
                                                        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <ThumbsUp className="w-3 h-3" />
                                            </button>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                {voteResults?.tally?.[res._id] || 0} Votes
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1">
                                        {res.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">
                                        {res.description}
                                    </p>
                                    {conflict.status !== 'resolved' && (
                                        <button
                                            onClick={() => confirmMutation.mutate({ resId: res._id, type: 'ai_resolution' })}
                                            disabled={confirmMutation.isLoading}
                                            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            Confirm AI Strategy
                                        </button>
                                    )}
                                    {conflict.pmResolution?.resolutionId === res._id && (
                                        <div className="w-full flex items-center justify-center gap-2 text-emerald-600 py-2.5 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle className="w-3 h-3" />
                                            Active Resolution
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Scorecard */}
                <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-indigo-500/20">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Impact Analysis</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                                <p className="text-xl font-black text-indigo-400">{conflict.feasibility?.timelineImpact || "0%"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                                <p className="text-xl font-black text-amber-400">{conflict.feasibility?.costImpact || "0%"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Proposal Modal */}
            {isProposing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsProposing(false)} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f1115] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Propose PM Solution</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail your technical directive</p>
                                </div>
                            </div>
                            <button onClick={() => setIsProposing(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSumbitProposal} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TECHNICAL CONTEXT & RATIONALE</label>
                                <textarea
                                    required
                                    className="w-full bg-slate-50 dark:bg-black/40 rounded-2xl border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-0 text-sm font-medium dark:text-white p-4 min-h-[150px] resize-none"
                                    placeholder="Explain how this proposal resolves the contradiction while maintaining project integrity..."
                                    value={proposalText}
                                    onChange={(e) => setProposalText(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SUPPORTING ASSETS (IMAGES, ARCH DIAGRAMS)</label>
                                    <button
                                        type="button"
                                        onClick={() => proposalFileInputRef.current.click()}
                                        className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Files
                                    </button>
                                    <input
                                        type="file"
                                        multiple
                                        ref={proposalFileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                                                    <Paperclip className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsProposing(false)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={proposalMutation.isLoading || !proposalText.trim()}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    Submit Proposal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

