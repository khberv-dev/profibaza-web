import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export type WorkerVacancy = {
  id: string;
  title: string;
  salary: number | null;
  description: string;
  active?: boolean;
  legalId?: string;
  createdAt?: string;
  legal?: {
    id: string;
    name: string;
  };
  updatedAt?: string;
};

export type SearchVacanciesParams = {
  minSalary?: number; // default 0
  maxSalary?: number; // default 0 (на бэке трактуется как нет верхней границы — если так задумано)
  search?: string; // строка поиска
};

type ListResponse<T> = { ok: boolean; data: T };

export const WORKER_VACANCIES_QK = (p: SearchVacanciesParams) =>
  [
    "worker",
    "search-vacancies",
    p.minSalary ?? 0,
    p.maxSalary ?? 0,
    p.search ?? "",
  ] as const;

/** GET /worker/search-vacancies */
export async function searchWorkerVacancies(
  params: SearchVacanciesParams,
  signal?: AbortSignal
): Promise<WorkerVacancy[]> {
  const query = new URLSearchParams();
  if (typeof params.minSalary === "number")
    query.set("minSalary", String(params.minSalary));
  if (typeof params.maxSalary === "number")
    query.set("maxSalary", String(params.maxSalary));
  if (params.search) query.set("search", params.search);

  const { data } = await api.get<ListResponse<WorkerVacancy[]>>(
    `/worker/search-vacancies?${query.toString()}`,
    { signal }
  );
  if (!data?.ok || !Array.isArray(data.data)) return [];
  return data.data;
}

export function useSearchWorkerVacancies(params: SearchVacanciesParams) {
  return useQuery({
    queryKey: WORKER_VACANCIES_QK(params),
    queryFn: ({ signal }) => searchWorkerVacancies(params, signal),
    enabled: true,
    staleTime: 60_000,
  });
}

export async function createWorkerOffer(payload: {
  workerProfessionId: string;
  vacancyId: string;
}) {
  const { data } = await api.post("/worker/create-offer", payload);
  return data;
}
