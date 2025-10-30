import styled from "@emotion/styled";

const bg = "#0c0e12"; // темнее фон
const line = "rgba(255,255,255,.08)";
const soft = "rgba(255,255,255,.04)";
const glass = "rgba(255,255,255,.06)";
const bgLight = "#ffffff";
const fgLight = "#0f172a"; // slate-900
const textLight = "#334155"; // slate-700
const lineLight = "rgba(15,23,42,.08)"; // мягкая граница
const softLight = "rgba(15,23,42,.04)"; // карточки/чипсы
const glassLight = "rgba(15,23,42,.06)";
const fg = "#e5e7eb";
const muted = "#9aa4b2"; // холоднее текст
const primary = "#2563eb"; // строгий синий (Tailwind blue-600)

// ===== Shell: убираем пёстрые радикальные градиенты
export const Shell = styled.div`
  color: ${fgLight};
  background: ${bgLight};
  min-height: 100vh;
`;

/* TOPBAR */
export const Topbar = styled.header`
  height: 72px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 18px;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(6px);
  background: rgba(12, 14, 18, 0.75);
  border-bottom: 1px solid ${line};
`;

/* Позволяет вкладывать контент без ломки сетки */
export const TopbarInner = styled.div`
  display: contents;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
export const BrandDot = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px; // вместо круга — строгий скруглённый квадрат
  display: grid;
  place-items: center;
  background: ${primary};
  color: #fff;
  font-weight: 800;
  text-transform: lowercase;
  letter-spacing: 0.2px;
`;
export const BrandText = styled.div`
  font-weight: 800; // 900 → 800
  letter-spacing: 0.1px; // поменьше
  color: #fff;
  font-size: 17px; // чуть меньше
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  a,
  button {
    font-size: 14px;
  }
  @media (max-width: 880px) {
    display: none;
  }
`;
export const NavA = styled.a`
  color: ${muted};
  text-decoration: none;
  padding: 8px 10px; // компактнее
  border-radius: 10px; // мягче, но не «желе»
  transition: background 0.15s, color 0.15s, transform 0.06s;
  &:hover {
    background: ${soft};
    color: #fff;
    transform: translateY(-1px);
  }
`;

/* HERO */
export const Hero = styled.section`
  max-width: 1100px;
  margin: 56px auto 0;
  padding: 0 16px 24px;
  text-align: center;
`;
export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid ${line};
  background: ${soft};
  color: ${muted};
  font-size: 12px;
  margin-bottom: 12px;
`;
export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4.6vw, 46px); // минус 1-2пт
  font-weight: 800; // 1000 → 800
  color: #fff;
  letter-spacing: 0.1px;
`;
export const HeroSubtitle = styled.p`
  margin: 12px auto 18px;
  max-width: 740px;
  color: #cbd5e1; // менее «фиолетовый»
  line-height: 1.6;
`;
export const HeroCtas = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 12px 0 20px;
  button,
  a {
    height: 46px;
    border-radius: 12px;
  }
`;

/* SEARCH */
export const SearchMock = styled.div`
  margin: 10px auto 28px;
  max-width: 820px;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: ${glass};
  border: 1px solid ${line};
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);

  @media (max-width: 640px) {
    grid-template-columns: 48px 1fr; /* иконка + инпут */
    grid-template-rows: auto auto; /* две строки */
  }
`;

export const SearchIconBox = styled.div`
  height: 46px;
  width: 46px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  border: 1px solid ${line};
  background: ${soft};
  color: ${fg};
`;
export const SearchInput = styled.input`
  background: transparent;
  border: 1px solid ${line};
  border-radius: 10px;
  height: 46px;
  padding: 0 14px;
  color: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  grid-column: 2 / 3;
  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 640px) {
    grid-column: 2 / 3;
  }
`;

export const SearchBtn = styled.button`
  height: 46px;
  padding: 0 18px;
  border-radius: 10px;
  background: ${primary};
  color: #fff;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.06s, opacity 0.15s;
  grid-column: 1 / -1; /* кнопка на всю ширину */
  @media (min-width: 641px) {
    grid-column: auto;
  }
`;
/* METRICS */
export const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
export const MetricCard = styled.div`
  background: ${soft};
  border: 1px solid ${line};
  padding: 16px;
  border-radius: 16px;
  text-align: center;
