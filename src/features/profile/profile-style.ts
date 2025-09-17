import styled from "@emotion/styled";
import userSvg from "/avatar.png";

/* ——— Цвета в стиле LinkedIn 2025 ——— */
const ink = "#0F172A";
const sub = "#667085";
const border = "#E7ECF3";
const bg = "#F7F9FB";
const primary = "#1e5cfb"; // LinkedIn blue
const primaryHover = "rgb(4.0174672489,66.288209607,225.9825327511)";

/* ——— Контейнер и верхняя панель ——— */
export const Wrap = styled.div`
  max-width: 1040px;
  margin: 24px auto 80px;
  padding: 0 20px;
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

/* ——— Профильная карточка ——— */
export const Card = styled.section`
  border: 1px solid ${border};
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
  position: relative;
`;

export const Cover = styled.div`
  height: 160px;
  background: linear-gradient(135deg, ${primary} 0%, #4ca5ff 100%);
  filter: saturate(0.95);
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    height: 120px;
  }
  @media (max-width: 600px) {
    height: 100px;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 20px;
  padding: 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 900px) {
    grid-template-columns: 96px 1fr;
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

export const AvatarWrap = styled.div`
  margin-top: -64px;
  position: relative;
  z-index: 3;

  @media (max-width: 900px) {
    margin-top: -48px;
  }
  @media (max-width: 600px) {
    margin-top: -40px;
  }
`;

export const Avatar = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #eef3f8 url(${userSvg}) center/100% no-repeat;
  box-shadow: 0 6px 24px rgba(2, 32, 71, 0.15);
  position: relative;
  z-index: 3;

  @media (max-width: 760px) {
    width: 96px;
    height: 96px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 800;
  color: ${ink};

  @media (max-width: 900px) {
    font-size: 24px;
  }
  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

export const Subline = styled.div`
  color: ${sub};
  font-size: 15px;
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
  background: ${({ tone }) => (tone === "muted" ? "#F3F6FA" : "#fff")};
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
`;

export const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 16px;
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
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${border};
  background: #fff;
  color: ${ink};
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.06s ease,
    border-color 0.15s ease;
  &:hover {
    box-shadow: 0 8px 22px rgba(16, 24, 40, 0.06);
    border-color: #dfe7f1;
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* ——— Секции ——— */
export const SectionTitle = styled.h2`
  margin: 28px 0 14px;
  font-size: 18px;
  color: ${ink};
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 20px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactCard = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${bg};
  border: 1px solid ${border};
  border-radius: 14px;
  transition: transform 0.06s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(2, 32, 71, 0.06);
    border-color: #dfe7f1;
  }
`;

export const ContactIcon = styled.img`
  width: 26px;
  height: 26px;
  opacity: 0.9;
`;

export const FieldTitle = styled.div`
  font-size: 13px;
  color: ${sub};
`;

export const FieldValue = styled.div`
  font-weight: 600;
  color: ${ink};
`;

/* ——— Дополнительно ——— */
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

/* ——— Скелетоны ——— */
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
