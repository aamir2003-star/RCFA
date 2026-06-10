import { create } from "zustand";
import api from "../lib/api";

const useTeamStore = create((set) => ({
    members: [],
    stats: {
        totalDevs: 0,
        availableDevs: 0,
        inProductionCount: 0,
        highLoadDevs: 0,
        averageWorkload: 0
    },
    loading: false,
    error: null,

    fetchTeam: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/users/team');
            set({
                members: response.data.members || [],
                stats: response.data.stats || {
                    totalDevs: 0,
                    availableDevs: 0,
                    inProductionCount: 0,
                    highLoadDevs: 0,
                    averageWorkload: 0
                },
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));

export default useTeamStore;
