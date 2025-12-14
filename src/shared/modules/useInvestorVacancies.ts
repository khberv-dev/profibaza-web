import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvestorVacancy,
  getInvestorVacancies,
  updateInvestorVacancy,
  CreateInvestorVacancyDto,
  UpdateInvestorVacancyDto,
} from "../endpoints/investorVacancy";

/* cache keys */
export const INVESTOR_VACANCIES_QK = ["investor", "vacancies"] as const;

export function useInvestorVacancies(enabled: boolean) {
  return useQuery({
    queryKey: INVESTOR_VACANCIES_QK,
    queryFn: ({ signal }) => getInvestorVacancies(signal),
    enabled,
    staleTime: 60 * 1000,
    retry: 0,
  });
}

export function useCreateInvestorVacancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInvestorVacancyDto) => createInvestorVacancy(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: INVESTOR_VACANCIES_QK });
    },
  });
}

export function useUpdateInvestorVacancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateInvestorVacancyDto) => updateInvestorVacancy(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: INVESTOR_VACANCIES_QK });
    },
  });
}
