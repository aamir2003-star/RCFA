import { create } from "zustand";
import api from "../lib/api";

const useModuleStore = create((set, get) => ({
    modules: [],
    loading: false,
    error: null,

    fetchModules: async (projectId) => {
        set({ loading: true });
        try {
            const response = await api.get(`/modules`, { params: { projectId } });
            set({ modules: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createModule: async (moduleData) => {
        set({ loading: true });
        try {
            const response = await api.post("/modules", moduleData);
            set((state) => ({
                modules: [...state.modules, response.data],
                loading: false
            }));
            return { success: true, module: response.data };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    assignDeveloper: async (moduleId, developerId) => {
        try {
            const response = await api.patch(`/modules/${moduleId}/assign`, { developerId });
            set((state) => ({
                modules: state.modules.map((m) => m._id === moduleId ? response.data : m)
            }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },
    updateModuleStatus: async (moduleId, status) => {
        try {
            const response = await api.patch(`/modules/${moduleId}/status`, { status });
            set((state) => ({
                modules: state.modules.map((m) => m._id === moduleId ? response.data : m)
            }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    deleteModule: async (moduleId) => {
        set({ loading: true });
        try {
            await api.delete(`/modules/${moduleId}`);
            set((state) => ({
                modules: state.modules.filter((m) => m._id !== moduleId),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error.message };
        }
    },

    fetchProjectDevelopers: async (projectId) => {
        try {
            const response = await api.get(`/modules/project/${projectId}/developers`);
            return response.data;
        } catch (error) {
            console.error("Error fetching developers:", error);
            return [];
        }
    },

    getAssignmentSuggestions: async (moduleId) => {
        try {
            const response = await api.get(`/modules/${moduleId}/assignment-suggestions`);
            return response.data;
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return null;
        }
    },

    fetchMyModules: async (userId) => {
        set({ loading: true });
        try {
            const response = await api.get(`/modules`, { params: { assignedTo: userId } });
            set({ modules: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    generateModuleSuggestion: async (requirementIds) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(`/modules/suggest`, { requirementIds });
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to generate suggestion"
            });
            return null;
        }
    }
}));

export default useModuleStore;
