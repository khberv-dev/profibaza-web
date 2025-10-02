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
  // доп. поля
  competitions?: "YES" | "NO";
  inventory?: string;
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
  // доп. поля
  competitions?: "YES" | "NO";
  inventory?: string;
};

// ==== DEMO (портфолио) ====

export type ProfessionDemoRaw = {
  id: string;
  fileId: string;
  comment: string | null;
  workerProfessionId: string;
  createdAt: string;
};

export type ProfessionDemo = {
  id: string;
  url: string; // собран из fileId
  type: "image" | "video";
  createdAt: string;
  comment?: string | null;
  fileId: string;
  workerProfessionId: string;
};

// Сформировать прямую ссылку на файл демо по fileId.
// Если у вас другой роут раздачи файлов — поправьте здесь один раз.
const buildDemoUrl = (fileId?: string | null): string => {
  if (!fileId) return "";
  const base = import.meta.env.VITE_API_URL || "";
  // предположительно файлы отдаются по /files/:fileId — при необходимости поменяй путь
  return `${base.replace(/\/$/, "")}/files/${encodeURIComponent(fileId)}`;
};

const inferMediaType = (fileId: string): "image" | "video" => {
  const id = fileId.toLowerCase();
  return /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(id) ? "video" : "image";
};

// GET /worker/profession/demos/:id
export async function getProfessionDemos(
  workerProfessionId: string,
  signal?: AbortSignal
): Promise<ProfessionDemo[]> {
  const { data } = await api.get<{ ok: boolean; data: ProfessionDemoRaw[] }>(
    `/worker/profession/demos/${encodeURIComponent(workerProfessionId)}`,
    { signal }
  );

  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map((x) => ({
    id: x.id,
    fileId: x.fileId,
    workerProfessionId: x.workerProfessionId,
    createdAt: x.createdAt,
    comment: x.comment,
    url: buildDemoUrl(x.fileId),
    type: inferMediaType(x.fileId),
  }));
}

// POST /worker/profession/upload-demo/:id  (FormData: file)
// вспомогалка: тип по имени файла/типу blob
const inferMediaTypeByFile = (f: File): "image" | "video" => {
  const name = f.name?.toLowerCase() || "";
  const mime = f.type?.toLowerCase() || "";
  const str = `${name} ${mime}`;
  return /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(str) || /video\//.test(str)
    ? "video"
    : "image";
};

// ЗАМЕНИ ЭТУ ФУНКЦИЮ
export async function uploadProfessionDemo(
  workerProfessionId: string,
  file: File,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
): Promise<ProfessionDemo> {
  const form = new FormData();
  form.append("file", file);

  const resp = await api.post<{
    ok?: boolean;
    data?: ProfessionDemoRaw;
    message?: unknown; // {"uz":"Fayl qo'shildi"} и т.п.
  }>(
    `/worker/profession/upload-demo/${encodeURIComponent(workerProfessionId)}`,
    form,
    {
      signal,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (ev) => {
        if (!onProgress || !ev.total) return;
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      },
    }
  );

  const raw = resp?.data?.data;

  // 1) Классический ответ с data
  if (raw?.fileId) {
    return {
      id: raw.id,
      fileId: raw.fileId,
      workerProfessionId: raw.workerProfessionId,
      createdAt: raw.createdAt,
      comment: raw.comment,
      url: buildDemoUrl(raw.fileId),
      type: inferMediaType(raw.fileId),
    };
  }

  // 2) Новый ответ: ok + message (без data). Возвращаем оптимистичный локальный объект
  if (resp?.data?.ok) {
    const localUrl = URL.createObjectURL(file); // ВАЖНО: отревокать позже в UI
    return {
      id: `local-${crypto.randomUUID()}`,
      fileId: "", // серверный появится позже при последующей выборке
      workerProfessionId,
      createdAt: new Date().toISOString(),
      comment: null,
      url: localUrl,
      type: inferMediaTypeByFile(file),
    };
  }

  // 3) Иное — считаем ошибкой
  throw new Error("Не удалось загрузить демо");
}

// POST /worker/profession  (создать)
export async function saveWorkerProfession(
  payload: WorkerProfessionPayload,
  signal?: AbortSignal
): Promise<void> {
  await api.post("/worker/profession", payload, { signal });
}

// PUT /worker/profession/:id  (обновить)
export async function updateWorkerProfession(
  id: string,
  payload: WorkerProfessionPayload,
  signal?: AbortSignal
): Promise<void> {
  await api.put(`/worker/profession/${encodeURIComponent(id)}`, payload, {
    signal,
  });
}

export async function getWorkerProfessions(
  signal?: AbortSignal
): Promise<WorkerProfessionRow[]> {
  const { data } = await api.get<{ ok: boolean; data: WorkerProfessionRow[] }>(
    "/worker/profession",
    { signal }
  );
  return Array.isArray(data?.data) ? data.data : [];
}

// (опционально) получить текущие значения
export type WorkerProfessionState = WorkerProfessionPayload & { id?: string };
export async function getWorkerProfession(
  signal?: AbortSignal
): Promise<WorkerProfessionRow | null> {
  try {
    const list = await getWorkerProfessions(signal);
    return list[0] ?? null;
  } catch {
    return null;
  }
}

// ============= Документы =============
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
