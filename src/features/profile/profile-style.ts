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
    justify-items: center;
    text-align: center;
    gap: 14px;
    padding: 16px;
  }
`;
export const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 720px) {
    width: 100%;
  }
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
  min-width: 0; /* важно для ellipsis */

  @media (max-width: 720px) {
    width: 100%;
    justify-items: center; /* ✅ центр */
  }
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
  min-width: 0;

  @media (max-width: 720px) {
    width: 100%;
    justify-content: center; /* ✅ центр */
  }

  /* имя не ломает верстку */
  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;


export const CompanyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  color: #000;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.02em;
  line-height: 1;
  max-width: 100%;
  min-width: 0;

  /* ✅ чтобы длинное название не вылазило */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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

  @media (max-width: 720px) {
    justify-content: center; /* ✅ центр */
  }
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
    width: 100%;
    justify-content: center; /* ✅ центр */
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

  @media (max-width: 720px) {
    width: 100%;
    max-width: 360px; /* чтобы не растягивалось на планшетах */
    justify-content: center;
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

  @media (max-width: 720px) {
    width: 100%;
    max-width: 360px;
  }
`;


export const LogoutBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid ${border};
  background: #fff;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
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

/* ===== Profile page layout ===== */
const TOKENS = {
  maxw: "1200px",
  pageBg: "#ffffff",
  radiusLg: "8px",
  radiusMd: "6px",
  radiusSm: "6px",
  line: "#E5E7EB",
  lineSoft: "#F3F4F6",
  cardBg: "#FFFFFF",
  panelBg: "#FAFAFA",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#1E5CFB",
  primaryDark: "#174CDF",
};

export const ProfilePageWrap = styled.div`
  background: ${TOKENS.pageBg};
  min-height: 100%;
  overflow-x: clip;
`;

export const ProfileShell = styled.div`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
  padding: 24px 24px 48px;

  @media (max-width: 640px) {
    padding: 0 0 24px;
  }
`;

export const ProfileTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${TOKENS.lineSoft};

  @media (max-width: 640px) {
    margin-bottom: 12px;
    padding: 14px 16px 12px;
    border-bottom: none;
  }
`;

export const ProfilePageTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: ${TOKENS.text};
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const ProfileMain = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 10px;
  }
`;

export const ProfileCard = styled.section`
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.radiusLg};
  overflow: visible;
  position: relative;
  z-index: 0;

  @media (max-width: 640px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const ProfileDropdownCard = styled(ProfileCard)`
  z-index: 1;
`;

export const ProfileOutlineBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: ${TOKENS.radiusSm};
  border: 1px solid ${TOKENS.line};
  background: ${TOKENS.cardBg};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${TOKENS.text};
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${TOKENS.panelBg};
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

export const ProfilePrimaryBtn = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: ${TOKENS.radiusSm};
  border: 1px solid ${TOKENS.primary};
  background: ${TOKENS.primary};
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${TOKENS.primaryDark};
    border-color: ${TOKENS.primaryDark};
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

export const ProfileHero = styled.div`
  padding: 24px;
  display: grid;
  gap: 20px;

  @media (max-width: 640px) {
    padding: 20px 16px 16px;
    gap: 14px;
  }
`;

export const ProfileHeroTop = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 14px;
  }
`;

export const ProfileAvatarWrap = styled.div`
  flex-shrink: 0;
`;

export const ProfileAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${TOKENS.radiusMd};
  object-fit: cover;
  border: 1px solid ${TOKENS.line};
  background: #f9fafb url("/avatar.png") center/cover no-repeat;
  cursor: pointer;
  display: block;

  @media (max-width: 640px) {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
`;

export const ProfileAvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${TOKENS.radiusMd};
  border: 1px solid ${TOKENS.line};
  background: #f9fafb url("/avatar.png") center/cover no-repeat;
  cursor: pointer;

  @media (max-width: 640px) {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
`;

export const ProfileHeroContent = styled.div`
  min-width: 0;
  display: grid;
  gap: 12px;

  @media (max-width: 640px) {
    width: 100%;
    justify-items: center;
  }
`;

export const ProfileHeroHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
  }
`;

export const ProfileHeroIdentity = styled.div`
  min-width: 0;
  display: grid;
  gap: 4px;

  @media (max-width: 640px) {
    justify-items: center;
  }
`;

export const ProfileName = styled.h2`
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: ${TOKENS.text};
  font-weight: 600;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const ProfileSubtitle = styled.p`
  margin: 0;
  font-size: 15px;
  color: ${TOKENS.textMuted};
  font-weight: 400;
  line-height: 1.45;
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const ProfileHeroToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    a {
      display: block;
      min-width: 0;
    }

    button {
      width: 100%;
      max-width: none;
      height: 38px;
      justify-content: center;
      font-size: 13px;
      padding: 0 10px;
    }
  }
`;

export const ProfileHeroBtn = styled(ProfilePrimaryBtn)`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const ProfileHeroOutlineBtn = styled(ProfileOutlineBtn)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const ProfileHeroLogoutBtn = styled(LogoutBtn)`
  @media (max-width: 640px) {
    width: 100%;
    max-width: none;
    height: 38px;
    font-size: 13px;
    padding: 0 10px;
  }
`;

export const ProfileHeroDivider = styled.div`
  height: 1px;
  background: ${TOKENS.lineSoft};
`;

export const ProfileHeroMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 24px;
  padding: 18px 20px;
  border-radius: ${TOKENS.radiusMd};
  background: ${TOKENS.primary};

  @media (max-width: 960px) and (min-width: 641px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 4px 14px;
    border-radius: 12px;
  }
`;

