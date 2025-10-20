import { api } from "../api/client";

// ============= Professions =============
export type Profession = {
  id: string;
  nameRu: string;
  nameUz: string;
};

export type JobType = "SOLO" | "EMPLOYEE" | "ABROAD";

export type ServiceLocation = {
  longitude: number;
  latitude: number;
  radius: number;
};

// 🔹 новое: "проводной" тип для отправки на бэкенд (все строки)
export type ServiceLocationWire = {
  longitude: string;
  latitude: string;
  radius: number;
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

  jobType: JobType;
  locations: ServiceLocation[];

  competitions?: "YES" | "NO";
  inventory?: string;
  schedule: WeekSchedule;
};

export type WorkerProfessionWirePayload = Omit<
  WorkerProfessionPayload,
  "locations"
> & {
  locations: ServiceLocationWire[];
};

export type WorkerExperienceRow = {
  id: string;
  startedAt: number;
  endedAt?: number | null;
  jobPlace: string;
  jobDescription: string;
  workerProfessionId: string;
  createdAt: string;
  updatedAt: string;
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
  schedule?: WeekSchedule | null;
  jobType?: JobType | null;
  locations?: ServiceLocation[] | null;
  experience?: WorkerExperienceRow[];
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

export type WeekSchedule = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
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

export async function finishWorkerOrder(orderId: string) {
  // body пустой по ТЗ
  const { data } = await api.post(`/worker/finish-order/${orderId}`, {});
  return data;
}

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
  payload: WorkerProfessionWirePayload,
  signal?: AbortSignal
) {
  const { data } = await api.post("/worker/profession", payload, { signal });
  return data;
}

type CleanWeekSchedule = Pick<
  WeekSchedule,
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
>;

function sanitizeSchedule(input: unknown): CleanWeekSchedule | undefined {
  if (!input || typeof input !== "object") return undefined;
  const src = input as Record<string, unknown>;

  const out: Partial<CleanWeekSchedule> = {
    monday: typeof src.monday === "boolean" ? src.monday : undefined,
    tuesday: typeof src.tuesday === "boolean" ? src.tuesday : undefined,
    wednesday: typeof src.wednesday === "boolean" ? src.wednesday : undefined,
    thursday: typeof src.thursday === "boolean" ? src.thursday : undefined,
    friday: typeof src.friday === "boolean" ? src.friday : undefined,
    saturday: typeof src.saturday === "boolean" ? src.saturday : undefined,
    sunday: typeof src.sunday === "boolean" ? src.sunday : undefined,
  };

  // если ни одного валидного ключа не осталось — не отправляем schedule вовсе
  return Object.values(out).some((v) => typeof v === "boolean")
    ? (out as CleanWeekSchedule)
    : undefined;
}

export async function updateWorkerProfession(
  id: string,
  payload: WorkerProfessionWirePayload,
  signal?: AbortSignal
) {
  // 1) убираем locations полностью
  const {
    locations: _omitLocations,
    schedule,
    ...rest
  } = (payload ?? {}) as WorkerProfessionWirePayload;

  // 2) чистим schedule — оставляем только boolean-дни недели
  const safeSchedule = sanitizeSchedule(schedule);

  // 3) собираем тело без locations и без лишних полей в schedule
  const body = safeSchedule ? { ...rest, schedule: safeSchedule } : { ...rest };

  const { data } = await api.put(
    `/worker/profession/${encodeURIComponent(id)}`,
    body,
    { signal }
  );
  return data;
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


export function getWorkerResumeUrl(workerProfessionId: string): string {
  const base = import.meta.env.VITE_API_URL || "";
  return `${base.replace(/\/$/, "")}/worker/download-resume/${encodeURIComponent(
    workerProfessionId
  )}`;
}


export async function downloadWorkerResume(
  workerProfessionId: string,
  filename?: string
) {
  if (!workerProfessionId) throw new Error("workerProfessionId is required");

  // Если api клиент уже подставляет baseURL — можно дернуть относительный путь:
  // const { data, headers } = await api.get(
  //   `/worker/download-resume/${encodeURIComponent(workerProfessionId)}`,
  //   { responseType: "blob" }
  // );

  // Универсально (и одинаково с build*Url-хелперами):
  const url = getWorkerResumeUrl(workerProfessionId);
  const { data, headers } = await api.get(url, { responseType: "blob" });

  // Пытаемся вытащить имя из заголовка, если сервер его отдает
  let suggested =
    headers?.["content-disposition"]?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/)?.[1] ||
    "";

  try {
    // декод, если было filename*=UTF-8''
    suggested = decodeURIComponent(suggested);
  } catch (_) {}

  const extFromMime = (() => {
    const ct = (headers?.["content-type"] as string | undefined)?.toLowerCase() || "";
    if (ct.includes("pdf")) return "pdf";
    if (ct.includes("msword")) return "doc";
    if (ct.includes("officedocument.wordprocessingml")) return "docx";
    return "bin";
  })();

  const safeName =
    filename ||
    (suggested && suggested.trim()) ||
    `worker-resume-${workerProfessionId}.${extFromMime}`;

  const blob = new Blob([data]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
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
