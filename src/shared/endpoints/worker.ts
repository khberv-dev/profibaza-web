// src/shared/endpoints/worker-orders.ts
import { api } from "../api/client";

export type OrderComment = {
  id: string;
  text: string | null;
  rating: number | null;          // 1..5
  feedback: string | null;        // если появится ответ мастера и т.п.
  orderId: string;
  clientId: string | null;
  legalId: string | null;
  createdAt: string;              // ISO
};

export type WorkerNewOrder = {
  id: string;
  startAt: string | null;
  endAt: string | null;
  rejectedAt: string | null;
  deadline: string; // ISO
  description: string;
  status: "NEW" | "PROGRESS" | "DONE" | "REJECTED";
  budget: number | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  clientId: string;
  legalId: string | null;
  workerProfessionId: string;
  createdAt: string;
  updatedAt: string;

  client: {
    address1: string | null;
    address2: string | null;
    address3: string | null;
    user: {
      surname: string;
      name: string;
      middleName?: string | null;
      phone?: string | null;
      avatar?: string | null;
    };
  } | null;

  legal: unknown | null;

  /** НОВОЕ: массив комментариев клиента к этому заказу */
  comments?: OrderComment[];      // может отсутствовать у старых ответов
};

type OkResp =
  | { ok: boolean; data?: unknown }
  | { ok?: boolean; data?: { ok?: boolean } };

const isOk = (p: OkResp) => Boolean(p?.ok) || Boolean((p as any)?.data?.ok);

/** Принять заказ */
export async function acceptWorkerOrder(orderId: string, signal?: AbortSignal) {
  const { data } = await api.post<OkResp>(
    `/worker/accept-order/${encodeURIComponent(orderId)}`,
    { signal }
  );
  if (!isOk(data)) throw new Error("Не удалось принять заказ");
}

/** Отклонить заказ */
export async function rejectWorkerOrder(orderId: string, signal?: AbortSignal) {
  const { data } = await api.post<OkResp>(
    `/worker/reject-order/${encodeURIComponent(orderId)}`,
    { signal }
  );
  if (!isOk(data)) throw new Error("Не удалось отклонить заказ");
}

/** Список заказов мастера (с фильтром по статусу) */
export async function getWorkerOrders(
  params?: { status?: WorkerNewOrder["status"] | "ALL"; search?: string },
  signal?: AbortSignal
): Promise<WorkerNewOrder[]> {
  const q = new URLSearchParams();
  if (params?.status && params.status !== "ALL") q.set("status", params.status);
  if (params?.search) q.set("search", params.search);
  const path = q.toString() ? `/worker/orders?${q}` : "/worker/orders";

  const { data } = await api.get<{ ok: boolean; data: WorkerNewOrder[] }>(
    path,
    { signal }
  );

  // Всегда возвращаем массив и гарантируем наличие comments
  const arr = Array.isArray(data?.data) ? data!.data : [];
  return arr.map((o) => ({ ...o, comments: o.comments ?? [] }));
}

/** Старый список «только новые» — оставляем как есть */
export async function getWorkerNewOrders(signal?: AbortSignal) {
  const { data } = await api.get<{ ok: boolean; data: WorkerNewOrder[] }>(
    "/worker/new-orders",
    { signal }
  );
  const arr = Array.isArray(data?.data) ? data!.data : [];
  return arr.map((o) => ({ ...o, comments: o.comments ?? [] }));
}
