import { useQuery } from "@tanstack/react-query";
import { getProfessions } from "./worker";

export const PROFESSIONS_QK = ["opt", "professions"] as const;

export const useProfessions = () =>
  useQuery({
    queryKey: PROFESSIONS_QK,
    queryFn: ({ signal }) => getProfessions(signal),
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });
