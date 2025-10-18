import { api } from "../api/client";

/** ===== Types ===== */
export type OrderStatus = "NEW" | "PROGRESS" | "DONE" | "CANCELLED";

export type LegalOrderComment = {
  id: string;
  text: string | null;      // текст клиента
  rating: number | null;    // 1..5
  feedback: string | null;  // ответ мастера (реплай)
  createdAt: string;        // ISO
};

export type LegalOrder = {
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
  comments?: LegalOrderComment[];
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
  | { ok: boolean; data: LegalOrder[] }
  | { ok: boolean; data: { ok: boolean; data: LegalOrder[] } };

export type LegalCommentPayload = {
  comment: string;
  rate: number;
};

type CommentResp =
  | { ok: boolean; data?: unknown; message?: unknown }
  | { ok: boolean; data: { ok: boolean; data?: unknown; message?: unknown } };

const takeOk = (payload: CommentResp): boolean => {
  // Универсальная распаковка на случай двойной обёртки
  // @ts-ignore
  if (typeof payload?.ok === "boolean" && payload.ok) return true;
  // @ts-ignore
  if (typeof payload?.data?.ok === "boolean" && payload.data.ok) return true;
  return false;
};

export async function postLegalComment(
  orderId: string,
  body: LegalCommentPayload,
  signal?: AbortSignal
): Promise<void> {
  const { data } = await api.post<CommentResp>(
    `/legal/comment/${encodeURIComponent(orderId)}`,
    body,
    { signal }
  );
  if (!takeOk(data)) {
    throw new Error("Не удалось отправить отзыв");
  }
}

/** Универсальная распаковка, если вдруг обёртка двойная */
const takeList = (payload: Resp): LegalOrder[] => {
  // @ts-ignore
  if (Array.isArray(payload?.data)) return payload.data as ClientOrder[];
  // @ts-ignore
  if (Array.isArray(payload?.data?.data))
    return payload.data.data as LegalOrder[];
  return [];
};

export const getLegalOrders = async (
  signal?: AbortSignal
): Promise<LegalOrder[]> => {
  const { data } = await api.get<Resp>("/legal/orders", { signal });
  return takeList(data);
};
