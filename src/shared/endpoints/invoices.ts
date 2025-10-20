import { api } from "../api/client";

export type InvoiceStatus = "CREATED" | "PAID" | "CANCELLED";

export type Invoice = {
  id: string;
  userId: string;
  amount: number;
  status: InvoiceStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
};

export type InvoicesResp = {
  ok: boolean;
  data: Invoice[];
  meta: { total: number; pages: number };
};

export async function getAdminInvoices(
  params: { page?: number; limit?: number },
  signal?: AbortSignal
) {
  const { data } = await api.get<InvoicesResp>("/admin/invoices", {
    params,
    signal,
  });
  return {
    items: data.data,
    total: data.meta?.total ?? data.data.length,
    pages: data.meta?.pages ?? 1,
  };
}
