import { api } from "../api/client";

export type WorkerNewOrder = {
  id: string;
  startAt: string | null;
  endAt: string | null;
  rejectedAt: string | null;
  deadline: string; // ISO
  description: string;
  status: "NEW" | "ACCEPTED" | "IN_PROGRESS" | "DONE" | "REJECTED";
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
};

export async function getWorkerNewOrders(signal?: AbortSignal): Promise<WorkerNewOrder[]> {
  const { data } = await api.get<{ ok: boolean; data: WorkerNewOrder[] }>(
    "/worker/new-orders",
    { signal }
  );
  return Array.isArray(data?.data) ? data.data : [];
}
