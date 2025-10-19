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
  name: string | null;
  userId: string;
  createdAt: string;
  updated_at: string;
};

export type ClientMe = {
  id: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  name: string | null;
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
  name: r.name,
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

export type Profession = {
  id: string;
  nameUz: string;
  nameRu: string;
};

export type SearchWorkerUser = {
  name: string;
  surname: string;
  middleName?: string | null;
  avatar?: string | null;
};

export type SearchWorker = {
  id: string; // row id (workerProfessionId)
  minPrice: number;
  maxPrice: number;
  rating: number;
  hasTeam: boolean;
  teamMemberCount: number;
  readyForHugeProject: boolean;
  inventory?: string | null;
  competitions?: "YES" | "NO";
  jobType?: "SOLO" | "COMPANY";
  professionId: string;
  updatedAt?: string;
  isBusy?: boolean;
  inArea?: boolean;
  worker?: {
    id: string;
    user?: SearchWorkerUser;
  };
};

/* === API === */
export async function searchWorkers(
  params: {
    professions: string;
    minPrice: number;
    maxPrice: number;
    long?: number;
    lat?: number;
    radius?: number; // бек ждёт дробное значение (как в твоём примере из URL)
  },
  signal?: AbortSignal
): Promise<SearchWorker[]> {
  const { professions, minPrice, maxPrice, long, lat, radius } = params;

  const query: Record<string, string | number> = {
    professions,
    minPrice,
    maxPrice,
  };
  if (typeof long === "number") query.long = long;
  if (typeof lat === "number") query.lat = lat;
  if (typeof radius === "number") query.radius = radius;

  const { data } = await api.get<{ ok: boolean; data: SearchWorker[] }>(
    "/opt/order/search",
    { params: query, signal }
  );
  return Array.isArray(data?.data) ? data.data : [];
}

export async function getWorkerById(
  id: string,
  signal?: AbortSignal
): Promise<SearchWorker | null> {
  const { data } = await api.get<{
    ok: boolean;
    data: SearchWorker | SearchWorker[];
  }>(`/opt/order/search/${id}`, { signal });
  // Бэки иногда шлют объект, иногда массив — аккуратно достанем
  if (Array.isArray(data?.data)) return data.data[0] ?? null;
  return (data && (data as any).data) || null;
}

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

  updateAddressLegal: async (dto: UpdateAddressDto): Promise<boolean> => {
    const { data } = await api.put<UpdateAddressResp>(
      "/legal/update-address",
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
  melegal: async (): Promise<ClientMe | null> => {
    try {
      const { data } = await api.get<{ ok: boolean; data: ClientMeRaw }>(
        "/legal/me"
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
  createOrderLegal: async (dto: CreateOrderDto) => {
    const { data } = await api.post<CreateOrderResp>(
      "/legal/create-order",
      dto
    );
    return data;
  },
};
