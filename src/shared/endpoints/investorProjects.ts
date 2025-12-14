// src/shared/endpoints/investorProjects.ts
import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";

export type ProjectCapacity = "SMALL" | "MIDDLE" | "LARGE";
export type EmploymentType = "EMPLOYEE" | "FREELANCE" | "CONTRACT";
export type WorkGraph = "FULLTIME" | "PARTTIME" | "FLEX";

export type InvestorProjectEmployment = {
  id: string;
  profession: string;
  count: number;
  startDate: string; // ISO
  endDate: string; // ISO
  employmentType: EmploymentType;
  workGraph: WorkGraph;
  projectId: string;
};

export type InvestorProjectStatus = "PLANNED" | "ACTIVE" | "DONE";

export type InvestorProject = {
  id: string;
  status: InvestorProjectStatus;
  capacity: ProjectCapacity;
  partners: string[];
  description: string | null;
  investorId: string;
  employment: InvestorProjectEmployment[];
};

// API иногда возвращает data внутри data — учитываем оба кейса
type InvestorProjectsResp =
  | { ok: true; data: InvestorProject[] }
  | { ok: true; data: { ok: true; data: InvestorProject[] } }
  | any;

export async function getInvestorProjects(
  signal?: AbortSignal
): Promise<InvestorProject[]> {
  const { data } = await api.get<InvestorProjectsResp>("/investor/projects", {
    signal,
  });

  const ok = data?.ok === true || data?.data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof data?.message === "string" ? data.message : null) ??
      "Не удалось загрузить проекты инвестора";
    throw new Error(msg);
  }

  // вытаскиваем массив проектов в любом из форматов
  const list: InvestorProject[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  return list;
}
