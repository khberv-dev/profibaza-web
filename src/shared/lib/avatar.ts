import type { SyntheticEvent } from "react";

export const AVATAR_CDN = "https://profibaza.uz/public/avatar/";
export const ANON_AVATAR = "/avatar.png";

export function avatarUrl(fileId?: string | null): string {
  if (!fileId) return ANON_AVATAR;
  return `${AVATAR_CDN}${encodeURIComponent(fileId)}`;
}

export function onAvatarError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = ANON_AVATAR;
}
