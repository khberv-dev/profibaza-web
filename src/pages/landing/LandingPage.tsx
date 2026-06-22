// src/features/landing/LandingPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

import {
  Shell,
  Topbar,
  TopbarInner,
  Brand,
  BrandText,
  Nav,
  NavA,
  DesktopOnly,
  MobileOnly,
  BurgerBtn,
  MobileMenuBackdrop,
  MobileMenuPanel,
  MobileMenuHeader,
  MobileBrand,
  MobileNav,
  MobileLink,
  MobileBtnRow,
  LangWrap,
  LangBtn,
  LangBadge,
  LangMenu,
  LangItem,
  VideoHero,
  VideoBgWrap,
  VideoBg,
  VideoOverlay,
  HeroInner,
  HHTitleLightOnVideo,
  HeroNavbar,
  HeroNavbarInner,
  HeroBrand,
  HeroNavLinks,
  HeroActions,
  GhostBtn,
  FancySearch,
  FancyIcon,
  FancyInput,
  FancyRound,
  FancySubmit,
  HHSearchForm,
  HHSearchIcon,
  HHSearchInput,
  HHSearchFilterBtn,
  HHSearchSubmit,
  HHAltLinkRow,
  HHAltLink,
  HHStatsRow,
  HHStatCard,
  HHStatValue,
  HHStatLabel,
  HHBadgeRow,
  HHBadgeImg,
  HHLeadWrap,
  HHLeadCard,
  HHLeadTitle,
  HHLeadInput,
  HHLeadBtn,
  Footer,
  FooterCols,
  FooterCol,
  FooterTitle,
  FooterLink,
  Copy,
} from "./landing-style";

import { CustomButton } from "../../components/custom-button";
import { FiGlobe, FiMenu, FiX, FiSearch, FiSliders } from "react-icons/fi";
import DbDocModal from "./DbDocModal";
import { AppFooter } from "../../components/AppFooter";

import { useAuthStore } from "../../shared/stores/auth"; // 👈 добавили

/* ===== motion helpers ===== */
const easeOutBezier: Transition["ease"] = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeOutBezier, delay },
  },
});
const staggerList = (delayChildren = 0.08, stagger = 0.06): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren: stagger } },
});

// делаем motion-обёртку для выпадающего меню языка чтоб не ругался TS
const MotionLangMenu = motion(LangMenu);

const LANDING_FEATURE_KEYS = [
  "search",
  "cards",
  "responses",
  "teams",
  "terms",
  "locale",
] as const;

const LANDING_METRIC_KEYS = [
  "activeVacancies",
  "resumes",
  "notifications",
] as const;

