import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

/* ===== Типы ===== */
export type Vacancy = {
  id: string;
  title: string;
  salary: number | null;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
};

export type CreateVacancyDto = {
  title: string;
  salary: number | null;
  description: string;
};

export type UpdateVacancyDto = Partial<CreateVacancyDto> & { id: string };

type ListResponse<T> = { ok: boolean; data: T };

/* ===== Query Keys ===== */
export const VACANCIES_QK = ["legal", "vacancies"] as const;
export const VACANCY_QK = (id: string) => ["legal", "vacancy", id] as const;

/* ===== API ===== */

/** Список вакансий компании */
export async function getMyVacancies(signal?: AbortSignal): Promise<Vacancy[]> {
  const { data } = await api.get<ListResponse<Vacancy[]>>("/legal/vacancies", {
    signal,
  });
  if (!data?.ok) return [];
  return Array.isArray(data.data) ? data.data : [];
}

/** Получить вакансию по ID */
export async function getVacancyById(
  id: string,
  signal?: AbortSignal
): Promise<Vacancy> {
  const { data } = await api.get<ListResponse<Vacancy>>(
    `/legal/vacancies/${id}`, // ✅ динамический ID
    { signal }
  );
  if (!data?.ok || !data.data) throw new Error("Вакансия не найдена");
  return data.data;
}

/** Создать вакансию */
export async function createVacancy(body: CreateVacancyDto): Promise<Vacancy> {
  const { data } = await api.post<ListResponse<Vacancy>>(
    "/legal/create-vacancy",
    body
  );
  if (!data.ok) throw new Error("Не удалось создать вакансию");
  return data.data;
}

/** Обновить вакансию */
export async function updateVacancy(body: UpdateVacancyDto): Promise<Vacancy> {
  const { id, ...patch } = body;
  const { data } = await api.put<ListResponse<Vacancy>>(
    `/legal/update-vacancy/${id}`, // ✅ теперь ID в URL
    patch
  );
  if (!data.ok) throw new Error("Не удалось обновить вакансию");
  return data.data;
}

/* ===== React Query Hooks ===== */

export function useMyVacancies() {
  return useQuery({
    queryKey: VACANCIES_QK,
    queryFn: ({ signal }) => getMyVacancies(signal),
    staleTime: 60_000,
  });
}

export function useVacancy(id: string, enabled = true) {
  return useQuery({
    queryKey: VACANCY_QK(id),
    queryFn: ({ signal }) => getVacancyById(id, signal),
    enabled: !!id && enabled,
  });
}

export function useCreateVacancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateVacancyDto) => createVacancy(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: VACANCIES_QK });
    },
  });
}

export function useUpdateVacancy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateVacancyDto) => updateVacancy(dto),
    onSuccess: async (_data, vars) => {
      await Promise.allSettled([
        qc.invalidateQueries({ queryKey: VACANCIES_QK }),
        qc.invalidateQueries({ queryKey: VACANCY_QK(vars.id) }),
      ]);
    },
  });
}
