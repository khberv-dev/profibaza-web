// src/pages/client/CreateOrderPage.tsx  (или твой путь)
import React from "react";
import styled from "@emotion/styled";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CreateOrderCard } from "../../../features/profile/pages/components/client/CreateOrderCard";

// Если используешь react-router-dom v6 — можно подключить useSearchParams.
// Но код ниже и так работает: берём query из window.location.
const useWorkerProfessionId = () => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("workerProfessionId");
};

const CreateOrderPage: React.FC = () => {
  const { t } = useTranslation();
  const initialWorkerProfessionId = useWorkerProfessionId();

  return (
    <Page>
      <Hero>
        <Crumbs>
          <a
            href="#"
            className="back"
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1) window.history.back();
              else window.location.href = "/"; // запасной вариант
            }}
          >
            <ChevronLeft size={16} />
            {t("worker.back")}
          </a>
          <span>{t("orders.create.breadcrumbOrders")}</span>
          <em>{t("orders.create.breadcrumbCreate")}</em>
        </Crumbs>

        <HeroTitle>
          {t("orders.create.title")}
          <SafeBadge>
            <ShieldCheck size={14} />
            {t("orders.create.safeDeal")}
          </SafeBadge>
        </HeroTitle>
        <HeroSub>{t("orders.create.pageSubtitle")}</HeroSub>
      </Hero>

      <MainWrap>
        <CreateOrderCard initialWorkerProfessionId={initialWorkerProfessionId} />
      </MainWrap>
    </Page>
  );
};

export default CreateOrderPage;

/* ===== STYLES ===== */

const Page = styled.div`
  min-height: 100dvh;
  background:
    radial-gradient(1200px 600px at 10% -20%, #eef5ff 0%, transparent 60%),
    radial-gradient(1200px 600px at 100% 0%, #f9fbff 0%, transparent 55%),
    #f6f8fc;
`;

const Hero = styled.header`
  padding: 28px 20px 8px;
  border-bottom: 1px solid #e9eef8;
  background:
    linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,.92) 100%),
    radial-gradient(600px 240px at 20% 0%, #eff5ff 0%, transparent 60%);
`;

const Crumbs = styled.nav`
  max-width: 1160px;
  margin: 0 auto 8px;
  font-size: 12px;
  color: #6b7a90;
  display: flex;
  gap: 10px;
  align-items: center;

  .back {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: #3558ff;
    text-decoration: none;
    font-weight: 700;
  }

  span::after {
    content: "·";
    margin: 0 8px;
    color: #c4cbd8;
  }
  em {
    font-style: normal;
    color: #12284a;
    font-weight: 700;
  }
`;

const HeroTitle = styled.h1`
  max-width: 1160px;
  margin: 0 auto;
  color: #12284a;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SafeBadge = styled.span`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #0b6b40;
  background: #e9fbf2;
  border: 1px solid #bdf3d7;
`;

const HeroSub = styled.p`
  max-width: 1160px;
  margin: 8px auto 16px;
  color: #6b7a90;
  font-size: 14px;
`;

const MainWrap = styled.main`
  max-width: 1160px;
  margin: 0 auto;
  padding: 18px 20px 32px;
  display: grid;
  gap: 16px;
`;
