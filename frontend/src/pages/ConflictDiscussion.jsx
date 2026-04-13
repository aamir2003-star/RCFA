import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
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
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import { RESOLUTION_TYPES } from "../constants/conflicts";
import { cn, getAvatarUrl } from "../lib/utils";
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
    const [filePreviews, setFilePreviews] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [activeTab, setActiveTab] = useState("discussion"); // discussion or intelligence
    const fileInputRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);

        const previews = files.map(file => ({
            name: file.name,
            type: file.type,
            size: (file.size / 1024).toFixed(1) + ' KB',
            isImage: file.type.startsWith('image/')
        }));
        setFilePreviews(prev => [...prev, ...previews]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

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
        mutationFn: (formData) => api.post(`/conflicts/${id}/comment`, formData),
        onMutate: async (newFormData) => {
            await queryClient.cancelQueries({ queryKey: ["conflict", id] });
            const previousConflict = queryClient.getQueryData(["conflict", id]);

            if (previousConflict) {
                const optimisticComment = {
                    user: user,
                    message: newFormData.get("message"),
                    attachments: selectedFiles.map(file => ({
                        url: URL.createObjectURL(file),
                        isOptimistic: true,
                        isImage: file.type.startsWith('image/')
                    })),
                    timestamp: new Date().toISOString(),
                    isOptimistic: true
                };

                queryClient.setQueryData(["conflict", id], {
                    ...previousConflict,
                    discussions: [...(previousConflict.discussions || []), optimisticComment]
                });
            }

            setMessage("");
            setSelectedFiles([]);
            setFilePreviews([]);
            return { previousConflict };
        },
        onError: (err, newFormData, context) => {
            if (context?.previousConflict) {
                queryClient.setQueryData(["conflict", id], context.previousConflict);
            }
            toast.error("Transmission failed");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["conflict", id] });
        },
        onSuccess: () => {
            toast.success("Synchronized");
        }
    });

    const proposalMutation = useMutation({
        mutationFn: (formData) => api.post(`/conflicts/${id}/propose`, formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            setProposalText("");
            setSelectedFiles([]);
            setFilePreviews([]);
            setIsProposing(false);
            setActiveTab("intelligence");
            toast.success("Proposal live in community hub");
        }
    });

    const voteMutation = useMutation({
        mutationFn: (proposalId) => api.post(`/conflicts/proposals/${proposalId}/vote`),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            toast.success("Vote recorded");
        }
    });

    const confirmMutation = useMutation({
        mutationFn: ({ resId, type }) => api.patch(`/conflicts/${id}/confirm`, { resolutionId: resId, type }),
        onSuccess: () => {
            queryClient.invalidateQueries(["conflict", id]);
            toast.success("Architectural directive locked");
            navigate(-1);
        }
    });

    const getDateLabel = (date) => {
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return format(date, "MMMM d, yyyy");
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [conflict?.discussions]);

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
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto px-4 md:px-8 h-[calc(100dvh-100px)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Mobile Tab Switcher - Ultra Compressed */}
            <div className="flex lg:hidden p-0.5 bg-secondary/10 rounded-xl backdrop-blur-xl border border-border/10 shrink-0 mt-1">
                {["discussion", "intelligence", "propose"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-1 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab ? "bg-white dark:bg-zinc-800 shadow-lg text-foreground" : "text-muted hover:text-foreground"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={cn(
                "flex-1 flex flex-col h-full bg-secondary/5 rounded-[2rem] lg:rounded-[3rem] shadow-inset-subtle border border-border/5 overflow-hidden relative transition-all duration-500 md:mb-8",
                activeTab !== "discussion" && "hidden lg:flex"
            )}>
                {/* Header within Chat Column - Ultra Compressed on Mobile */}
                <div className="px-4 py-1.5 md:p-10 border-b border-border/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl z-30 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-0.5 md:gap-6">
                        <div className="space-y-0 md:space-y-3">
                            <button onClick={() => navigate(-1)} className="group hidden md:flex items-center gap-2 text-[7px] md:text-[8px] font-black text-muted uppercase tracking-[0.25em] hover:text-foreground transition-all">
                                <ArrowLeft className="w-2 h-2 group-hover:-translate-x-1 transition-transform" />
                                Registry
                            </button>
                            <h1 className="text-base md:text-4xl text-foreground font-display font-[300] tracking-tight leading-none">
                                {conflict.conflictType}
                            </h1>
                            <div className="flex items-center gap-1.5 md:gap-3">
                                <span className={cn(
                                    "px-1 py-0.5 rounded-full text-[6px] md:text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                    conflict.status === 'open' ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                )}>
                                    {conflict.status}
                                </span>
                                <div className="h-0.5 w-0.5 rounded-full bg-border" />
                                <span className="text-[7px] md:text-[9px] font-bold text-muted uppercase tracking-[0.3em] flex items-center gap-1">
                                    <ShieldAlert className="w-2.5 h-2.5" />
                                    Crit {conflict.severityScore}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsProposing(true)}
                            disabled={proposalMutation.isPending}
                            className="hidden lg:flex group relative overflow-hidden pill-button bg-foreground text-background text-[9px] font-black uppercase tracking-[0.25em] py-4 px-8 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                            <div className="relative flex items-center gap-2">
                                {proposalMutation.isPending ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                                {proposalMutation.isPending ? "Syncing..." : "Propose"}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Chat Stream: Scrollable Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-1 md:p-14 space-y-1.5 md:space-y-10 scroll-smooth"
                >
                    {/* Stream Watermark */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none overflow-hidden">
                        <span className="text-[15rem] font-display font-[900] rotate-12 whitespace-nowrap">SPECTRA</span>
                    </div>

                    {conflict.discussions?.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-4 border-dashed border-border/20">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Technical Stream</p>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col gap-10">
                        {conflict.discussions?.reduce((acc, msg, i) => {
                            const prevMsg = i > 0 ? conflict.discussions[i - 1] : null;
                            const msgDate = new Date(msg.timestamp);
                            const showDivider = !prevMsg || !isSameDay(new Date(prevMsg.timestamp), msgDate);

                            if (showDivider) {
                                acc.push(
                                    <div key={`divider-${i}`} className="flex items-center gap-6 my-8">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                                        <div className="px-6 py-2 rounded-full bg-secondary/30 backdrop-blur-md border border-border/10 shadow-sm shrink-0">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                                                {getDateLabel(msgDate)}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                                    </div>
                                );
                            }

                            const isMe = msg.user?._id === user?._id || msg.isOptimistic;
                            acc.push(
                                <div key={i} className={cn("flex w-full group animate-in fade-in slide-in-from-bottom-2 duration-500", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn("flex gap-4 max-w-[85%]", isMe ? "flex-row-reverse" : "flex-row")}>
                                        <div className="shrink-0 mt-auto mb-1">
                                            <div className="w-9 h-9 rounded-2xl bg-secondary border border-border/10 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-black uppercase">
                                                {msg.user?.avatar ? (
                                                    <img src={getAvatarUrl(msg.user.avatar)} alt={msg.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    msg.user?.name?.[0]
                                                )}
                                            </div>
                                        </div>

                                        <div className={cn("flex flex-col gap-0 md:gap-2", isMe ? "items-end" : "items-start")}>
                                            {!isMe && <span className="text-[6px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-3 mb-0 md:mb-1">{msg.user?.name}</span>}
                                            <div className={cn(
                                                "relative px-3 py-1 md:px-7 md:py-4 shadow-premium group/bubble transition-all",
                                                isMe
                                                    ? "bg-foreground text-background rounded-xl md:rounded-[2rem] rounded-br-lg shadow-black/10"
                                                    : "bg-white dark:bg-zinc-900 text-foreground rounded-xl md:rounded-[2rem] rounded-bl-lg border border-border/5"
                                            )}>
                                                <p className="text-[11px] md:text-[14px] leading-snug font-sans font-[450] tracking-tight">{msg.message}</p>

                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10 dark:border-white/5">
                                                        {msg.attachments.map((at, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    const url = at.url;
                                                                    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i);
                                                                    const isPdf = url.match(/\.pdf(\?|$)/i);
                                                                    setPreviewUrl(url);
                                                                    setPreviewType(isImage ? 'image' : isPdf ? 'pdf' : 'other');
                                                                }}
                                                                className={cn(
                                                                    "flex items-center gap-2 p-2.5 rounded-xl transition-all border shrink-0",
                                                                    isMe ? "bg-white/10 border-white/10 hover:bg-white/20" : "bg-secondary/10 border-border/10 hover:bg-secondary/20"
                                                                )}
                                                            >
                                                                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                                                                    {at.url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i) ? (
                                                                        <img src={at.url} className="w-full h-full object-cover" alt="asset" />
                                                                    ) : (
                                                                        <FileText className="w-3.5 h-3.5" />
                                                                    )}
                                                                </div>
                                                                <span className="text-[8px] font-black uppercase tracking-widest">{at.isOptimistic ? "Syncing..." : "Quick Look"}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className={cn(
                                                    "absolute -bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                                                    isMe ? "right-4" : "left-4"
                                                )}>
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && (
                                                        <div className="flex items-center">
                                                            <CheckCircle className={cn("w-3 h-3 text-emerald-500", msg.isOptimistic && "animate-pulse opacity-40")} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                            return acc;
                        }, [])}
                    </div>
                </div>

                {/* Sticky Input Bar at Bottom of Chat Column */}
                <div className="px-4 py-1 md:p-8 border-t border-border/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shrink-0">
                    <div className="relative group/input max-w-3xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] blur opacity-0 group-focus-within/input:opacity-100 transition duration-1000" />
                        <div className="relative bg-white dark:bg-zinc-900 rounded-xl md:rounded-[2.5rem] shadow-xl border border-border/20 p-1 md:p-2.5 md:pl-6 md:pr-3 flex items-center gap-2 md:gap-3">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-7 h-7 md:w-10 md:h-10 shrink-0 rounded-full bg-secondary/50 flex items-center justify-center text-muted hover:text-foreground hover:bg-secondary transition-all"
                            >
                                <Paperclip className={cn("w-3 h-3 md:w-4.5 md:h-4.5", selectedFiles.length > 0 && "text-indigo-500")} />
                                {selectedFiles.length > 0 && (
                                    <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-indigo-500 text-[6px] font-black text-white flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                        {selectedFiles.length}
                                    </div>
                                )}
                            </button>
                            <input
                                type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden"
                            />
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (message.trim() || selectedFiles.length > 0) {
                                            const fd = new FormData();
                                            fd.append("message", message);
                                            selectedFiles.forEach(file => fd.append("attachments", file));
                                            commentMutation.mutate(fd);
                                        }
                                    }
                                }}
                                placeholder="Transmit..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] md:text-[15px] py-1 md:py-3 placeholder:text-muted/40 font-sans"
                            />
                            <button
                                onClick={() => {
                                    if (commentMutation.isPending) return;
                                    const fd = new FormData();
                                    fd.append("message", message);
                                    selectedFiles.forEach(file => fd.append("attachments", file));
                                    commentMutation.mutate(fd);
                                }}
                                disabled={commentMutation.isPending || (!message.trim() && selectedFiles.length === 0)}
                                className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-40"
                            >
                                {commentMutation.isPending ? (
                                    <Activity className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Send className="w-3 h-3 ml-0.5" />
                                )}
                            </button>
                        </div>

                        {filePreviews.length > 0 && (
                            <div className="absolute -top-20 left-4 right-4 flex gap-2 overflow-x-auto p-3 bg-background/90 backdrop-blur-xl rounded-[1.5rem] border border-border/10 shadow-2xl animate-in slide-in-from-bottom-2 duration-400 no-scrollbar">
                                {filePreviews.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/10 shrink-0 shadow-sm animate-in zoom-in-95">
                                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest max-w-[100px] truncate">{f.name}</span>
                                        <button onClick={() => removeFile(i)} className="p-0.5 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Sticky Aside */}
            <aside className={cn(
                "w-full lg:w-96 h-full overflow-y-auto no-scrollbar pb-10 flex flex-col gap-8 shrink-0 transition-all duration-500",
                activeTab !== "intelligence" && "hidden lg:flex"
            )}>
                <div className="sticky top-0 space-y-8">
                    <div className="premium-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.25em]">AI Resolution</h3>
                        </div>
                        <div className="space-y-4">
                            {conflict.resolutions?.map((res) => (
                                <div key={res._id} className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{res.strategyType}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    </div>
                                    <h4 className="text-[14px] font-display font-[500] leading-tight">{res.title}</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{res.description}</p>

                                    {user?.role === 'PM' && conflict.status !== 'resolved' && (
                                        <button
                                            onClick={() => confirmMutation.mutate({ resId: res._id, type: RESOLUTION_TYPES.AI_RESOLUTION })}
                                            disabled={confirmMutation.isPending}
                                            className="w-full py-3 rounded-xl bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-pill hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {confirmMutation.isPending ? "Locking..." : "Confirm"}
                                        </button>
                                    )}
                                </div>
                            ))}
                            {(!conflict.resolutions || conflict.resolutions.length === 0) && (
                                <p className="text-[10px] text-muted text-center italic py-2">Computing strategies...</p>
                            )}
                        </div>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.25em]">Community Hub</h3>
                        </div>
                        <div className="space-y-4">
                            {sortedProposals.map((prop) => (
                                <div key={prop._id} className="p-5 rounded-3xl bg-secondary/20 border border-border/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold overflow-hidden">
                                                {prop.user?.avatar ? (
                                                    <img src={getAvatarUrl(prop.user.avatar)} alt={prop.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    prop.user?.name?.[0]
                                                )}
                                            </div>
                                            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{prop.user?.name}</span>
                                        </div>
                                        <button onClick={() => voteMutation.mutate(prop._id)} className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/50 transition-all">
                                            <ThumbsUp className={cn("w-3 h-3", prop.votes?.includes(user?._id) ? "text-indigo-600 fill-indigo-600" : "text-muted")} />
                                            <span className="text-[9px] font-bold">{prop.votes?.length || 0}</span>
                                        </button>
                                    </div>
                                    <p className="text-[12px] text-muted-foreground leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all">"{prop.text}"</p>

                                    {prop.attachments && prop.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {prop.attachments.map((at, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        const url = at.url;
                                                        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i);
                                                        const isPdf = url.match(/\.pdf(\?|$)/i);
                                                        setPreviewUrl(url);
                                                        setPreviewType(isImage ? 'image' : isPdf ? 'pdf' : 'other');
                                                    }}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/40 dark:bg-white/5 border border-border/10 hover:bg-white/60 transition-all shrink-0"
                                                >
                                                    <div className="w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center bg-white/20">
                                                        {at.url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i) ? (
                                                            <img src={at.url} className="w-full h-full object-cover" alt="spec" />
                                                        ) : (
                                                            <FileText className="w-2.5 h-2.5" />
                                                        )}
                                                    </div>
                                                    <span className="text-[7px] font-black uppercase tracking-widest whitespace-nowrap">Evidence</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {user?.role === 'PM' && conflict.status !== 'resolved' && (
                                        <button
                                            onClick={() => confirmMutation.mutate({ resId: prop._id, type: RESOLUTION_TYPES.DEVELOPER_PROPOSAL })}
                                            disabled={confirmMutation.isPending}
                                            className="w-full py-2.5 rounded-xl bg-secondary text-foreground text-[8px] font-bold uppercase tracking-widest border border-border/10 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                                        >
                                            Adopt
                                        </button>
                                    )}
                                </div>
                            ))}
                            {sortedProposals.length === 0 && (
                                <div className="py-6 text-center text-muted text-[9px] uppercase tracking-[0.2em]">Synchronizing Hub...</div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Propose Tab Content */}
            {activeTab === 'propose' && (
                <div className="lg:hidden flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] border border-border/10 overflow-y-auto p-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-display font-[300] italic">Architectural Proposal</h2>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Proposed Directive</label>
                                <textarea
                                    value={proposalText}
                                    onChange={(e) => setProposalText(e.target.value)}
                                    placeholder="Detail your technical solution..."
                                    className="w-full h-40 p-5 rounded-2xl bg-secondary/10 border-none focus:ring-1 focus:ring-foreground/10 text-[14px] font-sans resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Evidence ({selectedFiles.length})</label>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full py-3 border-2 border-dashed border-border/10 rounded-xl flex items-center justify-center gap-2 text-muted hover:border-black transition-all"
                                >
                                    <Paperclip className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Attach Specs</span>
                                </button>
                                {filePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {filePreviews.map((f, i) => (
                                            <div key={i} className="px-3 py-1.5 rounded-full bg-secondary/20 border border-border/10 text-[8px] font-black flex items-center gap-2">
                                                <span className="truncate max-w-[80px]">{f.name}</span>
                                                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const fd = new FormData();
                                fd.append("text", proposalText);
                                selectedFiles.forEach(file => fd.append("attachments", file));
                                proposalMutation.mutate(fd);
                            }}
                            disabled={proposalMutation.isPending || !proposalText.trim()}
                            className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.25em] shadow-xl disabled:opacity-50"
                        >
                            {proposalMutation.isPending ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                            {proposalMutation.isPending ? "Syncing..." : "Push to Stream"}
                        </button>
                    </div>
                </div>
            )}

            {previewUrl && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-6xl h-[85vh] bg-background rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-white/10">
                        <div className="p-6 border-b border-border/10 flex items-center justify-between bg-secondary/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Resource Preview</h3>
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-0.5">Encrypted Technical Asset</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                                    Open Original
                                </a>
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="p-2 hover:bg-secondary rounded-xl transition-all text-muted hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-black/20 flex items-center justify-center overflow-hidden">
                            {previewType === 'image' ? (
                                <div className="p-8 w-full h-full flex items-center justify-center">
                                    <img src={previewUrl} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5" alt="Preview" />
                                </div>
                            ) : previewType === 'pdf' ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    className="w-full h-full border-none"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="text-center space-y-6 max-w-sm p-12">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                                        <FileText className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Unsupported Preview</h4>
                                        <p className="text-[11px] text-muted leading-relaxed">This file format requires a native environment. Click below to download and view.</p>
                                    </div>
                                    <a
                                        href={previewUrl}
                                        download
                                        className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all w-full justify-center"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Download Asset
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

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

                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Supporting Evidence ({selectedFiles.length})</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-full py-4 border-2 border-dashed border-border/20 rounded-2xl flex items-center justify-center gap-2 text-muted hover:border-black dark:hover:border-white transition-all group"
                                    >
                                        <Paperclip className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Attach Specifications</span>
                                    </button>
                                </div>
                                {filePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {filePreviews.map((f, i) => (
                                            <div key={i} className="px-3 py-1.5 rounded-full bg-secondary/30 border border-border/10 text-[9px] font-bold flex items-center gap-2">
                                                <span className="truncate max-w-[100px]">{f.name}</span>
                                                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeFile(i)} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsProposing(false)} className="flex-1 pill-button bg-secondary text-foreground text-[11px] uppercase tracking-[0.2em] py-5">Cancel</button>
                                <button
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.append("text", proposalText);
                                        selectedFiles.forEach(file => fd.append("attachments", file));
                                        proposalMutation.mutate(fd);
                                    }}
                                    disabled={proposalMutation.isPending || !proposalText.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 pill-button bg-black text-white text-[11px] uppercase tracking-[0.2em] py-5 shadow-pill"
                                >
                                    {proposalMutation.isPending && <Activity className="w-4 h-4 animate-spin text-indigo-400" />}{proposalMutation.isPending ? "Publishing..." : "Push to Stream"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
