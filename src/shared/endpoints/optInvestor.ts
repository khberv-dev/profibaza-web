import { api } from "../api/client";
import { pickMessage } from "../../lib/pickMessage";

export type InvestorContactRow = {
  id: string;
  person?: string | null;
  contact?: string | null; // "+998..."
  type?: string | null; // "PHONE" | "EMAIL" | "TELEGRAM"
};

export type InvestorEmploymentRow = {
  id: string;
  profession?: string | null;
  count?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  employmentType?: string | null;
  workGraph?: string | null;
  projectId?: string | null;
};

export type InvestorProjectRow = {
  id: string;
  status?: string | null; // PLANNED / CONSTRUCTION / LAUNCH / OPERATING
  capacity?: string | null;
  partners?: string[] | null;
  description?: string | null;
  investorId: string;

  employment?: InvestorEmploymentRow[] | null;
};

export type InvestorRow = {
  id: string;
  name: string | null;
  activityType: string | null;
  investmentAmount: number | null;

  address1: string | null;
  address2: string | null;
  address3: string | null;

  userId: string;
  createdAt: string;
  updatedAt: string;

  contacts?: InvestorContactRow[] | null;
  projects?: InvestorProjectRow[] | null;

  // будущие поля (когда добавишь на бек):
  // logoUrl?: string | null;
  // specialists?: { title: string; count?: number; startDate?: string; endDate?: string; employmentType?: string; workGraph?: string; rate?: string; location?: string }[];
  // geo?: { lat: number; lng: number } | null;
};

type Resp = {
  ok: boolean;
  data?: InvestorRow[];
  message?: any;
};

export async function getInvestors(
  signal?: AbortSignal
): Promise<InvestorRow[]> {
  const { data } = await api.get<Resp>("/opt/investor", { signal });

  if (data?.ok !== true) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof (data as any)?.message === "string"
        ? (data as any).message
        : null) ??
      "Не удалось загрузить инвесторов";
    throw new Error(msg);
  }

  return Array.isArray(data?.data) ? (data!.data as InvestorRow[]) : [];
}
