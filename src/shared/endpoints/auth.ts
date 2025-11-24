// src/shared/endpoints/auth.ts
import { api } from "../api/client";
import type { UserRole } from "../auth/roles";
import { useAuthStore } from "../stores/auth";

export type LoginDto = { phone: string; password: string };

// бэкенд реально шлёт role, судя по примеру — подхватим:
export type LoginResponse = {
  token: string;
  role?: UserRole; // ← опционально, если вдруг нет — можно запросить /me
  active?: boolean;
  roleUID?: string; // если понадобится — сохраним позже отдельно
};

export type RegisterDto = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string;
  password: string;
  role: UserRole;
  gender: "MALE" | "FEMALE";
  birthday: string;
};

// ===== NEW: типы под OTP (если нужно, можешь потом уточнить) =====
export type VerifyOtpDto = {
  phone: string;
  code: string;
};

export const authApi = {
  login: async (body: LoginDto): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", body);

    if (data?.token && data?.role) {
      useAuthStore.getState().setAuth({ token: data.token, role: data.role });
    }

    if (typeof data.active === "boolean") {
      useAuthStore.getState().setActive(data.active); // ← только актив
    }

    return data;
  },

  register: (dto: RegisterDto) =>
    api.post("/auth/register", dto).then((r) => r.data),

  // ===== NEW: отправка кода по номеру =====
  sendOtp: (phone: string) =>
    api
      .post("/auth/send-otp", undefined, {
        params: { phone }, // /auth/send-otp?phone=998900012644
      })
      .then((r) => r.data),

  // ===== NEW: проверка кода перед регистрацией =====
  verifyOtp: (dto: VerifyOtpDto) =>
    api.post("/auth/verify-otp", dto).then((r) => r.data),
};
