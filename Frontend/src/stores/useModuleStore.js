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
    }
}));

export default useModuleStore;
