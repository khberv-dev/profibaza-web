import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { User } from "lucide-react";
import { avatarUrl, onAvatarError, ANON_AVATAR } from "../shared/lib/avatar";

type OrderAvatarProps = {
  fileId?: string | null;
  initials?: ReactNode;
  variant?: "client" | "worker";
};

export function OrderAvatar({
  fileId,
  initials,
  variant = "client",
}: OrderAvatarProps) {
  if (fileId) {
    return (
      <AvatarImg
        $variant={variant}
        src={avatarUrl(fileId)}
        alt=""
        onError={onAvatarError}
      />
    );
  }

  return (
    <AvatarFallback $variant={variant}>
      {initials ?? <User size={18} />}
    </AvatarFallback>
  );
}

const AvatarImg = styled.img<{ $variant: "client" | "worker" }>`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  border: 1px solid #e7ecf3;
  background: #f8fafc url(${ANON_AVATAR}) center/cover no-repeat;

  @media (max-width: 920px) {
    width: 64px;
    height: 64px;
    border-radius: ${({ $variant }) => ($variant === "worker" ? "18px" : "20px")};
  }

  @media (max-width: 520px) {
    width: 52px;
    height: 52px;
    border-radius: 16px;
  }
`;

const AvatarFallback = styled.div<{ $variant: "client" | "worker" }>`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  border: 1px solid #e7ecf3;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: linear-gradient(180deg, #eef2ff, #f8fafc);
  font-weight: ${({ $variant }) => ($variant === "worker" ? 800 : 900)};
  color: ${({ $variant }) => ($variant === "worker" ? "#95a3b5" : "#1e40af")};
  font-size: ${({ $variant }) => ($variant === "worker" ? "32px" : "18px")};

  @media (max-width: 920px) {
    width: 64px;
    height: 64px;
    border-radius: ${({ $variant }) => ($variant === "worker" ? "18px" : "20px")};
    font-size: ${({ $variant }) => ($variant === "worker" ? "22px" : "16px")};
  }

  @media (max-width: 520px) {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    font-size: 18px;
  }
`;
