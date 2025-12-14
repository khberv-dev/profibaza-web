// src/shared/modules/investor/hooks/useInvestorContacts.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInvestorContact,
  CreateInvestorContactDto,
} from "../endpoints/investorContacts";
import { INVESTOR_ME_QK } from "./useInvestor"; // где у тебя useInvestorMe

export const useCreateInvestorContact = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateInvestorContactDto) => createInvestorContact(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: INVESTOR_ME_QK });
    },
  });
};
