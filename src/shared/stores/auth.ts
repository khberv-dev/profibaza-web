// src/shared/stores/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserRole } from "../auth/roles";

export type Me = {
  id: string;
  name: string | null;
  surname: string | null;
  middleName: string | null;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  active: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  token: string | null;
  role: UserRole | null;
  isAuthed: boolean;
  me: Me | null; // 👈 профиль из /user/me
};
type AuthActions = {
  setAuth: (payload: { token: string; role: UserRole }) => void;
  setMe: (me: Me | null) => void; // 👈 сохранить ответ me
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthed: false,
      me: null,
      setAuth: ({ token, role }) =>
        set({ token, role, isAuthed: Boolean(token) }),
      setMe: (me) => set({ me, role: me?.role ?? null }), // роль обновляем из me
      logout: () => set({ token: null, role: null, isAuthed: false, me: null }),
    }),
    {
      name: "pb_auth",
      version: 2, // ↑ версия, чтобы прошла миграция
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// селекторы/хелперы
export const getAuthToken = () => useAuthStore.getState().token;
export const getAuthRole = () => useAuthStore.getState().role;
export const getMe = () => useAuthStore.getState().me;
