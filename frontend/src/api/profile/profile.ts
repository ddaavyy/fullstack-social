import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import Cookies from "js-cookie";

import { useProfile, useSetProfile } from "@/store/useProfileStore";
import type { ByIdKey, MeKey, Profile } from "@/types/profile";

import api from "../axios";

export const QK = {
  me: ["profile", "me"] as MeKey,
  byId: (id: number | string) => ["profile", Number(id)] as ByIdKey,
};

export async function fetchMyProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("profile/");
  return data;
}

export async function fetchProfileById(id: number | string): Promise<Profile> {
  const { data } = await api.get<Profile>(`profile/${id}/`);
  return data;
}

export function useProfileQuery(
  enabled: boolean = true
): UseQueryResult<Profile, unknown> {
  const token = Cookies.get("access_token");
  const setProfile = useSetProfile();
  const cached = useProfile();

  const query = useQuery<Profile, unknown, Profile, MeKey>({
    queryKey: QK.me,
    queryFn: fetchMyProfile,
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000,
    ...(cached ? { initialData: cached as Profile } : {}),
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
}

type ByIdOpts = Omit<
  UseQueryOptions<Profile, unknown, Profile, ByIdKey>,
  "queryKey" | "queryFn"
>;

export function useProfileByIdQuery(
  id: number | string,
  opts: ByIdOpts = {}
): UseQueryResult<Profile, unknown> {
  return useQuery<Profile, unknown, Profile, ByIdKey>({
    queryKey: QK.byId(id),
    queryFn: () => fetchProfileById(id),
    enabled: !!id && (opts.enabled ?? true),
    staleTime: 2 * 60 * 1000,
    ...opts,
  });
}

export function useSyncProfileCache() {
  const qc = useQueryClient();
  const setProfile = useSetProfile();

  return {
    syncSelf(data: Profile) {
      setProfile(data);
      qc.setQueryData<Profile>(QK.me, data);
    },
    syncById(id: number | string, data: Profile) {
      qc.setQueryData<Profile>(QK.byId(id), data);
      const me = qc.getQueryData<Profile>(QK.me);
      if (me?.id === Number(id)) {
        setProfile(data);
        qc.setQueryData<Profile>(QK.me, data);
      }
    },
  };
}
