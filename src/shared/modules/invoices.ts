import { useQuery } from "@tanstack/react-query";
import { getAdminInvoices } from "../endpoints/invoices";

export function useAdminInvoices(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin","invoices", page, limit],
    queryFn: ({ signal }) => getAdminInvoices({ page, limit }, signal),
  });
}
