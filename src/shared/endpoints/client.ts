import { api } from "../api/client";

/* ---------- types ---------- */
export type UpdateAddressDto = {
  address1: string;
  address2: string;
  address3: string;
};

type UpdateAddressResp = {
  ok: boolean;
  message?: string | Record<string, string>;
};

export type ClientMeRaw = {
  id: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  userId: string;
  createdAt: string;
  updated_at: string;
};

export type ClientMe = {
  id: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

/* ---------- mappers ---------- */
const mapClientMe = (r: ClientMeRaw): ClientMe => ({
  id: r.id,
  address1: r.address1,
  address2: r.address2,
  address3: r.address3,
  userId: r.userId,
  createdAt: r.createdAt,
  updatedAt: r.updated_at,
});

export type CreateOrderDto = {
  workerProfessionId: string; // таргет на конкретного исполнителя (его строка профиля)
  description: string;
  deadline: string; // ISO: 2025-01-05
  budget: number; // сум
  address1?: string | null; // область/город
  address2?: string | null; // район/посёлок
  address3?: string | null; // улица/ориентир
};

export type CreateOrderResp = {
  ok: boolean;
  data: {
    id: string;
  };
};

/* ---------- api ---------- */
export const clientApi = {
  updateAddress: async (dto: UpdateAddressDto): Promise<boolean> => {
    const { data } = await api.put<UpdateAddressResp>(
      "/client/update-address",
      dto
    );
    if (!data?.ok) {
      let msg = "Не удалось сохранить адрес";
      const m = data?.message;
      if (typeof m === "string") msg = m;
      else if (m && typeof m === "object") {
        msg = (m as any).ru || (m as any).uz || Object.values(m)[0] || msg;
      }
      throw new Error(msg);
    }
    return true;
  },

  /** Возвращает клиентский профиль; 404 -> null */
  me: async (): Promise<ClientMe | null> => {
    try {
      const { data } = await api.get<{ ok: boolean; data: ClientMeRaw }>(
        "/client/me"
      );
      return mapClientMe(data.data);
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  },

  createOrder: async (dto: CreateOrderDto) => {
    const { data } = await api.post<CreateOrderResp>(
      "/client/create-order",
      dto
    );
    return data;
  },
};
