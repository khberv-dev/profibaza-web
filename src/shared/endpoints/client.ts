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

/* ---------- order types ---------- */
export type CreateOrderDto = {
  workerProfessionId: string;
  description: string;
  deadline: string; // ISO: 2025-01-05
  budget: number; // сум
  address1?: string | null; // область / город
  address2?: string | null; // район / посёлок
  address3?: string | null; // улица / ориентир
};

export type CreateOrderResp = {
  ok: boolean;
  data: { id: string };
};

/* ---------- search types ---------- */
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

export type WorkerExperience = {
  id: string;
  startedAt: number | null; // 2024
  endedAt: number | null; // 2025 (или null — по настоящее время)
  jobPlace: string | null;
  jobDescription: string | null;
  workerProfessionId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type OrderStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELED"
  | "REJECTED";

export type OrderBrief = {
  id: string;
  startAt: string | null; // ISO
  endAt: string | null; // ISO
  rejectedAt: string | null; // ISO
  deadline: string | null; // ISO
  description: string | null;
  status: OrderStatus | string; // бэкенд может прислать кастомные
  budget: number | null;
  address1: string | null; // область / город
  address2: string | null; // район
  address3: string | null; // улица / ориентир
  files: string[]; // имена файлов/картинок
  clientId: string | null;
  legalId: string | null;
  workerProfessionId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type WorkerSchedule = {
  id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  workerProfessionId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// если демо-материалы — это файлы, можно оставить как string[];
// при необходимости заменить на объект с метаданными
export type DemoFile = string;
// export type DemoFile = { name: string; url: string; createdAt?: string };

export type SearchWorker = {
  id: string; // workerProfessionId
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
  schedule?: WorkerSchedule | null;
  experience?: WorkerExperience[];
  // опциональные/вычисляемые
  updatedAt?: string;
  isBusy?: boolean;
  inArea?: boolean;

  // вложенные сущности
  worker?: {
    id: string;
    user?: SearchWorkerUser;
  };

  // новое: детальные данные
  orders?: OrderBrief[]; // из примера JSON
  demos?: DemoFile[]; // демо-файлы/портфолио
  // необязательно, но удобно иметь сразу профессию
  profession?: Profession; // если API начинает отдавать объект
};

/* ---------- API ---------- */

// поиск мастеров по профессии, цене и геолокации
export async function searchWorkers(
  params: {
    professions: string;
    minPrice: number;
    maxPrice: number;
    long?: number;
    lat?: number;
    radius?: number; // дробное значение
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
  },
  signal?: AbortSignal
): Promise<SearchWorker[]> {
  const query: Record<string, string | number | null> = {
    professions: params.professions,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  };

  if (typeof params.long === "number") query.long = params.long;
  if (typeof params.lat === "number") query.lat = params.lat;
  if (typeof params.radius === "number") query.radius = params.radius;

  if (params.address1) query.address1 = params.address1;
  if (params.address2) query.address2 = params.address2;
  if (params.address3) query.address3 = params.address3;

  const { data } = await api.get<{ ok: boolean; data: SearchWorker[] }>(
    "/opt/order/search",
    { params: query, signal }
  );
  return Array.isArray(data?.data) ? data.data : [];
}

// детальный просмотр мастера
export async function getWorkerById(
  id: string,
  signal?: AbortSignal
): Promise<SearchWorker | null> {
  const { data } = await api.get<{
    ok: boolean;
    data: SearchWorker | SearchWorker[];
  }>(`/opt/order/search/${id}`, { signal });
  if (Array.isArray(data?.data)) return data.data[0] ?? null;
  return (data && (data as any).data) || null;
}

/* ---------- clientApi ---------- */
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
  updateAddressInvestor: async (dto: UpdateAddressDto): Promise<boolean> => {
    const { data } = await api.put<UpdateAddressResp>(
      "/investor/update-address",
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
