// src/shared/endpoints/activation.ts
import { api } from "../api/client";

/** универсальные «распаковщики» */
const get = <T = any>(x: any, k: string): T | undefined =>
  x?.[k] ?? x?.data?.[k];

const getOk = (x: any): boolean => x?.ok === true || x?.data?.ok === true;

/** 1) запросить активацию — получить transactionId */
export async function requestActivation(
  signal?: AbortSignal
): Promise<{ transactionId: string }> {
  const { data } = await api.post<any>(
    "/user/request-activation",
    {},
    { signal }
  );
  const transactionId = get<string>(data, "transactionId");
  if (!transactionId) throw new Error("Не удалось получить transactionId");
  return { transactionId };
}

/** 2) отправить карту — получить token (OTP уходит в SMS) */
export async function processCard(
  payload: { invoice: string; card: string; expire: string },
  signal?: AbortSignal
) {
  const { data } = await api.post<any>("/pay/process-card", payload, {
    signal,
  });
  // ← бэкенд теперь отдаёт `cardToken` и `phone`
  const token = get<string>(data, "cardToken");
  const phone = get<string>(data, "phone");
  if (!token) throw new Error("Не удалось привязать карту");
  return { token, phone }; // token = cardToken
}

/** 3) подтвердить карту OTP-кодом */
export async function verifyCard(
  payload: { invoice: string; token: string; code: string },
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { data } = await api.post<any>("/pay/verify-card", payload, { signal });
  if (!getOk(data)) throw new Error("Неверный код");
  return { ok: true };
}

/** 4) завершить активацию пользователя */
export async function processActivation(
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { data } = await api.post<any>(
    "/user/process-activation",
    {},
    { signal }
  );
  if (!getOk(data)) throw new Error("Активация не завершена");
  return { ok: true };
}
