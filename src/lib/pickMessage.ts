// src/shared/lib/pickMessage.ts
export function pickMessage(msg: unknown): string {
  if (!msg) return "Произошла ошибка";
  if (typeof msg === "string") return msg;

  // Популярные формы: {ru, en, uz}
  if (typeof msg === "object") {
    const anyMsg = msg as Record<string, unknown>;
    for (const k of ["ru", "en", "uz", "message", "error", "detail"]) {
      const val = anyMsg?.[k];
      if (typeof val === "string") return val;
    }
    // на крайний случай:
    try {
      return JSON.stringify(msg);
    } catch {
      return "Неизвестная ошибка";
    }
  }
  return String(msg);
}
