// src/stores/user-profiles.ts
import APIFactory from '@/api/APIFactory';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type ListFilters = {
  name?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string | null;
  descending?: boolean | null;
};

type Permission = { module: string; actions: string[] };

function normalize(res: any) {
  return res?.data?.response?.data ?? res?.data;
}

export const useProfilesStore = defineStore('user-profiles', () => {
  const profiles = ref<any[]>([]);
  const total = ref(0);
  const selectedProfile = ref(null);

  async function listProfiles(filters: ListFilters = {}) {
    const qPage = parseInt(String(filters.page ?? 1), 10) || 1;
    const qLimit = parseInt(String(filters.limit ?? 10), 10) || 10;

    const query: Record<string, any> = { page: qPage, limit: qLimit };
    if (typeof filters.name === 'string' && filters.name.trim() !== '')
      query.name = filters.name.trim();
    if (typeof filters.active === 'boolean') query.active = filters.active;
    if (typeof filters.sort_by === 'string' && filters.sort_by.trim() !== '')
      query.sort_by = filters.sort_by.trim();
    if (typeof filters.descending === 'boolean') query.descending = filters.descending;

    const res = await APIFactory.get({ path: '/profiles/list', setToken: true, query });
    const payload = normalize(res);
    const items = payload?.items ?? payload?.data ?? payload ?? [];

    profiles.value = items.map((p: any) => ({
      _id: p._id ?? p.id,
      name: p.name,
      description: p.description,
      status: p.active ?? p.status
    }));
    total.value = Number(payload?.total ?? items.length);

    return { items: profiles.value, total: total.value };
  }

  async function createProfile(body: {
    name: string;
    description: string;
    default_route: string;
    active: boolean;
    permissions: Array<{ module: string; actions: string[] }>;
  }) {
    const res = await APIFactory.post({ path: '/profiles/create', setToken: true, body });
    return normalize(res);
  }

  async function clearSelectedProfile() {
    selectedProfile.value = null;
  }

  async function fetchProfileDetail(id: string) {
    if (!id) throw new Error('id requerido');
    const res = await APIFactory.get({ path: '/profiles/list', setToken: true, query: { id } });
    const raw = res?.data?.data?.[0] || null;
    selectedProfile.value = raw
      ? {
          id: raw.id,
          name: raw.name,
          description: raw.description,
          status: raw.active ?? raw.status,
          permissions: raw.permissions ?? []
        }
      : null;
    return selectedProfile.value;
  }

  async function updateProfile(body: {
    id: string;
    name?: string;
    description?: string;
    active?: boolean;
    permissions?: Permission[];
  }) {
    const res = await APIFactory.post({ path: '/profiles/update', setToken: true, body });
    return normalize(res);
  }

  async function deleteProfile(id: string) {
    if (!id) throw new Error('id is required');

    const body = { id };

    const res = await APIFactory.post({
      path: '/profiles/delete',
      setToken: true,
      body
    });
    return normalize(res);
  }

  return {
    profiles,
    total,
    selectedProfile,
    listProfiles,
    createProfile,
    clearSelectedProfile,
    fetchProfileDetail,
    updateProfile,
    deleteProfile
  };
});
