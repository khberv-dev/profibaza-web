import { useMutation, useQuery } from "@tanstack/react-query";
import { clientApi, UpdateAddressDto, ClientMe } from "../endpoints/client";
import { updateLegalProfile } from "../endpoints/legal";

/* cache keys */
export const LEGAL_ADDR_QK = ["legal", "address"] as const;
export const LEGAL_ME_QK = ["legal", "me"] as const;

// ✅ NEW
export const INVESTOR_ME_QK = ["investor", "me"] as const;

export const useUpdateLegalAddress = () =>
  useMutation({
    mutationFn: (dto: UpdateAddressDto) => clientApi.updateAddressLegal(dto),
  });

export const useUpdateInvestorAddress = () =>
  useMutation({
    mutationFn: (dto: UpdateAddressDto) => clientApi.updateAddressInvestor(dto),
  });

export const useLegalMe = (enabled: boolean) =>
  useQuery<ClientMe | null>({
    queryKey: LEGAL_ME_QK,
    queryFn: clientApi.melegal,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

// ✅ NEW

export function useUpdateLegalProfile() {
  return useMutation({
    mutationFn: (payload: { name: string }) => updateLegalProfile(payload),
  });
}
