// src/shared/endpoints/auth.ts
import { api } from "../api/client";
import type { UserRole } from "../auth/roles";
import { useAuthStore } from "../stores/auth";

export type LoginDto = { phone: string; password: string };

// бэкенд реально шлёт role, судя по примеру — подхватим:
export type LoginResponse = {
  token: string;
  role?: UserRole;           // ← опционально, если вдруг нет — можно запросить /me
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

    // если роль пришла в ответе — кладём её сразу
    if (data?.token && data?.role) {
      useAuthStore.getState().setAuth({ token: data.token, role: data.role });
    } else if (data?.token) {
      // запасной план: токен есть, роль подтянем отдельным запросом /me (если нужен)
      useAuthStore.getState().setAuth({ token: data.token, role: null as any });
      try {
        const me = await api.get<{ role: UserRole }>("/me"); // или /client/me для клиента
        if (me?.data?.role) {
          useAuthStore.getState().setAuth({
            token: data.token,
            role: me.data.role,
          });
        }
      } catch {
        /* игнор, роль можно проставить позже */
      }
    }
    return data;
  },

  register: (dto: RegisterDto) =>
    api.post("/auth/register", dto).then((r) => r.data),
};
