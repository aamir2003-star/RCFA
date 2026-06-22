import { create } from "zustand";
import api from "../lib/api";

const useProjectStore = create((set, get) => ({
    projects: [],
    requirements: [],
    currentProject: null,
    projectStats: null,
    bdeStats: null,
    pmStats: null,
    pmActivity: [],
    conflicts: [],
    loading: false,
    error: null,

    pagination: {
        page: 1,
        pages: 1,
        total: 0,
        hasNext: false
    },

    fetchRequirements: async (projectId, page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await api.get(`/requirements?projectId=${projectId}&page=${page}&limit=${limit}`);
            // The backend returns { requirements: [], pagination: {} }
            const { requirements, pagination } = response.data;
            set({
                requirements: Array.isArray(requirements) ? requirements : (response.data.requirements || []),
                pagination: pagination || get().pagination,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addRequirement: async (requirementData) => {
        set({ loading: true });
        try {
            const response = await api.post("/requirements", requirementData);
            const newReq = response.data;
            set((state) => ({
                requirements: [newReq, ...state.requirements],
                loading: false
            }));
            return { success: true, requirement: newReq };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },

    updateRequirement: async (requirementId, requirementData) => {
        set({ loading: true });
        try {
            const response = await api.patch(`/requirements/${requirementId}`, requirementData);
            const updatedReq = response.data;
            set((state) => ({
                requirements: state.requirements.map((r) => r._id === requirementId ? updatedReq : r),
                loading: false
            }));
            return { success: true, requirement: updatedReq };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },

    deleteRequirement: async (requirementId) => {
        set({ loading: true });
        try {
            await api.delete(`/requirements/${requirementId}`);
            set((state) => ({
                requirements: state.requirements.filter((r) => r._id !== requirementId),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },

    fetchProjects: async () => {
        set({ loading: true });
        try {
            const response = await api.get("/projects");
            // Handle the paginated response format { projects: [], pagination: {} }
            const projects = response.data.projects || response.data;
            set({ projects, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    setCurrentProject: async (project) => {
        set({ currentProject: project });
        if (project?._id) {
            get().fetchProjectStats(project._id);
        }
    },

    fetchProjectStats: async (projectId, timeframe = 'WEEKLY') => {
        try {
            const response = await api.get(`/projects/${projectId}/stats?timeframe=${timeframe}`);
            set({ projectStats: response.data, error: null });
        } catch (error) {
            console.error("Failed to fetch project stats:", error);
            set({ error: error.response?.data?.message || error.message });
        }
    },

    fetchBdeStats: async () => {
        try {
            const response = await api.get("/projects/bde/stats");
            set({ bdeStats: response.data, error: null });
        } catch (error) {
            console.error("Failed to fetch BDE stats:", error);
            set({ error: error.response?.data?.message || error.message });
        }
    },

    fetchPmStats: async () => {
        try {
            const response = await api.get("/projects/pm/stats");
            set({ pmStats: response.data, error: null });
        } catch (error) {
            console.error("Failed to fetch PM stats:", error);
            set({ error: error.response?.data?.message || error.message });
        }
    },

    fetchPmActivity: async (timeframe = 'all') => {
        try {
            const response = await api.get(`/projects/pm/activity?timeframe=${timeframe}`);
            set({ pmActivity: response.data.activities || [] });
        } catch (error) {
            console.error("Failed to fetch PM activity:", error);
        }
    },

    createProject: async (projectData) => {
        set({ loading: true });
        try {
            const response = await api.post("/projects", projectData);
            const newProject = response.data.project || response.data;
            set((state) => ({
                projects: [newProject, ...state.projects],
                loading: false
            }));
            get().fetchBdeStats(); // Refresh stats after creation
            return { success: true, project: newProject };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    uploadRequirementsCSV: async (projectId, file) => {
        set({ loading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("projectId", projectId);

            const response = await api.post("/requirements/upload-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            set({ loading: false });
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    generateAiRequirements: async (projectId, teams) => {
        set({ loading: true });
        try {
            const response = await api.post("/requirements/generate", { projectId, teams });
            const { requirements } = response.data;

            // Add new requirements to the state
            set((state) => ({
                requirements: [...requirements, ...state.requirements],
                loading: false
            }));

            return { success: true, count: requirements.length };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    approveRequirement: async (requirementId) => {
        set({ loading: true });
        try {
            const response = await api.patch(`/requirements/${requirementId}`, { status: 'approved' });
            const updatedReq = response.data;

            set((state) => ({
                requirements: state.requirements.map(r => r._id === requirementId ? updatedReq : r),
                loading: false
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    deleteProject: async (projectId) => {
        set({ loading: true });
        try {
            await api.delete(`/projects/${projectId}`);
            set((state) => ({
                projects: state.projects.filter((p) => p._id !== projectId),
                loading: false
            }));
            get().fetchBdeStats(); // Refresh stats after deletion
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, message: error?.response?.data?.message || error.message };
        }
    },

    clearCurrentProject: () => {
        set({ currentProject: null, projectStats: null });
    },
    clearError: () => {
        set({ error: null });
    },

    // Sync requirement moduleId locally for performance and reactivity
    syncRequirementsAfterModuleDelete: (moduleId) => {
        set((state) => ({
            requirements: state.requirements.map(r =>
                // Handle both object and string ID comparisons
                (r.moduleId === moduleId || r.moduleId?._id === moduleId)
                    ? { ...r, moduleId: null }
                    : r
            )
        }));
    },

    syncRequirementsAfterModuleCreate: (requirementIds, moduleId) => {
        set((state) => ({
            requirements: state.requirements.map(r =>
                requirementIds.includes(r._id)
                    ? { ...r, moduleId }
                    : r
            )
        }));
    },

    fetchConflicts: async (projectId) => {
        try {
            const response = await api.get(`/conflicts/${projectId}`);
            const fetchedConflicts = response.data.conflicts || response.data;
            set((state) => ({
                conflicts: [...state.conflicts.filter(c => c.projectId !== projectId), ...fetchedConflicts]
            }));
        } catch (error) {
            console.error("Failed to fetch conflicts:", error);
        }
    }
}));

export default useProjectStore;
