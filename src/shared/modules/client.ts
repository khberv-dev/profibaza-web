import { useMutation, useQuery } from "@tanstack/react-query";
import { clientApi, UpdateAddressDto, ClientMe } from "../endpoints/client";

/* cache keys */
export const CLIENT_ADDR_QK = ["client", "address"] as const;
export const CLIENT_ME_QK = ["client", "me"] as const;

/* PUT /client/update-address */
export const useUpdateClientAddress = () =>
  useMutation({
    mutationFn: (dto: UpdateAddressDto) => clientApi.updateAddress(dto),
    onSuccess: () => {
      // Попутно можно инвалиди́ровать /client/me, если используешь где-то ещё
      // queryClient.invalidateQueries({ queryKey: CLIENT_ME_QK });
    },
  });

/* GET /client/me (404 -> null) */
export const useClientMe = (enabled: boolean) =>
  useQuery<ClientMe | null>({
    queryKey: CLIENT_ME_QK,
    queryFn: clientApi.me,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