`;
export const MetricValue = styled.div`
  font-size: 30px;
  font-weight: 900;
  color: #fff;
`;
export const MetricLabel = styled.div`
  color: ${muted};
  font-size: 13px;
`;

/* SECTION */
export const Section = styled.section`
  max-width: 1100px;
  margin: 40px auto 0;
  padding: 0 16px;
`;
export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  text-align: center;
`;
export const SectionSubtitle = styled.p`
  margin: 8px auto 18px;
  text-align: center;
  color: ${muted};
`;

/* FEATURE CARDS */
export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
export const Card = styled.div`
  background: ${soft};
  border: 1px solid ${line};
  border-radius: 12px; // 18 → 12
  padding: 16px; // 18 → 16
  transition: transform 0.12s, box-shadow 0.12s, border-color 0.12s;
  &:hover {
    transform: translateY(-2px); // -3 → -2
    box-shadow: 0 10px 22px rgba(16, 24, 40, 0.22);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;
export const CardIconBox = styled.div<{
  $accent?: "blue" | "green" | "violet" | "amber";
}>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  color: #fff;
  background: ${primary};
`;
export const CardTitle = styled.div`
  font-weight: 800;
  margin-bottom: 6px;
  color: #fff;
`;
export const CardText = styled.div`
  color: ${muted};
  font-size: 14px;
  line-height: 1.55;
`;

/* ROLES */
export const Roles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
export const RoleCard = styled(Card)`
  padding-top: 18px;
`;
export const RoleIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${glass};
  border: 1px solid ${line};
  color: ${fg};
  margin-bottom: 10px;
`;
export const RoleTitle = styled(CardTitle)``;
export const RoleText = styled(CardText)``;

/* CATEGORIES */
export const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
export const CategoryCard = styled.div`
  background: ${soft};
  border: 1px solid ${line};
  padding: 12px;
  border-radius: 12px; // 14 → 12
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  transition: transform 0.08s, border-color 0.12s;
  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;
export const CategoryIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${glass};
  border: 1px solid ${line};
`;

/* CTA BANNER */
export const CtaBanner = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 22px 18px;
  background: linear-gradient(135deg, #1f3a8a, #1e40af); // navy-град
  border-radius: 16px; // 20 → 16
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;
export const CtaTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
`;
export const CtaText = styled.p`
  margin: 6px 0 0;
  color: #e2e8f0;
`;
export const CtaButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  @media (max-width: 820px) {
    justify-content: center;
  }
`;

/* FOOTER */
export const Footer = styled.footer`
  border-top: 1px solid ${line};
  padding: 30px 16px;
  background: rgba(11, 11, 16, 0.8);
`;
export const FooterCols = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
export const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const FooterTitle = styled.div`
  font-weight: 900;
  color: #fff;
  margin-bottom: 6px;
`;

export const FooterLink = styled.a`
  color: ${textLight};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    color: ${fgLight};
    text-decoration: underline;
  }
`;

export const Copy = styled.div`
  max-width: 1100px;
  margin: 12px auto 0;
  color: #9aa1ab;
  font-size: 12px;
  text-align: center;
`;

/* ===== LANG SWITCHER ===== */
export const LangWrap = styled.div`
  position: relative;
`;
export const LangBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid ${line};
  background: ${soft};
  color: ${fg};
  cursor: pointer;
  transition: transform 0.06s, border-color 0.15s, background 0.15s,
    opacity 0.15s;
  height: 36px;

  &:hover {
    background: ${glass};
    border-color: rgba(255, 255, 255, 0.18);
    opacity: 0.95;
  }
  &:active {
    transform: translateY(1px);
  }
`;
export const LangBadge = styled.span`
  font-weight: 800;
  letter-spacing: 0.4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${line};
`;
export const LangMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 180px;
  border-radius: 14px;
  background: ${bg};
  border: 1px solid ${line};
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  padding: 6px;
  z-index: 100;
`;
export const LangItem = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: transparent;
  border: 0;
  color: ${fg};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${soft};
  }
`;

