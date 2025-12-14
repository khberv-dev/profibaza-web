// src/shared/modules/investor/hooks/useInvestor.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { getInvestorMe, InvestorMe } from "../endpoints/investor";

/* cache keys */
export const INVESTOR_ME_QK = ["investor", "me"] as const;

export const useInvestorMe = (enabled: boolean) =>
  useQuery<InvestorMe | null>({
    queryKey: INVESTOR_ME_QK,
    queryFn: ({ signal }) => getInvestorMe(signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
