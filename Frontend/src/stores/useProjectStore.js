import { create } from "zustand";
import api from "../lib/api";

const useProjectStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    projectStats: null,
    loading: false,
    error: null,

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

    fetchProjectStats: async (projectId) => {
        try {
            const response = await api.get(`/projects/${projectId}/stats`);
            set({ projectStats: response.data });
        } catch (error) {
            console.error("Failed to fetch project stats:", error);
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

    clearCurrentProject: () => {
        set({ currentProject: null, projectStats: null });
    }
}));

export default useProjectStore;
