// endpoints/user.ts
import { api } from "../api/client";

export type MeResponseRaw = {
  ok: boolean;
  data: {
    id: string;
    name: string;
    surname: string;
    middle_name: string | null;
    phone: string;
    email: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  };
};

export type Me = {
  id: string;
  name: string;
  surname: string;
  middleName: string | null;
  phone: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserDto = {
  name?: string;
  surname?: string;
  middleName?: string | null;
  phone?: string; // только цифры: 998XX...
  email?: string | null;
};

type UpdateUserResponse = {
  ok: boolean;
  message?: Record<string, string>; // { uz?: string; ru?: string; ... }
};

type UpdatePasswordResp = {
  ok: boolean;
  message?: string | Record<string, string>;
};
type RequestResetResp = {
  ok: boolean;
  data: { request_id: string };
};

type ResetPasswordResp = { ok: boolean };

const mapMe = (r: MeResponseRaw["data"]): Me => ({
  id: r.id,
  name: r.name,
  surname: r.surname,
  middleName: r.middle_name,
  phone: r.phone,
  email: r.email,
  role: r.role,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const userApi = {
  me: async (): Promise<Me> => {
    const { data } = await api.get<MeResponseRaw>("/user/me");
    return mapMe(data.data);
  },
  update: async (dto: UpdateUserDto): Promise<UpdateUserResponse> => {
    const { data } = await api.put<UpdateUserResponse>("/user/update", {
      name: dto.name,
      surname: dto.surname,
      middleName: dto.middleName,
      phone: dto.phone,
    });
    return data;
  },

  requestResetPassword: async (phoneDigits: string) => {
    const { data } = await api.post<RequestResetResp>(
      "/user/request-reset-password",
      { phone: phoneDigits }
    );
    return data.data.request_id;
  },

  resetPassword: async (payload: {
    requestId: string;
    code: string;
    password: string;
  }) => {
    const { data } = await api.post<ResetPasswordResp>("/user/reset-password", {
      requestId: payload.requestId,
      code: payload.code,
      password: payload.password,
    });
    return data.ok;
  },

  updatePassword: async (oldPassword: string, password: string) => {
    const { data } = await api.put<UpdatePasswordResp>(
      "/user/update-password",
      {
        oldPassword,
        password,
      }
    );

    if (!data?.ok) {
      let msg = "Не удалось изменить пароль";
      const m = data?.message;
      if (typeof m === "string") msg = m;
      else if (m && typeof m === "object") {
        // берём приоритетно ru, затем uz, затем любой первый текст
        msg = m.ru || m.uz || Object.values(m)[0] || msg;
      }
      throw new Error(msg);
    }
    return true;
  },
};
