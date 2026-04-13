import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Send,
    Sparkles,
    MessageSquare,
    ShieldAlert,
    Activity,
    CheckCircle2,
    History,
    Vote,
    Zap,
    Paperclip,
    X,
    Plus,
    FileText,
    Download,
    Target,
    ThumbsUp,
    CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import api from "../lib/api";
import useAuthStore from "../stores/useAuthStore";
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
    const [activeTab, setActiveTab] = useState("discussion"); // discussion, intelligence, propose
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

    const { data: conflict, isLoading } = useQuery({
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
                        url: URL.createObjectURL(file), // Local blob for preview
                        isOptimistic: true,
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
            setActiveTab("intelligence"); // Auto-switch to see the new proposal
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

    const groupedComments = conflict.discussions?.reduce((acc, msg) => {
        const dateStr = format(new Date(msg.timestamp), 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(msg);
        return acc;
    }, {});

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto px-4 md:px-8 h-[calc(100dvh-100px)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Mobile Tab Switcher - Rigid Bottom/Top hybrid for App feel */}
            <div className="flex lg:hidden p-0.5 bg-secondary/10 rounded-xl backdrop-blur-xl border border-border/10 shrink-0 mt-1 relative">
                <motion.div
                    layoutId="activeTab"
                    className="absolute bg-white dark:bg-zinc-800 shadow-lg rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    style={{
                        width: 'calc(33.33% - 2px)',
                        height: 'calc(100% - 4px)',
                        left: activeTab === 'discussion' ? '2px' : activeTab === 'intelligence' ? '33.33%' : '66.66%'
                    }}
                />
                {["discussion", "intelligence", "propose"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-1 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors relative z-10",
                            activeTab === tab ? "text-foreground" : "text-muted hover:text-foreground"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'discussion' && (
                    <motion.div
                        key="discussion"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="flex-1 flex flex-col h-full bg-secondary/5 rounded-[2rem] lg:rounded-[3rem] shadow-inset-subtle border border-border/5 overflow-hidden relative"
                    >
                        {/* Header - Fixed */}
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
                                </div>
                            </div>
                        </div>

                        {/* Chat Stream - Flexible */}
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-1 md:p-14 space-y-10">
                            {Object.keys(groupedComments || {}).map((dateStr) => (
                                <div key={dateStr} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-border/20" />
                                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">{getDateLabel(new Date(dateStr))}</span>
                                        <div className="h-px flex-1 bg-border/20" />
                                    </div>
                                    {groupedComments[dateStr].map((msg, i) => {
                                        const isMe = msg.user?._id === user?._id;
                                        return (
                                            <motion.div
                                                key={msg._id || i}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ delay: i * 0.02, duration: 0.3 }}
                                                className={cn("flex items-end gap-1.5 md:gap-4", isMe ? "flex-row-reverse" : "flex-row")}
                                            >
                                                <div className="w-8 h-8 rounded-2xl bg-secondary border border-border/10 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-black">
                                                    {msg.user?.avatar ? <img src={getAvatarUrl(msg.user.avatar)} className="w-full h-full object-cover" /> : msg.user?.name?.[0]}
                                                </div>
                                                <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                                                    {!isMe && <span className="text-[8px] font-black text-muted uppercase tracking-widest ml-1">{msg.user?.name}</span>}
                                                    <div className={cn(
                                                        "relative px-4 py-2 md:px-6 md:py-3 shadow-sm group/bubble transition-all",
                                                        isMe ? "bg-foreground text-background rounded-2xl rounded-br-none font-medium" : "bg-white dark:bg-zinc-900 text-foreground rounded-2xl rounded-bl-none border border-border/5"
                                                    )}>
                                                        <p className="text-[13px] leading-relaxed">{msg.message}</p>
                                                        {msg.attachments?.map((at, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    const isImage = at.url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i);
                                                                    const isPdf = at.url.match(/\.pdf(\?|$)/i);
                                                                    setPreviewUrl(at.url);
                                                                    setPreviewType(isImage ? 'image' : isPdf ? 'pdf' : 'other');
                                                                }}
                                                                className="flex items-center gap-1 px-2 py-1 mt-2 rounded bg-white/10 hover:bg-white/20 transition-all border border-white/5"
                                                            >
                                                                <FileText className="w-3 h-3" />
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-white/80">Asset</span>
                                                            </button>
                                                        ))}
                                                        <span className={cn(
                                                            "absolute -bottom-5 text-[8px] font-medium whitespace-nowrap opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1.5",
                                                            isMe ? "right-0 text-muted" : "left-0 text-muted"
                                                        )}>
                                                            {format(new Date(msg.timestamp), 'HH:mm')}
                                                            {isMe && <CheckCircle2 className="w-2.5 h-2.5 text-indigo-500" />}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Input Area - Fixed */}
                        <div className="px-4 py-4 border-t border-border/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shrink-0">
                            <div className="relative max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-border/20 p-2 flex items-center gap-2">
                                <button onClick={() => fileInputRef.current.click()} className="p-2 text-muted hover:text-foreground"><Paperclip className="w-5 h-5" /></button>
                                <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
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
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-[14px]"
                                />
                                <button
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.append("message", message);
                                        selectedFiles.forEach(file => fd.append("attachments", file));
                                        commentMutation.mutate(fd);
                                    }}
                                    disabled={commentMutation.isPending || (!message.trim() && selectedFiles.length === 0)}
                                    className="p-2 rounded-xl bg-foreground text-background"
                                >
                                    {commentMutation.isPending ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebars / Other Tabs */}
            <aside className={cn(
                "w-full lg:w-96 shrink-0 transition-all duration-500",
                activeTab !== "intelligence" && "hidden lg:block"
            )}>
                <AnimatePresence mode="wait">
                    {(activeTab === 'intelligence' || window.innerWidth >= 1024) && (
                        <motion.div
                            key="intelligence"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 pb-32 lg:pb-0 h-full overflow-y-auto custom-scrollbar"
                        >
                            {/* AI Panel */}
                            <div className="premium-card p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        AI Resolutions
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-border/10 ml-4" />
                                </div>
                                <div className="space-y-4">
                                    {conflict.resolutions?.map((res) => (
                                        <motion.div layout key={res._id} className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 group">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{res.strategyType}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            </div>
                                            <h4 className="text-[14px] font-display font-[500] leading-tight">{res.title}</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">{res.description}</p>
                                            {user?.role === 'PM' && conflict.status !== 'resolved' && (
                                                <button
                                                    onClick={() => confirmMutation.mutate({ resId: res._id, type: RESOLUTION_TYPES.AI_RESOLUTION })}
                                                    disabled={confirmMutation.isPending}
                                                    className="w-full py-3 rounded-xl bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-pill hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {confirmMutation.isPending ? "Locking..." : "Confirm"}
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Community Panel */}
                            <div className="premium-card p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Zap className="w-3.5 h-3.5" />
                                        Community Hub
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-border/10 ml-4" />
                                </div>
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {sortedProposals.map((prop) => (
                                            <motion.div
                                                layout
                                                key={prop._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="p-5 rounded-3xl bg-secondary/20 border border-border/10 space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold overflow-hidden">
                                                            {prop.user?.avatar ? <img src={getAvatarUrl(prop.user.avatar)} className="w-full h-full object-cover" /> : prop.user?.name?.[0]}
                                                        </div>
                                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{prop.user?.name}</span>
                                                    </div>
                                                    <button onClick={() => voteMutation.mutate(prop._id)} className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/50 transition-all">
                                                        <ThumbsUp className={cn("w-3 h-3", prop.votes?.includes(user?._id) ? "text-indigo-600 fill-indigo-600" : "text-muted")} />
                                                        <span className="text-[9px] font-bold">{prop.votes?.length || 0}</span>
                                                    </button>
                                                </div>
                                                <p className="text-[12px] text-muted-foreground leading-relaxed italic">"{prop.text}"</p>
                                                {prop.attachments?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {prop.attachments.map((at, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    setPreviewUrl(at.url);
                                                                    setPreviewType(at.url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i) ? 'image' : 'pdf');
                                                                }}
                                                                className="px-2 py-1 rounded bg-secondary/30 border border-border/10 text-[7px] font-black uppercase flex items-center gap-1"
                                                            >
                                                                <FileText className="w-2.5 h-2.5" /> Spec
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
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </aside>

            {/* Mobile Propose Tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'propose' && (
                    <motion.div
                        key="propose"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="lg:hidden flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] border border-border/10 overflow-y-auto p-6 space-y-8"
                    >
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
                            className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.25em] shadow-xl disabled:opacity-50 mt-auto"
                        >
                            {proposalMutation.isPending ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                            {proposalMutation.isPending ? "Syncing..." : "Push to Stream"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Portal */}
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

            {/* Desktop Propose Dialog */}
            {isProposing && createPortal(
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
                                    <div className="flex flex-wrap gap-2 pt-2">
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
                                <button onClick={() => setIsProposing(false)} className="flex-1 px-8 py-5 rounded-3xl bg-secondary text-foreground text-[11px] font-black uppercase tracking-[0.2em]">Cancel</button>
                                <button
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.append("text", proposalText);
                                        selectedFiles.forEach(file => fd.append("attachments", file));
                                        proposalMutation.mutate(fd);
                                    }}
                                    disabled={proposalMutation.isPending || !proposalText.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 px-8 py-5 rounded-3xl bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-pill"
                                >
                                    {proposalMutation.isPending && <Activity className="w-4 h-4 animate-spin text-indigo-400" />}
                                    {proposalMutation.isPending ? "Publishing..." : "Push to Stream"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Desktop FAB for Proposing */}
            <button
                onClick={() => setIsProposing(true)}
                className="fixed bottom-12 right-12 w-16 h-16 rounded-full bg-foreground text-background shadow-2xl hidden lg:flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
            >
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
            </button>
        </div>
    );
}
