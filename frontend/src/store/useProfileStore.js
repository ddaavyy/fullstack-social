import { create } from 'zustand';

const useProfileStore = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));

export default useProfileStore;

export const useProfile = () => useProfileStore((s) => s.profile);
export const useSetProfile = () => useProfileStore((s) => s.setProfile);
export const useClearProfile = () => useProfileStore((s) => s.clearProfile);
