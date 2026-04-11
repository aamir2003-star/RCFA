import { create } from "zustand";
import api from "../lib/api";
import { getSocket } from "../lib/socket"; // Assuming socket client exists

const useConflictStore = create((set, get) => ({
    conflicts: [],
    loading: false,
    error: null,
    analysisProgress: {
        percent: 0,
        message: "",
        jobId: null,
        status: "idle" // idle, running, completed, error
    },

    fetchConflicts: async (projectId) => {
        set({ loading: true });
        try {
            const response = await api.get(`/conflicts/${projectId}`);
            set({
                conflicts: response.data.conflicts || [],
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAllPmConflicts: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/conflicts/pm/all');
            set({
                conflicts: response.data.conflicts || [],
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAllDevConflicts: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/conflicts/dev/all');
            set({
                conflicts: response.data.conflicts || [],
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    startAnalysis: async (projectId) => {
        set({ analysisProgress: { status: 'running', percent: 0, message: 'Initializing engine...' } });
        try {
            const response = await api.post(`/conflicts/analyze/${projectId}`);
            set((state) => ({
                analysisProgress: {
                    ...state.analysisProgress,
                    jobId: response.data.jobId,
                    status: 'running'
                }
            }));
            return { success: true, jobId: response.data.jobId };
        } catch (error) {
            set({ analysisProgress: { status: 'error', message: error.message } });
            return { success: false, message: error.message };
        }
    },

    setAnalysisProgress: (progress) => {
        set((state) => ({
            analysisProgress: { ...state.analysisProgress, ...progress }
        }));
    },

    resetAnalysisProgress: () => {
        set({
            analysisProgress: {
                percent: 0,
                message: "",
                jobId: null,
                status: "idle"
            }
        });
    },

    resolveConflict: async (conflictId) => {
        try {
            await api.patch(`/conflicts/${conflictId}/resolve`);
            set((state) => ({
                conflicts: state.conflicts.map((c) =>
                    c._id === conflictId ? { ...c, status: "resolved" } : c
                )
            }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Real-time listener setup
    subscribeToConflicts: (projectId) => {
        const socket = getSocket();
        if (!socket) return;

        socket.emit("join:project", projectId);

        socket.on("analysis:progress", (data) => {
            if (data.projectId === projectId) {
                set({
                    analysisProgress: {
                        percent: data.progress,
                        message: data.message,
                        jobId: data.jobId,
                        status: data.progress === 100 ? "completed" : "running"
                    }
                });
            }
        });

        socket.on("conflict:new", (data) => {
            if (data.projectId === projectId) {
                set((state) => ({
                    conflicts: state.conflicts.some(c => c._id === data.conflict._id)
                        ? state.conflicts
                        : [data.conflict, ...state.conflicts]
                }));
            }
        });

        socket.on("conflict:comment", (data) => {
            if (data.projectId === projectId) {
                // We don't have a full conflicts list of details in the store, 
                // but we can trigger a query invalidation if we have access to queryClient.
                // Alternatively, if this store is used for the detail view, we'd update it here.
                // For now, since we use React Query for details, we might need a different approach 
                // or just rely on the store to signal an update.
                set((state) => ({
                    conflicts: state.conflicts.map((c) =>
                        c._id === data.conflictId ? { ...c, lastComment: data.comment } : c
                    )
                }));
            }
        });

        socket.on("conflict:proposal", (data) => {
            if (data.projectId === projectId) {
                set((state) => ({
                    conflicts: state.conflicts.map((c) =>
                        c._id === data.conflictId ? { ...c, lastProposal: data.proposal } : c
                    )
                }));
            }
        });
    },

    unsubscribeFromConflicts: (projectId) => {
        const socket = getSocket();
        if (!socket) return;
        socket.off("analysis:progress");
        socket.off("conflict:new");
        socket.off("conflict:resolved");
        socket.off("conflict:comment");
        socket.off("conflict:proposal");
    },

    initSocket: (projectId, userId) => {
        if (!userId) return;
        const socket = getSocket();
        if (!socket) return;

        socket.emit("join:user", userId);
        if (projectId) {
            get().subscribeToConflicts(projectId);
        }

        return () => {
            if (projectId) {
                get().unsubscribeFromConflicts(projectId);
            }
        };
    }
}));

export default useConflictStore;
