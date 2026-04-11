import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { cn } from "../lib/utils";
import {
    ChevronRight,
    CheckCircle,
    MessageSquare,
    Zap,
    Layers,
    Clock,
    ShieldAlert,
    Paperclip,
    Plus,
    X,
    ArrowLeft,
    Terminal,
    Activity,
    ThumbsUp,
    Sparkles,
    Check,
    Download
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import {
    CONFLICT_STATUS_VARIANT,
    RESOLUTION_TYPES
} from "../constants/conflicts";
import { getSocket } from "../lib/socket";

export default function ConflictResolution() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [comment, setComment] = useState("");
    const [isProposing, setIsProposing] = useState(false);
    const [proposalText, setProposalText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const proposalFileInputRef = useRef(null);

    const { data: conflict, isLoading, error } = useQuery({
        queryKey: ["conflict", id],
        queryFn: async () => {
            const response = await api.get(`/conflicts/detail/${id}`);
            return response.data.conflict;
        },
        enabled: !!id
    });

    const { data: voteResults } = useQuery({
        queryKey: ["conflict-votes", id],
        queryFn: async () => {
            const response = await api.get(`/votes/${id}`);
            return response.data;
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

    const confirmMutation = useMutation({
        mutationFn: ({ resId, type }) => api.patch(`/conflicts/${id}/confirm`, { resolutionId: resId, type }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            toast.success("Architectural directive locked");
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
            queryClient.invalidateQueries(["conflict-votes", id]);
            toast.success("Vote recorded");
        }
    });

    if (isLoading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <Activity className="w-10 h-10 animate-spin text-muted/40" />
                <span className="font-display font-[300] text-2xl text-muted italic">Synchronizing Discussion Node...</span>
            </div>
        );
    }

    if (!conflict) return <div className="p-20 text-center">Conflict not found.</div>;

    const highestVotedResId = voteResults?.tally ? Object.entries(voteResults.tally).reduce((a, b) => b[1] > a[1] ? b : a, ["", 0])[0] : null;

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
                            <h1 className="text-5xl text-foreground font-display font-[300]">{conflict.conflictType}</h1>
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
                            Propose Directive
                        </button>
                    </div>
                </div>

                <div className="premium-card overflow-hidden">
                    <div className="p-10 border-b border-border/20 bg-secondary/10 flex items-center justify-between">
                        <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">Technical Collaboration Flow</h2>
                        {conflict.status === 'resolved' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    </div>

                    <div className="p-8 md:p-12 space-y-12 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {conflict.discussions?.map((msg, i) => (
                            <div key={i} className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-[20px] bg-secondary flex items-center justify-center text-muted font-display font-[500] text-xl shrink-0 border border-border/10 shadow-inset-subtle">
                                    {msg.user?.name?.[0]}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-foreground uppercase tracking-widest">{msg.user?.name}</span>
                                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-muted-foreground text-[16px] leading-relaxed tracking-wide">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 md:p-12 pt-0 border-t border-border/10">
                        <div className="mt-8 premium-card p-6 bg-secondary/5 border-dashed">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add architectural perspective..."
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
                                        fd.append("message", comment);
                                        commentMutation.mutate(fd);
                                    }}
                                    disabled={!comment.trim()}
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
                        <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.25em]">Strategies</h3>
                    </div>
                    <div className="space-y-6">
                        {conflict.resolutions?.map((res, i) => (
                            <div key={res._id} className={cn(
                                "p-6 rounded-3xl transition-all border group",
                                res._id === highestVotedResId ? "border-indigo-500/30 bg-indigo-500/5 shadow-premium" : "bg-secondary/20 border-border/10"
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{res.strategyType}</span>
                                    <button onClick={() => voteMutation.mutate(res._id)} className="p-2 rounded-xl hover:bg-secondary transition-all">
                                        <ThumbsUp className={cn("w-4 h-4", voteResults?.userVotes?.[res._id] ? "text-indigo-600 fill-indigo-600" : "text-muted")} />
                                    </button>
                                </div>
                                <p className="text-[15px] font-display font-[500] mb-2">{res.title}</p>
                                <p className="text-[12px] text-muted-foreground mb-6 leading-relaxed">{res.description}</p>
                                {conflict.status !== 'resolved' && (
                                    <button
                                        onClick={() => confirmMutation.mutate({ resId: res._id, type: RESOLUTION_TYPES.AI_RESOLUTION })}
                                        className="w-full py-4 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-widest shadow-pill hover:scale-[1.02] transition-all"
                                    >
                                        Confirm Selection
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
}
