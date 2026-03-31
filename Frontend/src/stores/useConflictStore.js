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

        socket.emit("join_project", projectId);

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
                    conflicts: [data.conflict, ...state.conflicts]
                }));
            }
        });

        socket.on("conflict:resolved", (data) => {
            if (data.projectId === projectId) {
                set((state) => ({
                    conflicts: state.conflicts.map((c) =>
                        c._id === data.conflictId ? { ...c, status: "resolved" } : c
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
    }
}));

export default useConflictStore;
