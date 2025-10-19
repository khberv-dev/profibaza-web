// src/features/landing/LandingPage.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Shell,
  Topbar,
  TopbarInner,
  Brand,
  BrandDot,
  BrandText,
  Nav,
  NavA,
  Hero,
  HeroBadge,
  HeroTitle,
  HeroSubtitle,
  HeroCtas,
  SearchMock,
  SearchIconBox,
  SearchInput,
  SearchBtn,
  MetricRow,
  MetricCard,
  MetricValue,
  MetricLabel,
  Section,
  SectionTitle,
  SectionSubtitle,
  Cards,
  Card,
  CardIconBox,
  CardTitle,
  CardText,
  Roles,
  RoleCard,
  RoleIconBox,
  RoleTitle,
  RoleText,
  Grid3,
  CategoryCard,
  CategoryIconBox,
  CtaBanner,
  CtaTitle,
  CtaText,
  CtaButtons,
  Footer,
  FooterCols,
  FooterCol,
  FooterTitle,
  FooterLink,
  Copy,
  LangWrap,
  LangBtn,
  LangBadge,
  LangMenu,
  LangItem,
  MobileOnly,
  DesktopOnly,
  BurgerBtn,
  MobileMenuBackdrop,
  MobileMenuPanel,
  MobileMenuHeader,
  MobileBrand,
  MobileNav,
  MobileLink,
  MobileBtnRow,
} from "./landing-style";
import { CustomButton } from "../../components/custom-button";

import {
  FiSearch,
  FiTarget,
  FiShield,
  FiZap,
  FiCpu,
  FiUser,
  FiUsers,
  FiAward,
  FiTool,
  FiHome,
  FiPenTool,
  FiCode,
  FiTruck,
  FiGlobe,
  FiX,
  FiMenu,
  FiChevronRight,
} from "react-icons/fi";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import DbDocModal from "./DbDocModal";

/* ====== motion variants (с типами) ====== */
const easeOutBezier: Transition["ease"] = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOutBezier, delay },
  },
});

const heroParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerList = (delayChildren = 0.1, stagger = 0.06): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren: stagger } },
});

const itemPop: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOutBezier },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutBezier },
  },
};

const dropMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transformOrigin: "90% top" as const,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } },
};

// const slidePanel: Variants = {
//   hidden: { y: -20, opacity: 0 },
//   show: { y: 0, opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
//   exit: { y: -12, opacity: 0, transition: { duration: 0.18 } },
// };

