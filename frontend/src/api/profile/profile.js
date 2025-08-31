import { useQuery, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';

import { useProfile, useSetProfile } from '../../store/useProfileStore';
import api from '../axios';

export const QK = {
  me: ['profile', 'me'],
  byId: (id) => ['profile', Number(id)],
};

export async function fetchMyProfile() {
  const { data } = await api.get('profile/');
  return data;
}

export async function fetchProfileById(id) {
  const { data } = await api.get(`profile/${id}/`);
  return data;
}

export function useProfileQuery(enabled = true) {
  const token = Cookies.get('access_token');
  const setProfile = useSetProfile();
  const cached = useProfile();

  return useQuery(QK.me, fetchMyProfile, {
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    initialData: cached || undefined,
    onSuccess: (data) => setProfile(data),
  });
}

export function useProfileByIdQuery(id, opts = {}) {
  return useQuery(QK.byId(id), () => fetchProfileById(id), {
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...opts,
  });
}

export function useSyncProfileCache() {
  const qc = useQueryClient();
  const setProfile = useSetProfile();
  return {
    syncSelf(data) {
      setProfile(data);
      qc.setQueryData(QK.me, data);
    },
    syncById(id, data) {
      qc.setQueryData(QK.byId(id), data);
      const me = qc.getQueryData(QK.me);
      if (me?.id === Number(id)) {
        setProfile(data);
        qc.setQueryData(QK.me, data);
      }
    },
  };
}
