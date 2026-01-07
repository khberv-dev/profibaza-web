import React, { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, MapPin, Wallet, Building2, CalendarDays, Hash } from "lucide-react";
import { getInvestorById, Investor } from "../../shared/endpoints/investor";


/* ============== helpers ============== */
const fmtMoney = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n) ? `${n.toLocaleString("ru-RU")} сум` : "—";

const fmtDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const safeTitle = (name?: string | null) => (name?.trim() ? name.trim() : "Инвестор");
const joinAddr = (a?: string | null, b?: string | null, c?: string | null) =>
  [a, b, c].filter(Boolean).join(", ") || "—";

/* ============== page ============== */
export default function InvestorDetailPage() {
  const { investorId = "" } = useParams<{ investorId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<Investor | null, Error>({
    queryKey: ["opt", "investor", investorId],
    queryFn: ({ signal }) => getInvestorById(investorId, signal),
    enabled: Boolean(investorId),
    staleTime: 60_000,
  });

  const row = data ?? null;

  const address = useMemo(
    () => joinAddr(row?.address1, row?.address2, row?.address3),
    [row?.address1, row?.address2, row?.address3]
  );

  if (isLoading) {
    return (
      <Page>
        <HeaderBar>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Назад
          </BackBtn>
        </HeaderBar>
        <Skeleton />
      </Page>
    );
  }

  if (isError || !row) {
    return (
      <Page>
        <HeaderBar>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Назад
          </BackBtn>
        </HeaderBar>

        <Empty>
          <h3>Инвестор не найден</h3>
          <p>Возможно, ссылка устарела или профиль скрыт.</p>
          <Link className="btn" to="/">
            На главную
          </Link>
        </Empty>
      </Page>
    );
  }

  return (
    <Page>
      <HeaderBar>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Назад
        </BackBtn>
        <div className="spacer" />
      </HeaderBar>

      <Hero>
        <HeroHead>
          <Avatar>
            <Building2 size={34} />
          </Avatar>

          <div className="titlebox">
            <Title>{safeTitle(row.name)}</Title>

            <MetaRow>
              <Pill>
                <BadgeCheck size={14} />
                Профиль инвестора
              </Pill>

              <Dot />

              <span className="muted">
                Обновлено: <b>{fmtDateTime(row.updatedAt)}</b>
              </span>
            </MetaRow>

            <InfoRow>
              <InfoItem title="Сфера деятельности">
                <Building2 size={16} />
                <span className="k">Сфера:</span>
                <span className="v">{row.activityType || "—"}</span>
              </InfoItem>

              <InfoItem title="Сумма инвестиций">
                <Wallet size={16} />
                <span className="k">Инвестиции:</span>
                <span className="v">{fmtMoney(row.investmentAmount)}</span>
              </InfoItem>

              <InfoItem title="Адрес">
                <MapPin size={16} />
                <span className="k">Адрес:</span>
                <span className="v">{address}</span>
              </InfoItem>
            </InfoRow>
          </div>

        </HeroHead>

        <Kpis>
          <Kpi>
            <div className="k">Инвестиции</div>
            <div className="v">{fmtMoney(row.investmentAmount)}</div>
          </Kpi>
          <Kpi>
            <div className="k">Создан</div>
            <div className="v">{fmtDateTime(row.createdAt)}</div>
          </Kpi>
          <Kpi>
            <div className="k">Обновлён</div>
            <div className="v">{fmtDateTime(row.updatedAt)}</div>
          </Kpi>
        </Kpis>

      </Hero>
    </Page>
  );
}

/* ===== STYLES (emerald-ish like your WorkerDetailPage) ===== */
const TOKENS = {
  maxw: "1120px",
  radiusLg: "16px",
  radiusMd: "12px",
  radiusSm: "10px",
  shadowSm: "0 4px 16px rgba(15, 23, 42, .06)",
  shadowMd: "0 16px 48px rgba(2, 32, 71, .08)",
  line: "#E6EAF1",
  bgSoft: "#F6F8FB",
  cardBg: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  primary: "#10B981",
  primaryHover: "#059669",
  primaryRing: "rgba(16, 185, 129, .35)",
  primarySoftBg: "#ECFDF5",
  primarySoftLine: "#D1FAE5",
};

const Page = styled.div`
  background: ${TOKENS.bgSoft};
  min-height: 100vh;
`;

const HeaderBar = styled.header`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;

  .spacer {
    flex: 1;
  }
`;

const BackBtn = styled.button`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  border: 1px solid ${TOKENS.line};
  background: ${TOKENS.cardBg};
  cursor: pointer;
  color: ${TOKENS.text};
  font-weight: 700;
  border-radius: ${TOKENS.radiusSm};
  padding: 8px 10px;
  box-shadow: ${TOKENS.shadowSm};
  transition: transform 0.06s ease, background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: #fbfcff;
    border-color: #dde3ee;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid ${TOKENS.primary};
    outline-offset: 2px;
  }
`;

const Hero = styled.section`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
  padding: 16px 20px 28px;
`;

const HeroHead = styled.div`
  background: ${TOKENS.cardBg};
  border-radius: ${TOKENS.radiusLg};
  padding: 24px;
  border: 1px solid ${TOKENS.line};
  box-shadow: ${TOKENS.shadowMd};
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Avatar = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${TOKENS.primarySoftBg};
  border: 1px solid ${TOKENS.primarySoftLine};
  color: ${TOKENS.primary};
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 26px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: ${TOKENS.text};
  font-weight: 900;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: ${TOKENS.textMuted};
  font-size: 13px;

  .muted b {
    color: ${TOKENS.text};
  }
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  color: ${TOKENS.primary};
  background: ${TOKENS.primarySoftBg};
  border: 1px solid ${TOKENS.primarySoftLine};
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
  display: inline-block;
`;

const InfoRow = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${TOKENS.textMuted};
  font-size: 14px;

  .k {
    color: ${TOKENS.textMuted};
    font-weight: 700;
  }
  .v {
    color: ${TOKENS.text};
    font-weight: 800;
  }
  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-weight: 700;
    font-size: 13px;
  }
