import { api } from "../api/client";

export type MeResponseRaw = {
  id: string;
  name: string;
  surname: string;
  middle_name: string | null;
  phone: string;
  email: string | null;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type Me = {
  id: string;
  name: string;
  surname: string;
  middleName: string | null;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

const mapMe = (r: MeResponseRaw): Me => ({
  id: r.id,
  name: r.name,
  surname: r.surname,
  middleName: r.middle_name,
  phone: r.phone,
  email: r.email,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const userApi = {
  me: async (): Promise<Me> => {
    const { data } = await api.get<MeResponseRaw>("/user/me");
    return mapMe(data);
  },
};
