import { pickMessage } from "../../lib/pickMessage";
import { api } from "../api/client";

export async function updateLegalProfile(
  payload: { name: string },
  signal?: AbortSignal
): Promise<{ ok: true }> {
  const { data } = await api.put<any>("/legal/update-profile", payload, {
    signal,
  });

  const ok = data?.ok === true || data?.data?.ok === true;
  if (!ok) {
    const msg =
      pickMessage?.(data?.message) ??
      (typeof data?.message === "string" ? data.message : null) ??
      "Не удалось обновить профиль юр. лица";
    throw new Error(msg);
  }
  return { ok: true };
}
