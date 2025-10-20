import { useQuery } from "@tanstack/react-query";
import { getAdminOverall, AdminOverall } from "../endpoints/admin";

export function useAdminOverall() {
  return useQuery<AdminOverall>({
    queryKey: ["admin","overall"],
    queryFn: ({ signal }) => getAdminOverall(signal),
    staleTime: 60_000, // минута
  });
}
