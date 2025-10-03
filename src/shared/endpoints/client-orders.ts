import { api } from "../api/client";

/** ===== Types ===== */
export type OrderStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type ClientOrder = {
  id: string;
  deadline: string | null;
  description: string;
  status: OrderStatus;
  budget: number | null;
  address1: string | null; // Регион
  address2: string | null; // Район
  address3: string | null; // Махалля
  workerProfessionId: string;
  createdAt: string;
  updatedAt: string;
  workerProfession?: {
    id: string;
    minPrice: number | null;
    maxPrice: number | null;
    rating: number | null;
    hasTeam: boolean;
    teamMemberCount: number | null;
    jobType: "SOLO" | "TEAM";
    worker: {
      user: {
        surname?: string;
        name?: string;
        middleName?: string | null;
        phone?: string;
        avatar?: string | null;
      };
    };
  };
};

type Resp =
  | { ok: boolean; data: ClientOrder[] }
  | { ok: boolean; data: { ok: boolean; data: ClientOrder[] } };

/** Универсальная распаковка, если вдруг обёртка двойная */
const takeList = (payload: Resp): ClientOrder[] => {
  // @ts-ignore
  if (Array.isArray(payload?.data)) return payload.data as ClientOrder[];
  // @ts-ignore
  if (Array.isArray(payload?.data?.data)) return payload.data.data as ClientOrder[];
  return [];
};

export const getClientOrders = async (signal?: AbortSignal): Promise<ClientOrder[]> => {
  const { data } = await api.get<Resp>("/client/orders", { signal });
  return takeList(data);
};
