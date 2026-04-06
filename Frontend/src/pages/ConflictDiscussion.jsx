import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ChevronRight,
    MessageSquare,
    Zap,
    ThumbsUp,
    Send,
    FileText,
    ShieldAlert,
    Sparkles,
    AlertTriangle,
    ArrowLeft,
    Plus,
    Image as ImageIcon,
    Paperclip,
    X,
    Trophy,
    User,
    Users,
    CheckCircle2
} from "lucide-react";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";
import { getSocket } from "../lib/socket";

export default function ConflictDiscussion() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [message, setMessage] = useState("");
    const [isProposing, setIsProposing] = useState(false);
    const [proposalText, setProposalText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const proposalFileInputRef = useRef(null);

    // Fetch Conflict Details
    const { data: conflictData, isLoading, error } = useQuery({
        queryKey: ["conflict", id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/detail/${id}`);
            return response.data.conflict;
        },
        enabled: !!id
    });

    // Mutations
    const commentMutation = useMutation({
        mutationFn: (formData) => api.post(`/conflicts/${id}/comment`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            setMessage("");
            setSelectedFiles([]);
            toast.success("Comment sent");
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

    // Real-time Socket Listeners
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !conflictData?.projectId) return;

        const projectId = conflictData.projectId;
        socket.emit("join:project", projectId);

        const handleNewComment = (data) => {
            if (data.conflictId === id) {
                queryClient.invalidateQueries(["conflict", id]);
            }
        };

        const handleNewProposal = (data) => {
            if (data.conflictId === id) {
                queryClient.invalidateQueries(["conflict", id]);
            }
        };

        socket.on("conflict:comment", handleNewComment);
        socket.on("conflict:proposal", handleNewProposal);

        return () => {
            socket.off("conflict:comment", handleNewComment);
            socket.off("conflict:proposal", handleNewProposal);
        };
    }, [id, conflictData?.projectId, queryClient]);

    const handleSendComment = useCallback((e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!message.trim() && selectedFiles.length === 0) return;

        const formData = new FormData();
        formData.append("message", message);
        selectedFiles.forEach(file => formData.append("attachments", file));

        commentMutation.mutate(formData);
    }, [message, selectedFiles, commentMutation, id]);

    const handleSubmitProposal = useCallback((e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!proposalText.trim()) return;

        const formData = new FormData();
        formData.append("text", proposalText);
        selectedFiles.forEach(file => formData.append("attachments", file));

        proposalMutation.mutate(formData);
    }, [proposalText, selectedFiles, proposalMutation, id]);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    }, []);

    const removeFile = useCallback((index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleVote = useCallback((proposalId) => {
        voteMutation.mutate(proposalId);
    }, [voteMutation]);

    // Logic for Top Proposals - Memoized
    const sortedProposals = useMemo(() => {
        return [...(conflictData?.proposals || [])].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));
    }, [conflictData?.proposals]);

    const topProposalIds = useMemo(() => {
        return sortedProposals.slice(0, 2).map(p => p._id);
    }, [sortedProposals]);

    const participantCount = useMemo(() => {
        return [...new Set(conflictData?.discussions?.map(d => d.user?._id))].filter(Boolean).length;
    }, [conflictData?.discussions]);

    if (!id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 bg-white/40 dark:bg-[#0f1115]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-slate-800 shadow-xl">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
                    <MessageSquare className="w-10 h-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Select a Conflict</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Please select a conflict from the registry to join the technical discussion.</p>
                </div>
                <Link
                    to="/dev/conflicts"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Registry
                </Link>
            </div>
        );
    }

    if (isLoading) return <div className="p-10 text-center font-black animate-pulse text-indigo-500">Retrieving Conflict Intel...</div>;
    if (error || !conflictData) return <div className="p-10 text-center text-red-500 font-bold">Conflict data unavailable.</div>;

    return (
        <div className="flex flex-col lg:h-[calc(100vh-120px)] lg:flex-row gap-8">
            {/* Main Discussion Area */}
            <div className="flex-1 flex flex-col bg-white/40 dark:bg-[#0f1115]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px] lg:min-h-0">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/dev/conflicts" className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-500 transition-all group">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-500/10 transition-all">
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </div>
                            <span className="hidden sm:inline">Back to Registry</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">9 ACTIVE</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] shrink-0">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1 truncate">
                                        {conflictData.conflictType}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">REAL-TIME COLLABORATIVE RESOLUTION</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsProposing(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all text-[11px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Zap className="w-4 h-4" />
                            Propose Solution
                        </button>
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar scroll-smooth">
                    {/* Conflict Explanation Card */}
                    <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <Trophy className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Objective Overview</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {conflictData.explanation || "No automated explanation provided. Requires manual triage."}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/20 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">REQ-A</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{conflictData.requirementA?.title}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/20 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">REQ-B</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{conflictData.requirementB?.title}</p>
                            </div>
                        </div>
                    </div>

                    {conflictData.discussions?.map((msg, i) => (
                        <DiscussionMessage key={i} msg={msg} />
                    ))}
                    <div className="h-4" /> {/* Spacer */}
                </div>

                {/* Reply Area */}
                <div className="p-6 bg-white/20 dark:bg-white/[0.02] border-t border-slate-200/50 dark:border-slate-800/50">
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
                    <form onSubmit={handleSendComment} className="flex items-end gap-4">
                        <div className="flex-1 bg-white/60 dark:bg-black/40 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-indigo-500/50 transition-all p-2 flex flex-col gap-2">
                            <textarea
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium dark:text-white px-4 pt-3 resize-none placeholder-slate-400"
                                placeholder="Add your technical perspective..."
                                rows="3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <div className="flex items-center justify-between px-2 pb-1">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
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
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={commentMutation.isLoading || (!message.trim() && selectedFiles.length === 0)}
                                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 text-[10px] uppercase tracking-widest"
                                >
                                    <Send className="w-4 h-4" />
                                    Post Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sidebar: Resolution Proposals */}
            <aside className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8 pb-10 lg:pb-0">
                {/* Proposed Resolutions Gallery */}
                <div className="bg-white/40 dark:bg-[#0f1115]/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] space-y-8 flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Candidates</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            {conflictData.proposals?.length || 0} IDEAS
                        </span>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {conflictData.proposals?.length > 0 ? (
                            sortedProposals.map((prop) => (
                                <ProposalCard
                                    key={prop._id}
                                    prop={prop}
                                    isTopRated={topProposalIds.includes(prop._id)}
                                    user={user}
                                    onVote={handleVote}
                                    isVoting={voteMutation.isLoading}
                                />
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400/50 py-10">
                                <Sparkles className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-sm font-bold italic">Gather consensus early.</p>
                                <p className="text-[10px] uppercase font-black tracking-widest">NO PROPOSALS YET</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scorecard / Stats */}
                <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-xl">
                                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-100">Conflict Scorecard</h3>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PROJECT PHASES</p>
                            <p className="text-[10px] font-bold text-indigo-400">DESIGN & ARCH</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                        <div className="bg-[#1e2532] p-5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Severity</p>
                            <div className="flex items-end gap-1.5">
                                <p className="text-3xl font-black text-red-500 leading-none">{conflictData.severityScore}</p>
                                <p className="text-[10px] font-bold text-slate-500 pb-0.5">/ 10</p>
                            </div>
                        </div>
                        <div className="bg-[#1e2532] p-5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Participants</p>
                            <div className="flex items-end gap-1.5">
                                <p className="text-3xl font-black text-white leading-none">
                                    {participantCount}
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 pb-0.5">DEVS</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Resolution Consensus</span>
                            <span className="text-indigo-400">{Math.round((sortedProposals[0]?.votes?.length || 0) / (conflictData.proposals?.length || 1) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-indigo-600 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                                style={{ width: `${Math.min(100, (sortedProposals[0]?.votes?.length || 0) * 20)}%` }}
                            />
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
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Propose Resolution</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail your technical solution</p>
                                </div>
                            </div>
                            <button onClick={() => setIsProposing(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitProposal} className="p-8 space-y-6">
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
                                        onChange={(e) => handleFileChange(e)}
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

const DiscussionMessage = React.memo(({ msg }) => {
    return (
        <div className="flex gap-5 group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative shrink-0">
                <img src={msg.user?.avatar || `https://ui-avatars.com/api/?name=${msg.user?.name}&background=6366f1&color=fff`} alt={msg.user?.name} className="size-12 rounded-[1.25rem] object-cover ring-2 ring-white/10 shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{msg.user?.name}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {msg.user?.role || "Developer"}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="bg-white/60 dark:bg-white/[0.03] p-5 rounded-[1.5rem] rounded-tl-none border border-white/20 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm group-hover:shadow-md transition-all">
                    {msg.message}

                    {msg.attachments?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {msg.attachments.map((url, idx) => (
                                <a
                                    key={idx}
                                    href={api.defaults.baseURL + url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-all group/file"
                                >
                                    {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img src={api.defaults.baseURL + url} alt="attachment" className="size-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <FileText className="w-6 h-6" />
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
    );
});

const ProposalCard = React.memo(({ prop, isTopRated, user, onVote, isVoting }) => {
    return (
        <div className={cn(
            "p-6 rounded-[2rem] border transition-all animate-in slide-in-from-right-4 duration-500 group",
            isTopRated
                ? "bg-indigo-600 shadow-[0_20px_40px_rgba(99,102,241,0.15)] border-indigo-500/50"
                : "bg-white/40 dark:bg-white/[0.02] border-slate-200 dark:border-slate-800 hover:border-indigo-500/30"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img src={prop.user?.avatar || `https://ui-avatars.com/api/?name=${prop.user?.name}`} className="size-8 rounded-lg outline outline-2 outline-white/20" alt="avatar" />
                    <div>
                        <p className={cn("text-[10px] font-black tracking-tight", isTopRated ? "text-white" : "text-slate-900 dark:text-white")}>{prop.user?.name}</p>
                        <p className={cn("text-[8px] font-bold uppercase tracking-widest", isTopRated ? "text-indigo-200" : "text-slate-400")}>{new Date(prop.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                {isTopRated && (
                    <div className="px-2 py-0.5 rounded-lg bg-white/20 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Top Rated
                    </div>
                )}
            </div>

            <p className={cn("text-[11px] font-medium leading-relaxed mb-4", isTopRated ? "text-white/90" : "text-slate-600 dark:text-slate-400")}>
                {prop.text}
            </p>

            {prop.attachments?.length > 0 && (
                <div className="mb-4 flex gap-2">
                    {prop.attachments.slice(0, 3).map((url, i) => (
                        <div key={i} className="size-10 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center text-white/50">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                    ))}
                    {prop.attachments.length > 3 && (
                        <div className="size-10 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/50">
                            +{prop.attachments.length - 3}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <div className="flex -space-x-1.5">
                        {prop.votes?.slice(0, 3).map((v, i) => (
                            <div key={i} className="w-5 h-5 rounded-full border border-white/20 bg-slate-300 overflow-hidden" />
                        ))}
                    </div>
                    {prop.votes?.length > 0 && (
                        <span className={cn("text-[9px] font-bold", isTopRated ? "text-white/70" : "text-slate-400")}>
                            {prop.votes.length} Votes
                        </span>
                    )}
                </div>
                <button
                    onClick={() => onVote(prop._id)}
                    disabled={isVoting}
                    className={cn(
                        "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center gap-1.5 shadow-lg",
                        prop.votes?.includes(user?._id)
                            ? "bg-white text-indigo-600"
                            : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white"
                    )}
                >
                    <ThumbsUp className={cn("w-3 h-3", prop.votes?.includes(user?._id) ? "fill-indigo-600" : "")} />
                    {prop.votes?.includes(user?._id) ? "LIKED" : "VOTE"}
                </button>
            </div>
        </div>
    );
});
