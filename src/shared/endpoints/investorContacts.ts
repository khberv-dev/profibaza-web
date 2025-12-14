// src/shared/modules/investor/endpoints/investorContacts.ts
import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";

export type InvestorContactType = "PHONE" | "EMAIL";

export type CreateInvestorContactDto = {
  person: string;
  contact: string;
  type: InvestorContactType;
};

type Resp = { ok: boolean; data?: any; message?: any };

export async function createInvestorContact(
  payload: CreateInvestorContactDto,
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { data } = await api.post<Resp>("/investor/contacts", payload, {
    signal,
  });

  const ok = data?.ok === true || data?.data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof (data as any)?.message === "string"
        ? (data as any).message
        : null) ??
      "Не удалось добавить контакт";
    throw new Error(msg);
  }
  return { ok: true };
}
