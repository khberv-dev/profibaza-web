// src/shared/stores/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserRole } from "../auth/roles";

type AuthState = {
  token: string | null;
  role: UserRole | null;
  isAuthed: boolean;
};
type AuthActions = {
  setAuth: (payload: { token: string; role: UserRole }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthed: false,
      setAuth: ({ token, role }) =>
        set({ token, role, isAuthed: Boolean(token) }),
      logout: () => set({ token: null, role: null, isAuthed: false }),
    }),
    {
      name: "pb_auth", // ключ в localStorage
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // при желании — миграции версий
    }
  )
);

// Удобные селекторы
export const getAuthToken = () => useAuthStore.getState().token;
export const getAuthRole = () => useAuthStore.getState().role;
