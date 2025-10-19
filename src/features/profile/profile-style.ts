// profile-style.ts
import styled from "@emotion/styled";
import userSvg from "/avatar.png";

/* палитра — спокойная, без кислотных акцентов */
const ink = "#0F172A";
const sub = "#667085";
const border = "#E7ECF3";
const bg = "#FCFDFE";
const primary = "#1E5CFB";
const primaryHover = "#194DDA";

/* контейнер */
export const Wrap = styled.div`
  margin: 24px auto 80px;
  // padding: 0 20px;
  max-width: 1800px;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Crumb = styled.div`
  color: #9aa1ab;
  font-size: 14px;
  span {
    color: ${ink};
  }
`;

/* карточка без Cover */
export const Card = styled.section`
  border: 1px solid ${border};
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(2, 32, 71, 0.06);
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 20px;
  padding: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
    gap: 14px;
  }
`;

export const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 24px;
  border: 2px solid ${border};
  background: #f1f5f9 url(${userSvg}) center/100% no-repeat;
`;

export const Info = styled.div`
  display: grid;
  gap: 8px;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 800;
  color: ${ink};

  @media (max-width: 720px) {
    font-size: 22px;
  }
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const CompanyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  // background: #f2f6ff; /* нежно-синий фон */
  color: #000; /* тёмно-синий текст */
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.02em;
  line-height: 1;

  /* SVG отдельно окрашиваем */
  svg {
    color: #0070ff;
    flex-shrink: 0;
  }
`;

export const Subline = styled.div`
  color: ${sub};
  font-size: 14px;
`;

export const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Badge = styled.span<{ tone?: "muted" | "solid" }>`
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${border};
  color: ${({ tone }) => (tone === "muted" ? sub : ink)};
  background: ${({ tone }) => (tone === "muted" ? "#F5F7FB" : "#fff")};
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 720px) {
    justify-content: center;
  }
`;

export const PrimaryBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${primary};
  background: ${primary};
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.06s ease;
  &:hover {
    background: ${primaryHover};
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const GhostBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${border};
  background: #fff;
  color: ${ink};
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.06s ease;
  &:hover {
    border-color: #dfe7f1;
    box-shadow: 0 6px 16px rgba(2, 32, 71, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* секции */
export const SectionTitle = styled.h2`
  margin: 24px 0 12px;
  font-size: 18px;
  color: ${ink};
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactCard = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f1f4f9;
  border-radius: 12px;
  transition: box-shadow 0.15s ease, transform 0.06s ease,
    border-color 0.15s ease;
  &:hover {
    transform: translateY(-1px);
    // box-shadow: 0 10px 22px rgba(2, 32, 71, 0.06);
    // border-color: #dfe7f1;
  }
`;

export const ContactIcon = styled.img`
  width: 22px;
  height: 22px;
  opacity: 0.9;
`;

export const FieldTitle = styled.div`
  font-size: 12px;
  color: ${sub};
`;

export const FieldValue = styled.div`
  font-weight: 600;
  color: ${ink};
`;

export const AddLink = styled.a`
  color: ${primary};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

export const Notice = styled.div<{ tone?: "error" | "info" }>`
  margin: 14px 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ tone }) => (tone === "error" ? "#FEE2E2" : border)};
  background: ${({ tone }) => (tone === "error" ? "#FEF2F2" : "#F9FAFB")};
  color: ${({ tone }) => (tone === "error" ? "#B91C1C" : ink)};
`;

/* скелетон */
export const SkeletonLine = styled.span<{ w?: number }>`
  display: inline-block;
  height: 14px;
  width: ${({ w }) => (w ? `${w}px` : "120px")};
  border-radius: 6px;
  background: linear-gradient(90deg, #eef2f6, #f6f8fb, #eef2f6);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
