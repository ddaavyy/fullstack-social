import { create } from 'zustand';

import api from '../api/axios';

const useProfileStore = create((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,
    fetched: false,

    setProfile: (profile) => set({ profile }),

    clearProfile: () => set({ profile: null, error: null, fetched: false }),

    fetchProfile: async () => {
        if (get().isLoading) return get().profile;
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get('profile/');
            set({ profile: data, fetched: true });
            return data;
        } catch (e) {
            set({
                error: e?.response?.data || e.message || 'Erro ao carregar perfil',
                fetched: true,
            });
            throw e;
        } finally {
            set({ isLoading: false });
        }
    },
    ensureProfile: async () => {
        const { profile, fetched } = get();
        if (profile || fetched) return profile;
        return await get().fetchProfile();
    },
}));

export default useProfileStore;

export const useProfile = () => useProfileStore((s) => s.profile);
export const useSetProfile = () => useProfileStore((s) => s.setProfile);
export const useClearProfile = () => useProfileStore((s) => s.clearProfile);
export const useFetchProfile = () => useProfileStore((s) => s.fetchProfile);
export const useEnsureProfile = () => useProfileStore((s) => s.ensureProfile);