/* ===== MOBILE TOPBAR ===== */
export const MobileOnly = styled.div`
  display: none;
  @media (max-width: 880px) {
    display: block;
  }
`;
export const DesktopOnly = styled.div`
  display: block;
  @media (max-width: 880px) {
    display: none;
  }
`;
export const BurgerBtn = styled.button`
  appearance: none;
  border: 1px solid ${line};
  background: ${soft};
  color: ${fg};
  border-radius: 12px;
  height: 40px;
  width: 44px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.06s, background 0.15s, border-color 0.15s;
  &:hover {
    background: ${glass};
    border-color: rgba(255, 255, 255, 0.18);
  }
  &:active {
    transform: translateY(1px);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;
export const MobileMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 100;
  will-change: opacity;
  pointer-events: auto;
`;

export const MobileMenuPanel = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 101;
  background: rgba(11, 11, 16, 0.96);
  border-bottom: 1px solid ${line};
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  border-radius: 0 0 16px 16px;
  padding: 14px 14px 12px;
  will-change: transform, opacity;
  pointer-events: auto;
`;
export const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
export const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const MobileNav = styled.nav`
  display: grid;
  gap: 8px;
  padding: 10px 2px 6px;
`;
export const MobileLink = styled.a`
  color: ${fg};
  text-decoration: none;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid ${line};
  background: ${soft};
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background: ${glass};
  }
`;
export const MobileBtnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
`;

const brandBlue = primary;

/* Верхняя тонкая плашка (регион/помощь/кнопки) */
export const HHHeaderBar = styled.div`
  max-width: 1200px;
  margin: 8px auto 0;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  color: ${fg};
`;
export const HHHeaderColLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;
export const HHHeaderColRight = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;
export const HHRegion = styled.span`
  color: ${muted};
  font-size: 14px;
  &:before {
    content: "🌍";
    margin-right: 6px;
  }
`;
export const HHHeaderLink = styled.a`
  color: ${fgLight};
  font-size: 14px;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 10px;
  &:hover {
    background: ${softLight};
  }
`;

/* Герой-блок */
export const HHHero = styled.section`
  max-width: 1200px;
  margin: 10px auto 0;
  padding: 20px 16px 6px;
  background: radial-gradient(
      900px 420px at 75% -10%,
      rgba(37, 99, 235, 0.12),
      transparent 60%
    ),
    radial-gradient(
      700px 380px at 20% -20%,
      rgba(14, 165, 233, 0.1),
      transparent 60%
    );
  @media (max-width: 860px) {
    padding-top: 16px;
  }
`;
export const HHTitle = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(28px, 5.4vw, 48px);
  font-weight: 800;
  color: #fff;
  text-align: left;
`;

/* Поиск */
export const HHSearchForm = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr 48px 120px;
  gap: 8px;
  align-items: center;
  max-width: 880px;
  background: ${glassLight};
  border: 1px solid ${lineLight};
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);

  @media (max-width: 720px) {
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
  }
`;
export const HHSearchIcon = styled.div`
  width: 52px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid ${lineLight};
  background: ${softLight};
  color: ${fgLight};
`;

export const HHSearchInput = styled.input`
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${lineLight};
  background: #fff;
  color: ${fgLight};
  padding: 0 14px;
  outline: none;
  &::placeholder {
    color: #64748b;
  } /* slate-500 */
`;

export const HHSearchFilterBtn = styled.button`
  height: 44px;
  width: 48px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid ${lineLight};
  background: ${softLight};
  color: ${fgLight};
  cursor: pointer;
  transition: background 0.15s, transform 0.06s, border-color 0.15s;
  &:hover {
    background: ${glassLight};
    border-color: rgba(15, 23, 42, 0.14);
  }
  @media (max-width: 720px) {
    display: none;
  }
`;

export const HHSearchSubmit = styled.button`
  height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  background: ${brandBlue};
  color: #fff;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.06s, opacity 0.15s;
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 720px) {
    grid-column: 1 / -1;
  }
`;

/* Ссылка «Я ищу сотрудника» */
export const HHAltLinkRow = styled.div`
  margin-top: 12px;
`;
export const HHAltLink = styled.a`
  color: ${brandBlue};
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

/* Метрики */
export const HHStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 640px;
  margin: 16px 0 0;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
export const HHStatCard = styled.div`
  background: ${softLight};
  border: 1px solid hsla(0, 0%, 100%, 0.5);
  border-radius: 12px;
  padding: 14px;