export const ProfileHeroMetaItem = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;

  .label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.78);
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    word-break: break-word;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);

    .label {
      flex-shrink: 0;
      font-size: 12px;
    }

    .value {
      font-size: 14px;
      text-align: right;
    }

    &:last-of-type {
      border-bottom: none;
    }
  }
`;

export const ProfileHeroHint = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${TOKENS.textMuted};

  @media (max-width: 640px) {
    text-align: center;
    font-size: 12px;
  }
`;

/* legacy aliases */
export const ProfileSummary = ProfileHero;
export const ProfileSummaryBody = ProfileHeroContent;
export const ProfileRole = ProfileSubtitle;
export const ProfileRoleBadge = ProfileSubtitle;
export const ProfileCompanyLine = ProfileSubtitle;
export const ProfileMetaGrid = ProfileHeroMeta;
export const ProfileMetaRow = ProfileHeroMetaItem;
export const ProfileHeroMain = ProfileHeroContent;
export const ProfileHeroMetaPanel = ProfileHeroMeta;
export const ProfileHeroActions = ProfileHeroToolbar;
export const ProfileAvatarOverlay = styled.div` display: none; `;
export const ProfileLayout = styled.div`
  display: grid;
  gap: 16px;
`;
export const ProfileSidebar = styled.aside` display: none; `;

export const ProfileCardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid ${TOKENS.lineSoft};

  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 14px 16px 10px;
    border-bottom: none;
  }
`;

export const ProfileCardTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${TOKENS.text};
`;

export const ProfileCardTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const ProfileSectionIcon = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${TOKENS.panelBg};
  border: 1px solid ${TOKENS.lineSoft};
  color: ${TOKENS.primary};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ProfileCardSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${TOKENS.textMuted};
  font-weight: 400;
  line-height: 1.45;

  @media (max-width: 640px) {
    font-size: 12px;
    margin-top: 2px;
  }
`;

export const ProfileCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    margin-left: auto;

    button {
      height: 34px;
      padding: 0 12px;
      font-size: 13px;
      white-space: nowrap;
    }
  }
`;

export const ProfileCardBody = styled.div`
  padding: 20px 24px 24px;

  @media (max-width: 640px) {
    padding: 0 16px 16px;
  }
`;

export const ProfilePanel = styled(ProfileCardBody)``;

export const ProfileFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

export const ProfileField = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 4px;
    padding: 12px 0;
    border-bottom: 1px solid ${TOKENS.lineSoft};

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-of-type {
      padding-top: 4px;
    }
  }
`;

export const ProfileFieldLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${TOKENS.textMuted};

  @media (max-width: 640px) {
    font-size: 12px;
    gap: 6px;
  }
`;

export const ProfileFieldIcon = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${TOKENS.panelBg};
  border: 1px solid ${TOKENS.lineSoft};
  color: ${TOKENS.textMuted};

  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: 640px) {
    width: 26px;
    height: 26px;
    border-radius: 5px;

    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

export const ProfileFieldValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${TOKENS.text};
  word-break: break-word;
  line-height: 1.45;

  @media (max-width: 640px) {
    font-size: 15px;
    padding-left: 32px;
  }
`;

export const ProfileDetailGrid = ProfileFormGrid;
export const ProfileDetailItem = ProfileField;

export const ProfileSidebarCard = styled.div``;
export const ProfileSidebarBlock = styled.div``;
export const ProfileSidebarTitle = styled.h4``;

export const ProfileInfoList = styled.dl`
  margin: 0;
  display: grid;
  gap: 0;
`;

export const ProfileInfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${TOKENS.lineSoft};
  font-size: 14px;

  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }

  dt {
    margin: 0;
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }

  dd {
    margin: 0;
    color: ${TOKENS.text};
    font-weight: 500;
    word-break: break-word;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

export const ProfileTimeline = ProfileInfoList;
export const ProfileTimelineItem = styled.div`
  display: contents;
`;

export const ProfileActionStack = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ProfileAddressLine = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${TOKENS.text};
  line-height: 1.5;
  word-break: break-word;
`;

export const ProfileAddressSub = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: ${TOKENS.textMuted};
`;

export const ProfileSelectRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  position: relative;
  z-index: 2;
  overflow: visible;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileProSection = styled.section`
  width: 100%;
  min-width: 0;
`;

export const ProfileTabs = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid ${TOKENS.line};

  @media (max-width: 640px) {
    margin-bottom: 0;
    padding: 0 12px;
    border-bottom: none;
  }
`;

export const ProfileTabList = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    gap: 4px;
    padding: 4px;
    background: ${TOKENS.panelBg};
    border: 1px solid ${TOKENS.lineSoft};
    border-radius: 10px;
    overflow: hidden;
  }
`;

export const ProfileTab = styled.button<{ $active?: boolean }>`
  height: 46px;
  padding: 0 18px;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? TOKENS.primary : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? TOKENS.text : TOKENS.textMuted)};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    color: ${TOKENS.text};
  }

  @media (max-width: 640px) {
    flex: 1 1 0;
    min-width: 0;
    height: 38px;
    margin-bottom: 0;
    padding: 0 8px;
    font-size: 13px;
    line-height: 1.15;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: none;
    border-radius: 7px;
    color: ${({ $active }) => ($active ? TOKENS.primary : TOKENS.textMuted)};
    background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
    box-shadow: ${({ $active }) =>
      $active ? "0 1px 2px rgba(15, 23, 42, 0.08)" : "none"};
  }
`;

export const ProfileTabPanel = styled.div`
  min-width: 0;
  display: grid;
  gap: 16px;
`;

export const ProfileActionsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;
