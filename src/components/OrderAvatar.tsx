import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { User } from "lucide-react";
import { avatarUrl, onAvatarError, ANON_AVATAR } from "../shared/lib/avatar";

type OrderAvatarProps = {
  fileId?: string | null;
  initials?: ReactNode;
  variant?: "client" | "worker";
  size?: "default" | "compact";
};

export function OrderAvatar({
  fileId,
  initials,
  variant = "client",
  size = "default",
}: OrderAvatarProps) {
  if (fileId) {
    return (
      <AvatarImg
        $variant={variant}
        $size={size}
        src={avatarUrl(fileId)}
        alt=""
        onError={onAvatarError}
      />
    );
  }

  return (
    <AvatarFallback $variant={variant} $size={size}>
      {initials ?? <User size={size === "compact" ? 16 : 18} />}
    </AvatarFallback>
  );
}

const avatarSizes = {
  default: {
    base: { w: 96, h: 96, r: 24, fs: 18 },
    md: { w: 64, h: 64, r: 18, fs: 16 },
    sm: { w: 52, h: 52, r: 16, fs: 14 },
  },
  compact: {
    base: { w: 56, h: 56, r: 14, fs: 15 },
    md: { w: 52, h: 52, r: 12, fs: 14 },
    sm: { w: 48, h: 48, r: 12, fs: 13 },
  },
  worker: {
    base: { w: 96, h: 96, r: 24, fs: 32 },
    md: { w: 64, h: 64, r: 18, fs: 22 },
    sm: { w: 48, h: 48, r: 12, fs: 16 },
  },
  workerCompact: {
    base: { w: 56, h: 56, r: 14, fs: 18 },
    md: { w: 52, h: 52, r: 12, fs: 16 },
    sm: { w: 48, h: 48, r: 12, fs: 14 },
  },
} as const;

function pickSizes(variant: "client" | "worker", size: "default" | "compact") {
  if (variant === "worker") {
    return size === "compact" ? avatarSizes.workerCompact : avatarSizes.worker;
  }
  return size === "compact" ? avatarSizes.compact : avatarSizes.default;
}

const AvatarImg = styled.img<{
  $variant: "client" | "worker";
  $size: "default" | "compact";
}>`
  width: ${({ $variant, $size }) => pickSizes($variant, $size).base.w}px;
  height: ${({ $variant, $size }) => pickSizes($variant, $size).base.h}px;
  border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).base.r}px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  border: 1px solid #e7ecf3;
  background: #f8fafc url(${ANON_AVATAR}) center/cover no-repeat;

  @media (max-width: 920px) {
    width: ${({ $variant, $size }) => pickSizes($variant, $size).md.w}px;
    height: ${({ $variant, $size }) => pickSizes($variant, $size).md.h}px;
    border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).md.r}px;
  }

  @media (max-width: 640px) {
    width: ${({ $variant, $size }) => pickSizes($variant, $size).sm.w}px;
    height: ${({ $variant, $size }) => pickSizes($variant, $size).sm.h}px;
    border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).sm.r}px;
  }
`;

const AvatarFallback = styled.div<{
  $variant: "client" | "worker";
  $size: "default" | "compact";
}>`
  width: ${({ $variant, $size }) => pickSizes($variant, $size).base.w}px;
  height: ${({ $variant, $size }) => pickSizes($variant, $size).base.h}px;
  border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).base.r}px;
  border: 1px solid #e7ecf3;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(180deg, #eef2ff, #f8fafc);
  font-weight: ${({ $variant }) => ($variant === "worker" ? 800 : 700)};
  color: ${({ $variant }) => ($variant === "worker" ? "#95a3b5" : "#1e40af")};
  font-size: ${({ $variant, $size }) => pickSizes($variant, $size).base.fs}px;

  @media (max-width: 920px) {
    width: ${({ $variant, $size }) => pickSizes($variant, $size).md.w}px;
    height: ${({ $variant, $size }) => pickSizes($variant, $size).md.h}px;
    border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).md.r}px;
    font-size: ${({ $variant, $size }) => pickSizes($variant, $size).md.fs}px;
  }

  @media (max-width: 640px) {
    width: ${({ $variant, $size }) => pickSizes($variant, $size).sm.w}px;
    height: ${({ $variant, $size }) => pickSizes($variant, $size).sm.h}px;
    border-radius: ${({ $variant, $size }) => pickSizes($variant, $size).sm.r}px;
    font-size: ${({ $variant, $size }) => pickSizes($variant, $size).sm.fs}px;
  }
`;
