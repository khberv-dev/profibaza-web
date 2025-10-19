// shared/modules/experience.ts
import { api } from "../api/client";

export type WorkerExperienceItem = {
  jobPlace: string;
  jobDescription: string;
  startedAt: number; // целое
  endedAt?: number | null; // целое | null
};

export type ExperiencePayload = {
  jobPlace: string;
  jobDescription?: string;
  startedAt: number; // год
  endedAt?: number; // год или undefined (н.в.)
};

// ➜ отправляем ОДИН объект, не массив
export async function postWorkerExperience(
  workerProfessionId: string,
  item: WorkerExperienceItem
): Promise<boolean> {
  const body = {
    jobPlace: String(item.jobPlace ?? "").trim(),
    jobDescription: String(item.jobDescription ?? "").trim(),
    startedAt: Number(item.startedAt),
    ...(item.endedAt != null && item.endedAt !== 0
      ? { endedAt: Number(item.endedAt) }
      : {}),
  };

  const { data } = await api.post<{ ok: boolean; message?: any }>(
    `/worker/profession/${workerProfessionId}/experience`,
    body
  );

  if (!data?.ok) {
    let msg = "Не удалось сохранить опыт";
    const m = data?.message;
    if (typeof m === "string") msg = m;
    else if (m && typeof m === "object") {
      msg = m.ru || m.uz || Object.values(m)[0] || msg;
    }
    throw new Error(msg);
  }
  return true;
}

export async function putWorkerExperience(
  experienceId: string,
  body: ExperiencePayload
) {
  const { data } = await api.put(
    `/worker/profession/experience/${experienceId}`,
    body
  );
  return data;
}
