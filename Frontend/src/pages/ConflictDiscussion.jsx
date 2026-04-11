import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
    X,
    Trophy,
    Clock,
    Paperclip,
    Activity,
    CheckCircle
} from "lucide-react";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";
import { getSocket } from "../lib/socket";

export default function ConflictDiscussion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [message, setMessage] = useState("");
    const [isProposing, setIsProposing] = useState(false);
    const [proposalText, setProposalText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const { data: conflict, isLoading, error } = useQuery({
        queryKey: ["conflict", id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/detail/${id}`);
            return response.data.conflict;
        },
        enabled: !!id
    });

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !conflict?.projectId) return;
        socket.emit("join:project", conflict.projectId);
        const handleRefresh = (data) => {
            if (data.conflictId === id) queryClient.invalidateQueries(["conflict", id]);
        };
        socket.on("conflict:comment", handleRefresh);
        socket.on("conflict:proposal", handleRefresh);
        return () => {
            socket.off("conflict:comment", handleRefresh);
            socket.off("conflict:proposal", handleRefresh);
        };
    }, [id, conflict?.projectId, queryClient]);

    const commentMutation = useMutation({
        mutationFn: (formData) => api.post(`/conflicts/${id}/comment`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            setMessage("");
            setSelectedFiles([]);
            toast.success("Synchronized");
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
            toast.success("Vote recorded");
        }
    });

    if (isLoading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <Activity className="w-10 h-10 animate-spin text-muted/40" />
                <span className="font-display font-[300] text-2xl text-muted italic">Calibrating Discussion Node...</span>
            </div>
        );
    }

    if (!conflict) return <div className="p-20 text-center">Conflict not found.</div>;

    const sortedProposals = [...(conflict.proposals || [])].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));

    return (
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto pb-24 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex-1 space-y-12">
                <div className="space-y-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-[0.2em] hover:text-foreground transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Registry
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-3">
                            <h1 className="text-5xl text-foreground font-display font-[300] tracking-tight">{conflict.conflictType}</h1>
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border",
                                    conflict.status === 'open' ? "bg-red-500/5 text-red-600 border-red-500/10" : "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                                )}>
                                    {conflict.status}
                                </span>
                                <span className="text-[11px] font-bold text-muted uppercase tracking-[0.25em]">Severity {conflict.severityScore}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsProposing(true)} className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.2em] py-5 px-10 shadow-pill">
                            <Zap className="w-4 h-4 mr-2 inline" />
                            Propose Solution
                        </button>
                    </div>
                </div>

                <div className="premium-card overflow-hidden">
                    <div className="p-10 border-b border-border/20 bg-secondary/10">
                        <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">Developer Stream</h2>
                    </div>

                    <div className="p-8 md:p-12 space-y-12 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {conflict.discussions?.map((msg, i) => (
                            <div key={i} className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-[20px] bg-secondary flex items-center justify-center text-muted font-display font-[500] text-xl shrink-0 border border-border/10">
                                    {msg.user?.name?.[0]}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-foreground uppercase tracking-widest">{msg.user?.name}</span>
                                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-[16px] leading-relaxed tracking-wide">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 md:p-12 pt-0 border-t border-border/10">
                        <div className="mt-8 premium-card p-6 bg-secondary/5 border-dashed">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Add technical rationale..."
                                className="w-full bg-transparent border-none focus:ring-0 text-[16px] min-h-[100px] resize-none"
                            />
                            <div className="flex items-center justify-between pt-6 mt-4 border-t border-border/10">
                                <button onClick={() => fileInputRef.current.click()} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted hover:text-foreground hover:shadow-premium transition-all">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input type="file" multiple ref={fileInputRef} className="hidden" />
                                <button
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.append("message", message);
                                        commentMutation.mutate(fd);
                                    }}
                                    disabled={!message.trim()}
                                    className="pill-button bg-black text-white text-[11px] uppercase tracking-[0.2em] py-4 px-10 shadow-pill"
                                >
                                    Synchronize
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <aside className="w-full lg:w-96 space-y-12">
                <div className="premium-card p-10 space-y-8">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.25em]">Community Proposals</h3>
                    </div>
                    <div className="space-y-6">
                        {sortedProposals.map((prop) => (
                            <div key={prop._id} className="p-6 rounded-3xl bg-secondary/20 border border-border/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">{prop.user?.name?.[0]}</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{prop.user?.name}</span>
                                    </div>
                                    <button onClick={() => voteMutation.mutate(prop._id)} className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/50 transition-all">
                                        <ThumbsUp className={cn("w-3.5 h-3.5", prop.votes?.includes(user?._id) ? "text-indigo-600 fill-indigo-600" : "text-muted")} />
                                        <span className="text-[10px] font-bold">{prop.votes?.length || 0}</span>
                                    </button>
                                </div>
                                <p className="text-[13px] text-muted-foreground leading-relaxed italic">"{prop.text}"</p>
                            </div>
                        ))}
                        {sortedProposals.length === 0 && (
                            <div className="py-10 text-center text-muted text-[11px] uppercase tracking-[0.2em]">No proposals synchronized yet</div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Proposal Modal */}
            {isProposing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="premium-card w-full max-w-2xl bg-white overflow-hidden shadow-3xl">
                        <div className="p-10 border-b border-border/20 flex items-center justify-between">
                            <h2 className="text-3xl font-display font-[300] italic">Architectural Proposal</h2>
                            <button onClick={() => setIsProposing(false)} className="w-12 h-12 rounded-full hover:bg-secondary flex items-center justify-center text-muted transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Proposed Directive</label>
                                <textarea
                                    value={proposalText}
                                    onChange={(e) => setProposalText(e.target.value)}
                                    placeholder="Detail your solution..."
                                    className="w-full h-48 p-6 rounded-[30px] bg-secondary/20 border-none focus:ring-1 focus:ring-foreground/10 text-[16px] font-sans resize-none"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsProposing(false)} className="flex-1 pill-button bg-secondary text-foreground text-[11px] uppercase tracking-[0.2em] py-5">Cancel</button>
                                <button
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.append("text", proposalText);
                                        proposalMutation.mutate(fd);
                                    }}
                                    disabled={!proposalText.trim()}
                                    className="flex-1 pill-button bg-black text-white text-[11px] uppercase tracking-[0.2em] py-5 shadow-pill"
                                >
                                    Push to Stream
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
