// src/shared/modules/investor/endpoints/investor.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";
import { clientApi, UpdateAddressDto } from "./client";

export type InvestorContact = {
  id?: string;
  type?: string; // например: "PHONE" | "EMAIL" | "TELEGRAM"
  value?: string; // "+998..."
  label?: string; // "Основной"
};

export type InvestorMe = {
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

  contacts: InvestorContact[];
};

type InvestorMeResp = {
  ok: boolean;
  data?: InvestorMe | null;
  message?: any;
};

export async function getInvestorMe(
  signal?: AbortSignal
): Promise<InvestorMe | null> {
  const { data } = await api.get<InvestorMeResp>("/investor/me", { signal });

  const ok = data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof (data as any)?.message === "string"
        ? (data as any).message
        : null) ??
      "Не удалось загрузить профиль инвестора";
    throw new Error(msg);
  }

  return (data?.data ?? null) as InvestorMe | null;
}

export const INVESTOR_ME_QK = ["investor", "me"] as const;

export const useInvestorMe = (enabled: boolean) =>
  useQuery({
    queryKey: INVESTOR_ME_QK,
    queryFn: ({ signal }) => getInvestorMe(signal), // ✅ важно: пробрасываем signal
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

export const useUpdateInvestorAddress = () =>
  useMutation({
    mutationFn: (dto: UpdateAddressDto) => clientApi.updateAddressInvestor(dto),
  });
