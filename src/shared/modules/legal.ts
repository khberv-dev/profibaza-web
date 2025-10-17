import { useMutation, useQuery } from "@tanstack/react-query";
import { clientApi, UpdateAddressDto, ClientMe } from "../endpoints/client";
import { updateLegalProfile } from "../endpoints/legal";

/* cache keys */
export const LEGAL_ADDR_QK = ["legal", "address"] as const;
export const LEGAL_ME_QK = ["legal", "me"] as const;

/* PUT /client/update-address */
export const useUpdateLegalAddress = () =>
  useMutation({
    mutationFn: (dto: UpdateAddressDto) => clientApi.updateAddressLegal(dto),
    onSuccess: () => {
      // Попутно можно инвалиди́ровать /client/me, если используешь где-то ещё
      // queryClient.invalidateQueries({ queryKey: CLIENT_ME_QK });
    },
  });

export const useLegalMe = (enabled: boolean) =>
  useQuery<ClientMe | null>({
    queryKey: LEGAL_ME_QK,
    queryFn: clientApi.melegal,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

export function useUpdateLegalProfile() {
  return useMutation({
    mutationFn: (payload: { name: string }) => updateLegalProfile(payload),
  });
}
