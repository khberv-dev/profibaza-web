export type PublicFolder = "avatar" | "demo" | "document" | "order" | "resume";

export const PUBLIC_CDN =
  import.meta.env.VITE_PUBLIC_CDN || "https://profibaza.uz/public/";

const FOLDERS: PublicFolder[] = [
  "avatar",
  "demo",
  "document",
  "order",
  "resume",
];

function encodePath(name: string): string {
  return name
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function stripKnownFolder(path: string): {
  folder?: PublicFolder;
  name: string;
} {
  const clean = path.replace(/^\/+/, "");
  for (const folder of FOLDERS) {
    const prefix = `${folder}/`;
    if (clean.startsWith(prefix)) {
      return { folder, name: clean.slice(prefix.length) };
    }
  }
  return { name: clean };
}

export function publicFileUrl(
  fileId?: string | null,
  folder: PublicFolder = "order"
): string {
  if (!fileId) return "";
  const raw = String(fileId).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const { folder: embeddedFolder, name } = stripKnownFolder(raw);
  if (!name) return "";

  const targetFolder = embeddedFolder ?? folder;
  return `${PUBLIC_CDN}${targetFolder}/${encodePath(name)}`;
}

export const avatarPublicUrl = (fileId?: string | null) =>
  publicFileUrl(fileId, "avatar");

export const demoPublicUrl = (fileId?: string | null) =>
  publicFileUrl(fileId, "demo");

export const documentPublicUrl = (fileId?: string | null) =>
  publicFileUrl(fileId, "document");

export const orderPublicUrl = (fileId?: string | null) =>
  publicFileUrl(fileId, "order");

export const resumePublicUrl = (fileId?: string | null) =>
  publicFileUrl(fileId, "resume");
