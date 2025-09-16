import { api, TOKEN_KEY } from "../api/client";

export type LoginDto = { phone: string; password: string };
export type LoginResponse = { token: string }; // 👈 вот такой респонс
export type RegisterDto = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string;
  password: string;
};

export const authApi = {
  login: async (body: LoginDto): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", body);
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },
  register: (dto: RegisterDto) =>
    api.post("/auth/register", dto).then((r) => r.data),
};
