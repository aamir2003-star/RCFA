import { create } from "zustand";
import api from "../lib/api";

const useTeamStore = create((set) => ({
    members: [],
    totalMembers: 0,
    totalProjects: 0,
    loading: false,
    error: null,

    fetchTeam: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/users/team');
            set({
                members: response.data.members || [],
                totalMembers: response.data.totalMembers || 0,
                totalProjects: response.data.totalProjects || 0,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));

export default useTeamStore;
