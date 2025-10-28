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
  VideoHero, VideoBgWrap, VideoBg, VideoOverlay, HeroInner, HHTitleLightOnVideo,
  // ===== HH-like blocks =====
  HeroNavbar, HeroNavbarInner, HeroBrand, HeroNavLinks, HeroActions, GhostBtn,
  FancySearch, FancyIcon, FancyInput, FancyRound, FancySubmit,
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

/* ===== motion ===== */
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

export default function LandingPage() {
  const { t, i18n } = useTranslation("common");
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const currentLang = useMemo(
    () => (i18n.language?.split("-")[0] || "ru").toUpperCase(),
    [i18n.language]
  );

  // init lang from LS
  useEffect(() => {
    const saved = localStorage.getItem("lng");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, [i18n]);

  // close language dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setOpenLang(false);
    }
    if (openLang) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openLang]);

  // lock scroll for mobile menu
  useEffect(() => {
    if (!openMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMobile]);

  const switchTo = (lng: "ru" | "uz" | "en") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setOpenLang(false);
  };

  // --- search / lead ---
  const [q, setQ] = useState("");
  const [lead, setLead] = useState("");

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    nav(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <Shell>
      {/* <DbDocModal /> */}

      {/* === upper navigation bar (your brand + lang + auth buttons) === */}
      <HeroNavbar>
  <HeroNavbarInner>
    <Link to="/" style={{ textDecoration: "none" }}>
      <HeroBrand>
        {/* <img src="/logomin.png" alt="" /> */}
        <span>{t("brand") || "Лоба"}</span>
      </HeroBrand>
    </Link>

    <HeroNavLinks>
      <a href="#roles">{t("rolesTitle") || "Категории"}</a>
      <a href="#about">{t("why") || "Почему мы"}</a>
      <Link to="/find">{t("nav.find") || "Контакты"}</Link>
    </HeroNavLinks>

    <HeroActions>
      <GhostBtn onClick={() => setOpenLang(v => !v)}>{(i18n.language || "ru").toUpperCase()}</GhostBtn>
      <Link to="/login" style={{ textDecoration: "none" }}><GhostBtn>{t("loginCta") || "Войти"}</GhostBtn></Link>
      <Link to="/register" style={{ textDecoration: "none" }}>
        <GhostBtn style={{ background: "rgba(37,99,235,.9)", borderColor: "transparent" }}>
          {t("ctaExec") || "Создать резюме"}
        </GhostBtn>
      </Link>
    </HeroActions>
  </HeroNavbarInner>
</HeroNavbar>

      {/* === slim header like HH (region + помощь + создать резюме + войти) === */}
      {/* <HHHeaderBar>
        <HHHeaderColLeft>
          <HHRegion>{t("region") || "Узбекистан"}</HHRegion>
          <HHHeaderLink href="#">{t("help") || "Помощь"}</HHHeaderLink>
        </HHHeaderColLeft>
        <HHHeaderColRight>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <HHHeaderLink as="span">{t("ctaExec") || "Создать резюме"}</HHHeaderLink>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <HHHeaderLink as="span">{t("loginCta") || "Войти"}</HHHeaderLink>
          </Link>
        </HHHeaderColRight>
      </HHHeaderBar> */}

      {/* === Mobile Menu === */}
      <AnimatePresence>
        {openMobile && (
          <>
            <div onClick={() => setOpenMobile(false)}>
              <MobileMenuBackdrop />
            </div>
            <div
              role="dialog"
              aria-modal="true"
              style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileMenuPanel>
                <MobileMenuHeader>
                  <MobileBrand>
                    <img src="/logomin.png" height={34} alt="" />
                    <BrandText>{t("brand")}</BrandText>
                  </MobileBrand>
                  <BurgerBtn aria-label="Close menu" onClick={() => setOpenMobile(false)}>
                    <FiX />
                  </BurgerBtn>
                </MobileMenuHeader>

                <div style={{ marginTop: 10, marginBottom: 8, display: "flex", gap: 8 }}>
                  <LangBtn onClick={() => switchTo("ru")}>RU</LangBtn>
                  <LangBtn onClick={() => switchTo("uz")}>UZ</LangBtn>
                </div>

                <MobileNav>
                  <a href="#" onClick={() => setOpenMobile(false)} style={{ textDecoration: "none" }}>
                    <MobileLink>Помощь</MobileLink>
                  </a>
                </MobileNav>

                <MobileBtnRow>
                  <Link to="/register" onClick={() => setOpenMobile(false)} style={{ textDecoration: "none" }}>
                    <CustomButton style={{ width: "100%" }}>{t("ctaExec") || "Создать резюме"}</CustomButton>
                  </Link>
                  <Link to="/login" onClick={() => setOpenMobile(false)} style={{ textDecoration: "none" }}>
                    <CustomButton style={{ width: "100%", background: "#374151" }}>
                      {t("loginCta") || "Войти"}
                    </CustomButton>
                  </Link>
                </MobileBtnRow>
              </MobileMenuPanel>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* === HERO like HH === */}
      <VideoHero>
  <VideoBgWrap>
    {/* помести файл в public/hero.mp4 или измени путь */}
    <VideoBg
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/hero-poster.jpg"
  aria-hidden="true"
>
  {/* Сначала webm, затем mp4. MOV не используем */}
  <source src="/hero.webm" type="video/webm" />
  <source src="/hero1.mp4" type="video/mp4" />
</VideoBg>
    <VideoOverlay />
  </VideoBgWrap>

  <HeroInner>
    <motion.div initial="hidden" animate="show" variants={staggerList(0.05, 0.08)}>
      <motion.div variants={fadeUp(0.02)}>
        <HHTitleLightOnVideo>{t("heroTitle") || "Найди работу мечты"}</HHTitleLightOnVideo>
      </motion.div>

      <motion.form variants={fadeUp(0.06)} onSubmit={onSubmitSearch}>
  <FancySearch>
    <FancyIcon aria-hidden><FiSearch size={20} /></FancyIcon>
    <FancyInput
      placeholder={t("searchPlaceholder") || ""}
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
    <FancyRound type="button" title={t("filters") || "Фильтры"}>
      <FiSliders size={18} />
    </FancyRound>
    <FancySubmit type="submit">{t("nav.find")}</FancySubmit>
  </FancySearch>
</motion.form>

      <motion.div variants={fadeUp(0.1)} style={{ marginTop: 10 }}>
        <HHAltLinkRow>
          <Link to="/hire" style={{ textDecoration: "none", color: "#fff" }}>
            <HHAltLink style={{ color: "#fff", textShadow: "0 1px 12px rgba(0,0,0,.45)" }}>
              Я ищу сотрудника
            </HHAltLink>
          </Link>
        </HHAltLinkRow>
      </motion.div>

      <motion.div variants={fadeUp(0.14)}>
        <HHStatsRow>
          <HHStatCard><HHStatValue>1 637 581</HHStatValue><HHStatLabel>резюме</HHStatLabel></HHStatCard>
          <HHStatCard><HHStatValue>10 656</HHStatValue><HHStatLabel>вакансий</HHStatLabel></HHStatCard>
          <HHStatCard><HHStatValue>26 358</HHStatValue><HHStatLabel>компаний</HHStatLabel></HHStatCard>
        </HHStatsRow>
      </motion.div>

      <motion.div variants={fadeUp(0.18)}>
        <HHBadgeRow>
          <HHBadgeImg className="app" />
          <HHBadgeImg className="google"  />
          <HHBadgeImg className="gallery" />
        </HHBadgeRow>
      </motion.div>
    </motion.div>
  </HeroInner>
</VideoHero>

      {/* === Lead capture card (phone/email + Продолжить) === */}


      {/* === footer (ваш) === */}


<AppFooter/>

    </Shell>
  );
}