`;

export const HHLeadCard = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  gap: 12px;
  background: #fff;
  border: 1px solid ${lineLight};
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
`;

export const HHLeadInput = styled.input`
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${lineLight};
  background: #fff;
  color: ${fgLight};
  padding: 0 14px;
  outline: none;
  &::placeholder {
    color: #64748b;
  }
`;
export const HHStatValue = styled.div`
  color: #fff;
  font-weight: 900;
  font-size: 26px;
`;
export const HHStatLabel = styled.div`
  color: ${muted};
  font-size: 13px;
`;

/* Бейджи маркетплейсов */
export const HHBadgeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 14px;

  .app {
    background-image: url(/appstore.svg);
    background-position: 0 -45px;
  }
  .google {
    background-image: url(/appstore.svg);
    background-position: 0 0;
  }
  .gallery {
    background-image: url(/appstore.svg);
    background-position: 0 -90px;
  }
`;
export const HHBadgeImg = styled.div`
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35));
  user-select: none;
  width: 140px;
  height: 40px;
`;

/* Карточка с вводом контакта */
export const HHLeadWrap = styled.div`
  display: grid;
  place-items: center;
  margin: 26px 0 10px;
  padding: 0 16px;
`;

export const HHLeadTitle = styled.div`
  color: ${fg};
  font-size: 15px;
  line-height: 1.55;
`;

export const HHLeadBtn = styled.button`
  height: 44px;
  border-radius: 10px;
  padding: 0 16px;
  background: ${brandBlue};
  color: #fff;
  border: 0;
  cursor: pointer;
`;

// ===== HERO WITH VIDEO BG =====
export const VideoHero = styled.section`
  position: relative;
  min-height: 620px;
  display: grid;
  align-items: center;
  isolation: isolate; /* собственный стек */
`;

export const VideoBgWrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0; /* было -2 */
  overflow: hidden;
  pointer-events: none; /* фон не кликается */
  background: #000; /* на случай, если видео не загрузится */
  border-bottom: 1px solid ${lineLight};
`;

export const VideoBg = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
  filter: saturate(1.05) contrast(1.02);
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1; /* слой над видео */
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.45) 38%,
    rgba(0, 0, 0, 0.35) 100%
  );
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 2; /* контент сверху */
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px;
  color: #fff;
`;

export const HHTitleLightOnVideo = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(28px, 5.4vw, 48px);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
`;

export const HeroNavbar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3;
  padding: 14px 16px;
  @media (min-width: 1024px) {
    padding: 18px 24px;
  }
`;
export const HeroNavbarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
`;
export const HeroBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  img {
    height: 36px;
  }
  span {
    font-weight: 800;
    letter-spacing: 0.2px;
    font-size: 18px;
  }
`;
export const HeroNavLinks = styled.nav`
  display: none;
  @media (min-width: 900px) {
    display: flex;
    justify-content: center;
    gap: 14px;
    a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 8px 10px;
      border-radius: 10px;
      backdrop-filter: blur(4px);
      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
`;
export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const GhostBtn = styled.button`
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.15s, border-color 0.15s, transform 0.06s;
  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.35);
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* ===== FANCY SEARCH (стеклянная таблетка) ===== */
export const FancySearch = styled.form`
  max-width: 940px;
  margin-top: 16px;
  display: grid;
  grid-template-columns: 56px 1fr 48px 150px;
  gap: 8px;
  align-items: center;
  padding: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);

  @media (max-width: 760px) {
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
    border-radius: 18px;
  }
`;
export const FancyIcon = styled.div`
  width: 56px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  @media (max-width: 760px) {
    width: 48px;
  }
`;
export const FancyInput = styled.input`
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0);
  color: #fff;
  padding: 0 16px;
  outline: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
`;
export const FancyRound = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: transform 0.06s, background 0.15s, border-color 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.32);
  }
  &:active {
    transform: translateY(1px);
  }
  @media (max-width: 760px) {
    display: none;
  }
`;
export const FancySubmit = styled.button`
  height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  background: ${primary};
  color: #fff;
  border: 0;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.06s, opacity 0.15s, box-shadow 0.15s;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45);
  &:hover {
    opacity: 0.95;
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.55);
  }
  &:active {
    transform: translateY(1px);
  }
  @media (max-width: 760px) {
    grid-column: 1 / -1;
  }
`;
