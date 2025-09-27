import { api } from "../api/client";

// ============= Professions =============
export type Profession = {
  id: string;
  nameRu: string;
  nameUz: string;
};

export async function getProfessions(
  signal?: AbortSignal
): Promise<Profession[]> {
  const { data } = await api.get<{ ok: boolean; data: Profession[] }>(
    "/opt/professions",
    { signal }
  );
  return Array.isArray(data?.data) ? data.data : [];
}

// ============= Worker Profession =============
export type WorkerProfessionPayload = {
  professionId: string;
  minPrice: number;
  maxPrice: number;
  hasTeam: boolean;
  teamMemberCount: number;
  readyForHugeProject: boolean;
};

export type WorkerProfessionRow = {
  id: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  hasTeam: boolean;
  teamMemberCount: number;
  readyForHugeProject: boolean;
  workerId: string;
  professionId: string;
  createdAt: string;
  updatedAt: string;
};

// Сохранить/обновить
export async function saveWorkerProfession(
  payload: WorkerProfessionPayload,
  signal?: AbortSignal
): Promise<void> {
  await api.post("/worker/profession", payload, { signal });
}

// (опционально) получить текущие значения, если бэкенд это поддерживает
export type WorkerProfessionState = WorkerProfessionPayload & { id?: string };
export async function getWorkerProfession(
  signal?: AbortSignal
): Promise<WorkerProfessionRow | null> {
  try {
    const { data } = await api.get<{
      ok: boolean;
      data: WorkerProfessionRow[];
    }>("/worker/profession", { signal });

    if (Array.isArray(data?.data) && data.data.length > 0) {
      return data.data[0]; // берём первую запись
    }
    return null;
  } catch {
    return null;
  }
}

// ============= Документы (как у тебя было) =============
export type WorkerDocRaw = {
  id: string;
  fileId: string;
  type: string;
  clientId: string | null;
  legalId: string | null;
  workerId: string;
  createdAt: string;
  updatedAt: string;
};

export type UploadedDoc = {
  id: string;
  name: string | null;
  size: number | null;
  url: string | null;
  type?: string;
  createdAt?: string;
  // удобный доступ к fileId для скачки
  fileId?: string | null;
};

const buildFileUrl = (fileId?: string | null): string | null => {
  if (!fileId) return null;
  const base = import.meta.env.VITE_API_URL || "";
  return `${base.replace(/\/$/, "")}/worker/documents/${encodeURIComponent(
    fileId
  )}`;
};

export async function getWorkerDocuments(
  signal?: AbortSignal
): Promise<UploadedDoc[]> {
  const { data } = await api.get<{ ok: boolean; data: WorkerDocRaw[] }>(
    "/worker/documents",
    { signal }
  );
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map((d) => ({
    id: d.id,
    name: null,
    size: null,
    url: buildFileUrl(d.fileId),
    type: d.type,
    createdAt: d.createdAt,
    fileId: d.fileId,
  }));
}

export async function uploadWorkerDocument(
  file: File,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
): Promise<UploadedDoc> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post<{
    ok?: boolean;
    data?: WorkerDocRaw;
    id?: string;
    fileId?: string;
  }>("/worker/upload-document", form, {
    signal,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (ev) => {
      if (!onProgress || !ev.total) return;
      onProgress(Math.round((ev.loaded / ev.total) * 100));
    },
  });

  const raw: Partial<WorkerDocRaw> | undefined = data?.data || data;
  return {
    id: String(raw?.id || crypto.randomUUID()),
    name: file.name ?? null,
    size: file.size ?? null,
    url: buildFileUrl(raw?.fileId),
    type: (raw as any)?.type,
    createdAt: (raw as any)?.createdAt,
    fileId: raw?.fileId ?? null,
  };
}

// удобная скачка по fileId (GET /worker/documents/:fileId)
export async function downloadWorkerDocument(
  fileId: string,
  filename?: string
) {
  const url = buildFileUrl(fileId);
  if (!url) return;

  const res = await api.get(url, { responseType: "blob" });
  const blob = new Blob([res.data]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename || fileId;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
