import { api } from "../api/client";

export type AdminOverall = {
  usersCount: number;
  clientsCount: number;
  workersCount: number;
  ordersCount: number;
  finishedOrdersCount: number;
};

export async function getAdminOverall(signal?: AbortSignal): Promise<AdminOverall> {
  const { data } = await api.get<{ ok: boolean; data: AdminOverall }>(
    "/admin/overall",
    { signal }
  );
  return data.data;
}