export default function LandingPage() {
  const { t, i18n } = useTranslation("common");
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // текущий язык RU/UZ/EN
  const currentLang = useMemo(
    () => (i18n.language?.split("-")[0] || "ru").toUpperCase(),
    [i18n.language]
  );

  // инициализация языка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lng");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, [i18n]);

  // закрывать дропдаун языка по клику вне
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setOpenLang(false);
    }
    if (openLang) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openLang]);

  // блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (openMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openMobile]);

  const switchTo = (lng: "ru" | "uz" | "en") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setOpenLang(false);
  };

  const closeMobile = () => setOpenMobile(false);

  return (
    <Shell>
      <DbDocModal />
      <Topbar>
        <TopbarInner>
          <Link to="/" style={{ textDecoration: "none" }}>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Brand>
                <img src="/logomin.png" height={42} alt="" />
                <BrandText>{t("brand")}</BrandText>
              </Brand>
            </motion.div>
          </Link>

          {/* Desktop */}
          <DesktopOnly>
            <Nav>
              <NavA href="#how">{t("why")}</NavA>
              <NavA href="#roles">{t("rolesTitle")}</NavA>
              <NavA href="#categories">{t("catsTitle")}</NavA>

              {/* язык (desktop) */}
              <LangWrap ref={langRef}>
                <LangBtn
                  onClick={() => setOpenLang((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={openLang}
                >
                  <FiGlobe size={16} />
                  <span style={{ fontSize: 13, opacity: 0.9 }}>
                    {t("langLabel") || "Language"}
                  </span>
                  <LangBadge>{currentLang}</LangBadge>
                </LangBtn>

                <AnimatePresence>
                  {openLang && (
                    <motion.div
                      variants={dropMenu}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      style={{ position: "relative" }}
                    >
                      <LangMenu role="menu" aria-label="Language menu">
                        <LangItem
                          onClick={() => switchTo("ru")}
                          role="menuitem"
                        >
                          Русский <LangBadge>RU</LangBadge>
                        </LangItem>
                        <LangItem
                          onClick={() => switchTo("uz")}
                          role="menuitem"
                        >
                          O‘zbekcha <LangBadge>UZ</LangBadge>
                        </LangItem>
                      </LangMenu>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LangWrap>

              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <NavA as="span">{t("loginCta") ?? "Войти"}</NavA>
              </Link>

              <Link to="/register" style={{ textDecoration: "none" }}>
                <CustomButton>{t("ctaExec")}</CustomButton>
              </Link>
            </Nav>
          </DesktopOnly>

          {/* Mobile burger */}
          <MobileOnly>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <BurgerBtn
                aria-label="Open menu"
                aria-expanded={openMobile}
                onClick={() => setOpenMobile(true)}
              >
                <FiMenu />
              </BurgerBtn>
            </div>
          </MobileOnly>
        </TopbarInner>
      </Topbar>

      {/* ===== Mobile Menu (top panel) ===== */}
      <AnimatePresence>
        {openMobile && (
          <>
            {/* backdrop без анимации */}
            <div onClick={closeMobile}>
              <MobileMenuBackdrop />
            </div>

            {/* панель без анимации */}
            <div
              role="dialog"
              aria-modal="true"
              // если нужно «прилипание» к верху поверх всего:
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
                    <BrandDot>pb</BrandDot>
                    <BrandText>{t("brand")}</BrandText>
                  </MobileBrand>
                  <BurgerBtn aria-label="Close menu" onClick={closeMobile}>
                    <FiX />
                  </BurgerBtn>
                </MobileMenuHeader>

                {/* быстрый выбор языка */}
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
                    href="#how"
                    onClick={closeMobile}
                    style={{ textDecoration: "none" }}
                  >
                    <MobileLink>
                      {t("why")} <FiChevronRight />
                    </MobileLink>
                  </a>
                  <a
                    href="#roles"
                    onClick={closeMobile}
                    style={{ textDecoration: "none" }}
                  >
                    <MobileLink>
                      {t("rolesTitle")} <FiChevronRight />
                    </MobileLink>
                  </a>
                  <a
                    href="#categories"
                    onClick={closeMobile}
                    style={{ textDecoration: "none" }}
                  >
                    <MobileLink>
                      {t("catsTitle")} <FiChevronRight />
                    </MobileLink>
                  </a>
                </MobileNav>

                <MobileBtnRow>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    style={{ textDecoration: "none" }}
                  >
                    <CustomButton style={{ width: "100%" }}>
                      {t("ctaExec")}
                    </CustomButton>
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    style={{ textDecoration: "none" }}
                  >
                    <CustomButton
                      style={{ width: "100%", background: "#374151" }}
                    >
                      {t("ctaClient")}
                    </CustomButton>
                  </Link>
                </MobileBtnRow>
              </MobileMenuPanel>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <motion.div variants={heroParent} initial="hidden" animate="show">
        <motion.div variants={scaleIn}>
          <Hero>
            <motion.div variants={fadeUp(0.02)}>
              <HeroBadge>{t("slogan")}</HeroBadge>
            </motion.div>

            <motion.div variants={fadeUp(0.06)}>
              <HeroTitle>{t("heroTitle")}</HeroTitle>
            </motion.div>

            <motion.div variants={fadeUp(0.1)}>
              <HeroSubtitle>{t("heroSubtitle")}</HeroSubtitle>
            </motion.div>

            <motion.div variants={fadeUp(0.14)}>
              <HeroCtas>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <motion.span whileHover={{ y: -2 }} whileTap={{ y: 1 }}>
                    <CustomButton>{t("ctaExec")}</CustomButton>
                  </motion.span>
                </Link>

                <Link to="/login" style={{ textDecoration: "none" }}>
                  <motion.span whileHover={{ y: -2 }} whileTap={{ y: 1 }}>
                    <CustomButton style={{ background: "#374151" }}>
                      {t("ctaClient")}
                    </CustomButton>
                  </motion.span>
                </Link>
              </HeroCtas>
            </motion.div>

            <motion.div variants={fadeUp(0.18)}>
              <SearchMock>
                <SearchIconBox aria-hidden>
                  <FiSearch size={20} />
                </SearchIconBox>
                <SearchInput placeholder={t("searchPlaceholder") || ""} />
                <SearchBtn>{t("ctaClient")}</SearchBtn>
              </SearchMock>
            </motion.div>

            <motion.div variants={staggerList(0.22, 0.08)}>
              <MetricRow>
                <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                  <MetricCard>
                    <MetricValue>10k+</MetricValue>
                    <MetricLabel>{t("metricsExecutors")}</MetricLabel>
                  </MetricCard>
                </motion.div>

                <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                  <MetricCard>
                    <MetricValue>25k+</MetricValue>
                    <MetricLabel>{t("metricsOrders")}</MetricLabel>
                  </MetricCard>
                </motion.div>

                <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                  <MetricCard>
                    <MetricValue>4.9</MetricValue>
                    <MetricLabel>{t("metricsRating")}</MetricLabel>
                  </MetricCard>
                </motion.div>
              </MetricRow>
            </motion.div>
          </Hero>
        </motion.div>
      </motion.div>

      {/* ===== ОСОБЕННОСТИ ===== */}
      <motion.section
        id="how"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={staggerList()}
      >
        <Section>
          <motion.div variants={fadeUp()}>
            <SectionTitle>{t("why")}</SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp(0.04)}>
            <SectionSubtitle>{t("whySub")}</SectionSubtitle>
          </motion.div>

          <motion.div variants={staggerList(0.12, 0.08)}>
            <Cards>
              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <Card>
                  <CardIconBox $accent="blue">
                    <FiTarget size={22} />
                  </CardIconBox>
                  <CardTitle>{t("featureSearch")}</CardTitle>
                  <CardText>{t("featureSearchText")}</CardText>
                </Card>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <Card>
                  <CardIconBox $accent="green">
                    <FiShield size={22} />
                  </CardIconBox>
                  <CardTitle>{t("featureTrust")}</CardTitle>
                  <CardText>{t("featureTrustText")}</CardText>
                </Card>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <Card>
                  <CardIconBox $accent="violet">
                    <FiZap size={22} />
                  </CardIconBox>
                  <CardTitle>{t("featureFast")}</CardTitle>
                  <CardText>{t("featureFastText")}</CardText>
                </Card>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <Card>
                  <CardIconBox $accent="amber">
                    <FiCpu size={22} />
                  </CardIconBox>
                  <CardTitle>{t("featureAI")}</CardTitle>
                  <CardText>{t("featureAIText")}</CardText>
                </Card>
              </motion.div>
            </Cards>
          </motion.div>
        </Section>
      </motion.section>

      {/* ===== 4 СТОРОНЫ ===== */}
      <motion.section
        id="roles"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerList(0.1, 0.07)}
      >
        <Section>
          <motion.div variants={fadeUp()}>
            <SectionTitle>{t("rolesTitle")}</SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp(0.04)}>
            <SectionSubtitle>{t("rolesSub")}</SectionSubtitle>
          </motion.div>

          <motion.div variants={staggerList(0.16, 0.08)}>
            <Roles>
              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <RoleCard>
                  <RoleIconBox>
                    <FiUser size={24} />
                  </RoleIconBox>
                  <RoleTitle>{t("roleUser")}</RoleTitle>
                  <RoleText>{t("roleUserText")}</RoleText>
                </RoleCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <RoleCard>
                  <RoleIconBox>
                    <FiUsers size={24} />
                  </RoleIconBox>
                  <RoleTitle>{t("roleCompany")}</RoleTitle>
                  <RoleText>{t("roleCompanyText")}</RoleText>
                </RoleCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <RoleCard>
                  <RoleIconBox>
                    <FiAward size={24} />
                  </RoleIconBox>
                  <RoleTitle>{t("roleGraduate")}</RoleTitle>
                  <RoleText>{t("roleGraduateText")}</RoleText>
                </RoleCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -4 }}>
                <RoleCard>
                  <RoleIconBox>
                    <FiTool size={24} />
                  </RoleIconBox>
                  <RoleTitle>{t("roleMaster")}</RoleTitle>
                  <RoleText>{t("roleMasterText")}</RoleText>
                </RoleCard>
              </motion.div>
            </Roles>
          </motion.div>
        </Section>
      </motion.section>

      {/* ===== КАТЕГОРИИ ===== */}
      <motion.section
        id="categories"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerList(0.1, 0.06)}
      >
        <Section>
          <motion.div variants={fadeUp()}>
            <SectionTitle>{t("catsTitle")}</SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp(0.04)}>
            <SectionSubtitle>{t("catsSub")}</SectionSubtitle>
          </motion.div>

          <motion.div variants={staggerList(0.14, 0.07)}>
            <Grid3>
              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiHome />
                  </CategoryIconBox>
                  {t("catRepair")}
                </CategoryCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiPenTool />
                  </CategoryIconBox>
                  {t("catDesign")}
                </CategoryCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiTool />
                  </CategoryIconBox>
                  {t("catPlumbing")}
                </CategoryCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiCode />
                  </CategoryIconBox>
                  {t("catIT")}
                </CategoryCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiTruck />
                  </CategoryIconBox>
                  {t("catLogistics")}
                </CategoryCard>
              </motion.div>

              <motion.div variants={itemPop} whileHover={{ y: -3 }}>
                <CategoryCard>
                  <CategoryIconBox>
                    <FiTarget />
                  </CategoryIconBox>
                  {t("catElectric")}
                </CategoryCard>
              </motion.div>
            </Grid3>
          </motion.div>
        </Section>
      </motion.section>

      {/* ===== CTA ===== */}
      <motion.div
        variants={fadeUp()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <CtaBanner>
          <div>
            <CtaTitle>{t("ctaBannerTitle")}</CtaTitle>
            <CtaText>{t("ctaBannerText")}</CtaText>
          </div>
          <CtaButtons>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 1 }}>
                <CustomButton>{t("ctaExec")}</CustomButton>
              </motion.span>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 1 }}>
                <CustomButton style={{ background: "#374151" }}>
                  {t("ctaClient")}
                </CustomButton>
              </motion.span>
            </Link>
          </CtaButtons>
        </CtaBanner>
      </motion.div>

      {/* ===== FOOTER ===== */}
      <Footer>
        <FooterCols>
          <FooterCol>
            <FooterTitle>{t("brand")}</FooterTitle>

            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.span whileHover={{ y: -1 }} whileTap={{ y: 1 }}>
                <FooterLink as="span">{t("loginCta") ?? "Войти"}</FooterLink>
              </motion.span>
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.span whileHover={{ y: -1 }} whileTap={{ y: 1 }}>
                <FooterLink as="span">Регистрация</FooterLink>
              </motion.span>
            </Link>

            <FooterLink href="/terms">{t("footerTerms")}</FooterLink>
            <FooterLink href="/privacy">{t("footerPrivacy")}</FooterLink>
          </FooterCol>

          <FooterCol>
            <FooterTitle>{t("footerExecutors")}</FooterTitle>
            <FooterLink href="#">Как пройти верификацию</FooterLink>
            <FooterLink href="#">Создать AI-резюме</FooterLink>
            <FooterLink href="#">Тарифы и оплата</FooterLink>
          </FooterCol>

          <FooterCol>
            <FooterTitle>{t("footerClients")}</FooterTitle>
            <FooterLink href="#">Как разместить заказ</FooterLink>
            <FooterLink href="#">Рейтинг и отзывы</FooterLink>
            <FooterLink href="#">Безопасная сделка</FooterLink>
          </FooterCol>
        </FooterCols>

        <Copy>
          © {new Date().getFullYear()} {t("brand")}
        </Copy>
      </Footer>
    </Shell>
  );
}
