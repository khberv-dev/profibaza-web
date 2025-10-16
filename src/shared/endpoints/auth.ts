// src/shared/endpoints/auth.ts
import { api } from "../api/client";
import type { UserRole } from "../auth/roles";
import { useAuthStore } from "../stores/auth";

export type LoginDto = { phone: string; password: string };

// бэкенд реально шлёт role, судя по примеру — подхватим:
export type LoginResponse = {
  token: string;
  role?: UserRole;           // ← опционально, если вдруг нет — можно запросить /me
  active?: boolean;
  roleUID?: string;          // если понадобится — сохраним позже отдельно
};

export type RegisterDto = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string;
  password: string;
  role: UserRole;
};

export const authApi = {
  login: async (body: LoginDto): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", body);


    if (data?.token && data?.role) {
      // сохраняем токен и роль
      useAuthStore
        .getState()
        .setAuth({ token: data.token, role: data.role ?? null });

      // сохраняем active, если пришёл
      if (typeof data.active === "boolean") {
        const current = useAuthStore.getState().me;
        useAuthStore
          .getState()
          .setMe({ ...(current ?? {}), active: data.active } as any);
      }
    }
    return data;
  },

  register: (dto: RegisterDto) =>
    api.post("/auth/register", dto).then((r) => r.data),
};
