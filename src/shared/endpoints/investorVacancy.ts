/* ========================= Types ========================= */

import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";

export type InvestorVacancy = {
  id: string;
  title: string;
  salary: number | null;
  description: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateInvestorVacancyDto = {
  title: string;
  salary?: number | null;
  description?: string | null;
};

export type UpdateInvestorVacancyDto = {
  id: string;
  title: string;
  salary?: number | null;
  description?: string | null;
  active?: boolean;
};

function assertOk(data: any, fallback: string) {
  const ok = data?.ok === true || data?.data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof data?.message === "string" ? data.message : null) ??
      fallback;
    throw new Error(msg);
  }
}

/* ========================= Requests ========================= */

export async function createInvestorVacancy(
  payload: CreateInvestorVacancyDto,
  signal?: AbortSignal
): Promise<{ ok: true; data: InvestorVacancy }> {
  const { data } = await api.post<any>("/investor/create-vacancy", payload, {
    signal,
  });

  assertOk(data, "Не удалось создать вакансию");

  const item: InvestorVacancy = (data?.data ??
    data?.data?.data ??
    data?.vacancy ??
    data) as any;
  return { ok: true, data: item };
}

export async function getInvestorVacancies(
  signal?: AbortSignal
): Promise<InvestorVacancy[]> {
  const { data } = await api.get<any>("/investor/vacancies", { signal });

  assertOk(data, "Не удалось загрузить вакансии");

  const list: InvestorVacancy[] = (data?.data ?? data?.data?.data ?? []) as any;
  return Array.isArray(list) ? list : [];
}

export async function updateInvestorVacancy(
  payload: UpdateInvestorVacancyDto,
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { id, ...body } = payload;

  const { data } = await api.put<any>(
    "/investor/update-vacancy",
    { id, ...body },
    { signal }
  );

  assertOk(data, "Не удалось обновить вакансию");
  return { ok: true };
}
