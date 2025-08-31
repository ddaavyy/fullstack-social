import { create } from "zustand";

import type { Profile } from "@/types/profile";

type ProfileState = {
  profile: Profile | null;
};

type ProfileActions = {
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
};

export type ProfileStore = ProfileState & ProfileActions;

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));

export default useProfileStore;

export const useProfile = () => useProfileStore((s) => s.profile);
export const useSetProfile = () => useProfileStore((s) => s.setProfile);
export const useClearProfile = () => useProfileStore((s) => s.clearProfile);
