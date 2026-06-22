import type { SyntheticEvent } from "react";
import { avatarPublicUrl, PUBLIC_CDN } from "./public-url";

export { PUBLIC_CDN };
export const AVATAR_CDN = `${PUBLIC_CDN}avatar/`;
export const ANON_AVATAR = "/avatar.png";

export function avatarUrl(fileId?: string | null): string {
  if (!fileId) return ANON_AVATAR;
  return avatarPublicUrl(fileId);
}

export function onAvatarError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = ANON_AVATAR;
}
