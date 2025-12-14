import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";
import { ProjectCapacity, EmploymentType, WorkGraph } from "./investorProjects";

/* ===================== DTO ===================== */

export type CreateInvestorProjectEmploymentDto = {
  profession: string;
  count: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  employmentType: EmploymentType;
  workGraph: WorkGraph;
};

export type CreateInvestorProjectDto = {
  capacity: ProjectCapacity; // SMALL | MIDDLE | LARGE
  partners: string[]; // ["Akfa"]
  description: string;
  employment: CreateInvestorProjectEmploymentDto[];
};

/* ===================== API ===================== */

type CreateInvestorProjectResp =
  | { ok: true }
  | { ok: true; data: { ok: true } }
  | any;

export async function createInvestorProject(
  payload: CreateInvestorProjectDto,
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { data } = await api.post<CreateInvestorProjectResp>(
    "/investor/projects",
    payload,
    { signal }
  );

  const ok = data?.ok === true || data?.data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof data?.message === "string" ? data.message : null) ??
      "Не удалось создать проект инвестора";
    throw new Error(msg);
  }

  return { ok: true };
}