export default function LandingPage() {
  const { t, i18n } = useTranslation("common");
  const nav = useNavigate();

  // ===== auth store =====
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const me = useAuthStore((s) => s.me);

  // ===== ui state =====
  const [openLang, setOpenLang] = useState(false); // язык дропдаун (desktop)
  const [openMobile, setOpenMobile] = useState(false); // мобильное меню
  const langRef = useRef<HTMLDivElement>(null);

  // RU / UZ метка
  const currentLangLabel = (i18n.language?.split("-")[0] || "uz").toUpperCase();

  // клик вне дропа языка
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) {
        setOpenLang(false);
      }
    }
    if (openLang) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openLang]);

  // блокируем скролл за мобильным меню
  useEffect(() => {
    if (!openMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMobile]);

  // ручная смена языка
  const switchTo = (lng: "ru" | "uz") => {
    i18n.changeLanguage(lng);
    setOpenLang(false);
  };

  // поиск по hero
  const [q, setQ] = useState("");
  const [lead, setLead] = useState("");

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    nav(`/search?query=${encodeURIComponent(query)}`);
  };

  // куда ведём профиль
  const profileHref = "/app/profile";

  const landingFeatures = useMemo(
    () =>
      LANDING_FEATURE_KEYS.map((key) => ({
        key,
        title: t(`landing.features.${key}.title`),
        desc: t(`landing.features.${key}.desc`),
      })),
    [t, i18n.language]
  );

  const landingMetrics = useMemo(
    () =>
      LANDING_METRIC_KEYS.map((key) => ({
        key,
        value: t(`landing.metrics.${key}.value`),
        label: t(`landing.metrics.${key}.label`),
      })),
    [t, i18n.language]
  );

  return (
    <Shell>
      {/* <DbDocModal /> */}

      {/* === HEADER / NAVBAR === */}
      <HeroNavbar>
        <HeroNavbarInner>
          <Link to="/" style={{ textDecoration: "none" }}>
            <HeroBrand>
              <span>{t("brand")}</span>
            </HeroBrand>
          </Link>

          <HeroNavLinks>
            <a href="#roles">{t("rolesTitle")}</a>
            <a href="#about">{t("why")}</a>
            <Link to="/find">{t("nav.find")}</Link>
          </HeroNavLinks>

          <HeroActions>
  {/* DESKTOP: язык + auth */}
  <DesktopOnly>
    <div style={{ position: "relative" }} ref={langRef}>
      <GhostBtn
        onClick={() => setOpenLang((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        <FiGlobe />
        {currentLangLabel}
      </GhostBtn>

      <AnimatePresence>
        {openLang && (
          <MotionLangMenu
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <LangItem onClick={() => switchTo("ru")}>RU</LangItem>
            <LangItem onClick={() => switchTo("uz")}>UZ</LangItem>
          </MotionLangMenu>
        )}
      </AnimatePresence>
    </div>

    {isAuthed ? (
      <Link to={profileHref} style={{ textDecoration: "none" }}>
        <GhostBtn
          style={{
            background: "rgba(37,99,235,.9)",
            borderColor: "transparent",
          }}
        >
          {t("topbar.profileBtn")}
        </GhostBtn>
      </Link>
    ) : (
      <>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <GhostBtn>{t("loginCta")}</GhostBtn>
        </Link>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <GhostBtn
            style={{
              background: "rgba(37,99,235,.9)",
              borderColor: "transparent",
            }}
          >
            {t("ctaExec")}
          </GhostBtn>
        </Link>
      </>
    )}
  </DesktopOnly>

  {/* MOBILE: только бургер */}
  <MobileOnly>
    <BurgerBtn
      aria-label={t("landing.openMenu")}
      onClick={() => setOpenMobile(true)}
      style={{ marginLeft: 8 }}
    >
      <FiMenu />
    </BurgerBtn>
  </MobileOnly>
</HeroActions>

        </HeroNavbarInner>
      </HeroNavbar>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {openMobile && (
          <>
            <div onClick={() => setOpenMobile(false)}>
              <MobileMenuBackdrop />
            </div>

            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 900,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileMenuPanel>
                <MobileMenuHeader>
                  <MobileBrand>
                    <img src="/logomin.png" height={34} alt="" />
                    <BrandText>{t("brand")}</BrandText>
                  </MobileBrand>

                  <BurgerBtn
                    aria-label={t("landing.closeMenu")}
                    onClick={() => setOpenMobile(false)}
                  >
                    <FiX />
                  </BurgerBtn>
                </MobileMenuHeader>

                {/* язык для мобилки */}
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 8,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <LangBtn onClick={() => switchTo("ru")}>RU</LangBtn>
                  <LangBtn onClick={() => switchTo("uz")}>UZ</LangBtn>
                </div>

                <MobileNav>
                  <a
                    href="#"
                    onClick={() => setOpenMobile(false)}
                    style={{ textDecoration: "none" }}
                  >
                    <MobileLink>{t("nav.help")}</MobileLink>
                  </a>
                </MobileNav>

                <MobileBtnRow>
                  {isAuthed ? (
                    <Link
                      to={profileHref}
                      onClick={() => setOpenMobile(false)}
                      style={{ textDecoration: "none", width: "100%" }}
                    >
                      <CustomButton style={{ width: "100%" }}>
                        {t("topbar.profileBtn")}
                      </CustomButton>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        onClick={() => setOpenMobile(false)}
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <CustomButton style={{ width: "100%" }}>
                          {t("ctaExec")}
                        </CustomButton>
                      </Link>

                      <Link
                        to="/login"
                        onClick={() => setOpenMobile(false)}
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <CustomButton
                          style={{ width: "100%", background: "#374151" }}
                        >
                          {t("loginCta")}
                        </CustomButton>
                      </Link>
                    </>
                  )}
                </MobileBtnRow>
              </MobileMenuPanel>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* === HERO SECTION === */}
      <VideoHero>
        <VideoBgWrap>
          <VideoBg
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-hidden="true"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero1.mp4" type="video/mp4" />
          </VideoBg>
          <VideoOverlay />
        </VideoBgWrap>

        <HeroInner>
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerList(0.05, 0.08)}
          >
            <motion.div variants={fadeUp(0.02)}>
              <HHTitleLightOnVideo>{t("heroTitle")}</HHTitleLightOnVideo>
            </motion.div>

            <motion.form variants={fadeUp(0.06)} onSubmit={onSubmitSearch}>
              <FancySearch>
                <FancyIcon aria-hidden>
                  <FiSearch size={20} />
                </FancyIcon>
                <FancyInput
                  placeholder={t("searchPlaceholder") || ""}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <Link to='/find'>
                <FancyRound type="button" title={t("landing.filters")}>
                  <FiSliders size={18} />
                </FancyRound></Link>
                
                <Link to='/find'><FancySubmit>{t("nav.find")}</FancySubmit></Link>
              </FancySearch>
            </motion.form>

            <motion.div variants={fadeUp(0.1)} style={{ marginTop: 10 }}>
              <HHAltLinkRow>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <HHAltLink
                    style={{
                      color: "#fff",
                      textShadow: "0 1px 12px rgba(0,0,0,.45)",
                    }}
                  >
                    {t("landing.lookingForEmployee")}
                  </HHAltLink>
                </Link>
              </HHAltLinkRow>
            </motion.div>

            <motion.div variants={fadeUp(0.14)}>
              <HHStatsRow>
                <HHStatCard>
                  <HHStatValue>1 637 581</HHStatValue>
                  <HHStatLabel>{t("landing.heroStats.resumes")}</HHStatLabel>
                </HHStatCard>
                <HHStatCard>
                  <HHStatValue>10 656</HHStatValue>
                  <HHStatLabel>{t("landing.heroStats.vacancies")}</HHStatLabel>
                </HHStatCard>
                <HHStatCard>
                  <HHStatValue>26 358</HHStatValue>
                  <HHStatLabel>{t("landing.heroStats.companies")}</HHStatLabel>
                </HHStatCard>
              </HHStatsRow>
            </motion.div>

            <motion.div variants={fadeUp(0.18)}>
              <HHBadgeRow>
                <HHBadgeImg className="app" />
                <HHBadgeImg className="google" />
                <HHBadgeImg className="gallery" />
              </HHBadgeRow>
            </motion.div>
          </motion.div>
        </HeroInner>
      </VideoHero>

      {/* === SECTION A: Кому подходит (минималистичная карточная сетка) === */}
      {/* <section id="who" style={{ background: "#fff", padding: "96px 0 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerList(0.02, 0.025)}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.h2
              variants={fadeUp(0.01)}
              style={{
                margin: 0,
                marginBottom: 12,
                fontSize: 42,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 800,
                color: "#0b1220",
              }}
            >
              Кому подходит PROFIBAZA
            </motion.h2>

            <motion.p
              variants={fadeUp(0.03)}
              style={{
                margin: 0,
                marginBottom: 36,
                color: "#5b6472",
                fontSize: 18,
                maxWidth: 760,
              }}
            >
              Платформа для исполнителей, команд и нанимающих. Чёткая подача и
              быстрый результат.
            </motion.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: 16,
              }}
            >
              {[
                {
                  t: "Индивидуальные специалисты",
                  d: "Создайте профиль, покажите кейсы и получайте релевантные заявки без лишней рутины.",
                },
                {
                  t: "Студии и команды",
                  d: "Профиль компании, роли участников и распределение заявок внутри вашей команды.",
                },
                {
                  t: "Самозанятые / ИП",
                  d: "Реквизиты, прайс-листы, график и статусы занятости — всё в одном месте.",
                },
                {
                  t: "HR / подрядчики",
                  d: "Вакансии, фильтры под требования и быстрые отклики от подходящих специалистов.",
                },
                {
                  t: "Частные заказчики",
                  d: "Понятные карточки, опыт, цена и сроки — сравнивайте и выбирайте уверенно.",
                },
                {
                  t: "Корпорации",
                  d: "Массовый подбор, прозрачные правила и единая коммуникация по проектам.",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.t}
                  variants={fadeUp(0.04 + i * 0.015)}
                  style={{
                    gridColumn: "span 12",
                    background: "#fff",
                    border: "1px solid #e7eaf0",
                    borderRadius: 16,
                    padding: 20,
                    minHeight: 142,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform .18s ease",
                    willChange: "transform, opacity",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: 8,
                        fontSize: 18,
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                        color: "#0b1220",
                      }}
                    >
                      {card.t}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#596272",
                        fontSize: 15.5,
                        lineHeight: 1.6,
                      }}
                    >
                      {card.d}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "#1e3a8a",
                        background: "rgba(37,99,235,.06)",
                        border: "1px solid rgba(37,99,235,.18)",
                        padding: "6px 8px",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      поддерживается
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "#334155",
                        background: "#f8fafc",
                        border: "1px solid #e7eaf0",
                        padding: "6px 8px",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      лаконичный профиль
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* === SECTION B: Почему PROFIBAZA (двухколоночный Apple-лайк блок) === */}
      <section
        id="about"
        style={{ background: "#f6f7fb", padding: "88px 0 96px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerList(0.02, 0.02)}
            style={{ willChange: "transform, opacity" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: 20,
                alignItems: "center",
              }}
            >
              {/* Левая колонка: большая мысль + подзаголовок */}
              <motion.div
                variants={fadeUp(0.02)}
                style={{ gridColumn: "span 12" }}
              >
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 12,
                    fontSize: 46,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                    fontWeight: 800,
                    color: "#0b1220",
                    textWrap: "balance",
                  }}
                >
                  {t("landing.about.title")}
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 28,
                    color: "#5b6472",
                    fontSize: 18,
                    maxWidth: 760,
                  }}
                >
                  {t("landing.about.subtitle")}
                </p>
              </motion.div>

              {/* Правая часть: фичи списком в две колонки */}
              <motion.div
                variants={fadeUp(0.05)}
                style={{
                  gridColumn: "span 12",
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: 16,
                }}
              >
                {landingFeatures.map((f) => (
                  <div
                    key={f.key}
                    style={{
                      gridColumn: "span 12",
                      background: "#fff",
                      border: "1px solid #e7eaf0",
                      borderRadius: 16,
                      padding: 20,
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* минималистичный маркер */}
                    <div
                      aria-hidden
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: "#1d4ed8",
                        marginTop: 6,
                        boxShadow: "0 0 0 6px rgba(29,78,216,.08)",
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 17.5,
                            fontWeight: 800,
                            letterSpacing: "-0.01em",
                            color: "#0b1220",
                          }}
                        >
                          {f.title}
                        </h3>
                      </div>
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#596272",
                          fontSize: 15.5,
                          lineHeight: 1.6,
                        }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Низ: минимальная статистика + CTA */}
              <motion.div
               id="roles"
                variants={fadeUp(0.06)}
                style={{ gridColumn: "span 12" }}
              >
                <div
                  style={{
                    marginTop: 24,
                    background: "#fff",
                    border: "1px solid #e7eaf0",
                    borderRadius: 16,
                    padding: "18px 12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    alignItems: "center",
                  }}
                >
                  {/* Статистика — одна лаконичная полоса */}
                  <div
                    style={{
                      gridColumn: "span 12",
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {landingMetrics.map((s, i) => (
                      <div
                        key={s.key}
                        style={{
                          flex: "1 1 260px",
                          minWidth: 220,
                          padding: "10px 18px",
                          textAlign: "center",
                          borderLeft: i === 0 ? "none" : "1px solid #e7eaf0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            color: "#0b1220",
                            lineHeight: 1.1,
                            marginBottom: 6,
                          }}
                        >
                          {s.value}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: 13.5 }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Тонкая разделительная линия */}
                  <div
                    style={{
                      gridColumn: "span 12",
                      height: 1,
                      background: "#e7eaf0",
                      margin: "10px 8px 0",
                    }}
                  />

                  {/* CTA — строго и компактно */}
                  <div
                    style={{
                      gridColumn: "span 12",
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                      flexWrap: "wrap",
                      padding: "14px 8px 4px",
                    }}
                  >
                    <a
                      href="/register"
                      style={{
                        height: 44,
                        padding: "0 18px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                        border: "1px solid transparent",
                        background:
                          "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)",
                        color: "#fff",
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {t("ctaExec")}
                    </a>
                    <a
                      href="/hire"
                      style={{
                        height: 44,
                        padding: "0 18px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                        border: "1px solid #e7eaf0",
                        background: "#fff",
                        color: "#0b1220",
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {t("landing.ctaFindSpecialist")}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </Shell>
  );
}