`;

const Actions = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
`;

const PrimaryBtn = styled.button`
  height: 44px;
  border-radius: ${TOKENS.radiusMd};
  border: 0;
  cursor: pointer;
  font-weight: 900;
  color: #0b1b13;
  background: linear-gradient(180deg, ${TOKENS.primary} 0%, ${TOKENS.primaryHover} 100%);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.24);
  transition: transform 0.06s ease, filter 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    filter: brightness(1.02);
    box-shadow: 0 12px 28px rgba(16, 185, 129, 0.28);
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid ${TOKENS.primary};
    outline-offset: 2px;
  }
`;

const SecondaryBtn = styled.button`
  height: 44px;
  border-radius: ${TOKENS.radiusMd};
  cursor: pointer;
  font-weight: 900;
  color: ${TOKENS.text};
  background: transparent;
  border: 1.5px solid ${TOKENS.line};
  transition: transform 0.06s ease, border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${TOKENS.primary};
    background: ${TOKENS.primarySoftBg};
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    box-shadow: 0 0 0 4px ${TOKENS.primaryRing};
  }
`;

const Kpis = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Kpi = styled.div`
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.radiusMd};
  padding: 12px 14px;
  box-shadow: ${TOKENS.shadowSm};

  .k {
    font-size: 12px;
    color: ${TOKENS.textMuted};
    font-weight: 800;
  }
  .v {
    margin-top: 2px;
    font-weight: 900;
    color: ${TOKENS.text};
    font-size: 16px;
  }
`;

const Block = styled.section`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`;

const BlockTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${TOKENS.text};
`;

const Details = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;

  li {
    background: ${TOKENS.cardBg};
    border: 1px solid ${TOKENS.line};
    border-radius: ${TOKENS.radiusMd};
    padding: 12px 14px;
    box-shadow: ${TOKENS.shadowSm};
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .k {
    color: ${TOKENS.textMuted};
    font-weight: 800;
  }

  .v {
    color: ${TOKENS.text};
    font-weight: 900;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-weight: 800;
    font-size: 13px;
  }
`;

const Empty = styled.div`
  max-width: 820px;
  margin: 44px auto;
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.radiusLg};
  padding: 40px 28px;
  text-align: center;
  box-shadow: ${TOKENS.shadowMd};
  color: ${TOKENS.text};

  h3 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 900;
  }
  p {
    margin: 0;
    color: ${TOKENS.textMuted};
  }
  .btn {
    display: inline-block;
    margin-top: 16px;
    height: 40px;
    padding: 0 14px;
    border-radius: ${TOKENS.radiusMd};
    background: ${TOKENS.primary};
    color: #fff;
    font-weight: 900;
    line-height: 40px;
    border: 0;
    text-decoration: none;
  }
`;

const Skeleton = () => (
  <div style={{ maxWidth: TOKENS.maxw, margin: "0 auto", padding: "0 20px" }}>
    <div
      style={{
        height: 220,
        background: "linear-gradient(90deg, #fff 25%, #F3F6FB 37%, #fff 63%)",
        backgroundSize: "400% 100%",
        border: `1px solid ${TOKENS.line}`,
        borderRadius: TOKENS.radiusLg,
        boxShadow: TOKENS.shadowMd,
        animation: "shimmer 1.4s infinite",
      }}
    />
    <style>
      {`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}
    </style>
  </div>
);
