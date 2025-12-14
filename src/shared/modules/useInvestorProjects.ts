// src/shared/modules/useInvestorProjects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvestorProjects } from "../endpoints/investorProjects";
import type { InvestorProject } from "../endpoints/investorProjects";
import { createInvestorProject } from "../endpoints/investorProjects.create";
// либо оставь как было: useCreateInvestorProject() уже есть

export const INVESTOR_PROJECTS_QK = ["investor", "projects"] as const;

export const useInvestorProjects = (enabled: boolean) =>
  useQuery<InvestorProject[]>({
    queryKey: INVESTOR_PROJECTS_QK,
    queryFn: ({ signal }) => getInvestorProjects(signal),
    enabled,
    staleTime: 60 * 1000,
    retry: 0,
  });

// Если хочешь: инвалидация списка после создания проекта
export const useCreateInvestorProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => createInvestorProject(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: INVESTOR_PROJECTS_QK });
    },
  });
};
