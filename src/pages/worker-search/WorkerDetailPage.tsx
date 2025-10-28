// src/pages/WorkerDetailPage.tsx
import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { Image, Rate } from "antd";
import { ArrowLeft, Share2, Heart, BadgeCheck, Phone } from "lucide-react";
import { getWorkerById } from "../../shared/endpoints/client";
import { useAuthStore } from "../../shared/stores/auth";
import { EditBtn } from "../../features/profile/pro-profile-section.style";

/* ============== types ============== */
type SearchWorkerUser = {
  name?: string;
  surname?: string;
  middleName?: string | null;
  avatar?: string | null;
  phone?: string | null;
};
type Schedule = {
  id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};
type Experience = {
  id: string;
  startedAt?: number | null;
  endedAt?: number | null;
  jobPlace?: string | null;
  jobDescription?: string | null;
};
type OrderRow = {
  id: string;
  description?: string | null;
  budget?: number | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  files?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};
type WorkerRow = {
  id: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  hasTeam: boolean;
  teamMemberCount: number;
  readyForHugeProject: boolean;
  inventory?: string | null;
  competitions?: "YES" | "NO";
  jobType?: "SOLO" | "COMPANY";
  professionId: string;
  updatedAt?: string;
  isBusy?: boolean;
  inArea?: boolean;
  worker?: { id: string; user?: SearchWorkerUser };
  schedule?: Schedule;
  experience?: Experience[];
  orders?: OrderRow[];
};

/* ============== helpers ============== */
const WEEK_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const WEEK_LABELS: Record<(typeof WEEK_ORDER)[number], string> = {
  monday: "Пн",
  tuesday: "Вт",
  wednesday: "Ср",
  thursday: "Чт",
  friday: "Пт",
  saturday: "Сб",
  sunday: "Вс",
};

const fmtMoney = (n?: number | null) =>
  typeof n === "number" && n >= 0 ? `${n.toLocaleString("ru-RU")} сум` : "—";
const fio = (u?: { name?: string; surname?: string; middleName?: string | null }) =>
  [u?.surname, u?.name].filter(Boolean).join(" ") || "Мастер";
const initials = (u?: { name?: string; surname?: string }) =>
  ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M";
const fmtUpdated = (d?: string) => {
  if (!d) return "—";
  const dd = new Date(d);
  if (Number.isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const fmtYears = (start?: number | null, end?: number | null) =>
  `${start ? start : "—"} — ${end ? end : "по наст."}`;
const plural = (n: number, f: [string, string, string]) => {
  const a = Math.abs(n) % 100,
    b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1 && b < 5) return f[1];
  if (b === 1) return f[0];
  return f[2];
};


const formatPhone = (p?: string | null) => {
    if (!p) return "";
    const digits = p.replace(/\D+/g, "");
    // простое приведение к +998 (или +7) — подставь свою логику при желании
    if (digits.startsWith("998")) return `+${digits}`;
    if (digits.startsWith("7")) return `+${digits}`;
    if (digits.startsWith("8")) return `+7${digits.slice(1)}`;
    if (digits.startsWith("0")) return `+998${digits.slice(1)}`;
    return digits.startsWith("+") ? digits : `+${digits}`;
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // при желании можно всплывашку/тост
    } catch {}
  };

/* ============== page ============== */
const WorkerDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.me);
  const isAuthed = useAuthStore((s) => s.isAuthed);

  const { data, isLoading, isError } = useQuery<WorkerRow | null, Error>({
    queryKey: ["opt", "order-search", "worker", id],
    queryFn: async ({ signal }) => {
      const res = await getWorkerById(id, signal);
      return (res as unknown as WorkerRow) ?? null;
    },
    enabled: Boolean(id),
  });

  // ===== CONSTANTS / HELPERS (не хуки) =====
  const FILE_CDN =
    import.meta.env.VITE_FILES_CDN || "https://pointer.uz/public/order/";
  const AVA_CDN = "https://pointer.uz/public/avatar/";
  const fileUrl = (name?: string | null) =>
    name ? `${FILE_CDN}${encodeURIComponent(name)}` : "";

  // ===== ВСЕ useMemo ДОЛЖНЫ БЫТЬ ДО ЛЮБЫХ return =====
  const row = data ?? null;

  const orders = useMemo<OrderRow[]>(
    () => (Array.isArray(row?.orders) ? row!.orders! : []),
    [row]
  );

  const totalPhotos = useMemo(
    () => orders.reduce((acc, o) => acc + (o.files?.length || 0), 0),
    [orders]
  );

  const files = useMemo<string[]>(
    () => Array.from(new Set(orders.flatMap((o) => o.files || []))),
    [orders]
  );

  const expYears = useMemo(() => {
    const items = row?.experience || [];
    if (!items.length) return null;
    const nowY = new Date().getFullYear();
    const min = Math.min(...items.map((e) => e.startedAt ?? nowY));
    const max = Math.max(...items.map((e) => e.endedAt ?? nowY));
    const dur = Math.max(1, max - min + 1);
    return `${dur} ${plural(dur, ["год", "года", "лет"])}`;
  }, [row]);

  const exps = useMemo(() => {
    const items = Array.isArray(row?.experience) ? row!.experience! : [];
    if (!items.length) return [];
    const nowY = new Date().getFullYear();
    return [...items]
      .map((e) => ({
        startedAt: e.startedAt ?? null,
        endedAt: e.endedAt ?? null,
        jobPlace: e.jobPlace ?? null,
        jobDescription: e.jobDescription ?? null,
        sortKey: (e.endedAt ?? nowY) * 10000 + (e.startedAt ?? nowY),
      }))
      .sort((a, b) => b.sortKey - a.sortKey);
  }, [row]);

  const avatar = row?.worker?.user?.avatar ?? null;

  const onOrder = (wpId: string) => {
    const url = new URL("/app/client/create-order", window.location.origin);
    url.searchParams.set("workerProfessionId", wpId);
    window.location.href = url.toString();
  };

  // ===== ТЕПЕРЬ МОЖНО ДЕЛАТЬ УСЛОВНЫЕ RETURN'ы =====
  if (isLoading) {
    return (
      <Page>
        <HeaderBar>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Назад
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
            <ArrowLeft size={18} />
            Назад
          </BackBtn>
        </HeaderBar>
        <Empty>
          <h3>Профиль не найден</h3>
          <p>Возможно, ссылка устарела или мастер скрыт.</p>
          <Link className="btn" to="/app/find">
            Вернуться к поиску
          </Link>
        </Empty>
      </Page>
    );
  }

  return (
    <Page>
      <HeaderBar>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Назад
        </BackBtn>
        <div className="spacer" />
        <IconRow>
          <IconBtn title="В избранное">
            <Heart size={18} />
          </IconBtn>
          <IconBtn title="Поделиться">
            <Share2 size={18} />
          </IconBtn>
        </IconRow>
      </HeaderBar>

      <Hero>
        <HeroHead>
          <Avatar $src={avatar ? `${AVA_CDN}${avatar}` : null}>
            {!avatar && initials(row.worker?.user)}
          </Avatar>

          <div className="titlebox">
            <Title>
              {fio(row.worker?.user)}
              {/* {row.competitions === "YES" && (
                <Badge>
                  <BadgeCheck size={16} /> Тендеры
                </Badge>
              )} */}
            </Title>

            <MetaRow>
              <Rate allowHalf disabled value={row.rating ?? 0} style={{ fontSize: 16 }} />
              <strong className="rating">{(row.rating ?? 0).toFixed(1)}</strong>
              <Dot />
              <span className="upd">
                {fmtUpdated(row.updatedAt) !== "—"
                  ? `Обновлено ${fmtUpdated(row.updatedAt)}`
                  : "—"}
              </span>
            </MetaRow>

            <PriceLine>
              {fmtMoney(row.minPrice)} — {fmtMoney(row.maxPrice)}{" "}
              <span className="muted">на проект</span>
            </PriceLine>

         {row.worker?.user?.phone ? (
  isAuthed ? (
    <PhoneRow>
      <Phone size={16} />
      <a
        href={`tel:${formatPhone(row.worker.user.phone)}`}
        className="phone"
      >
        {formatPhone(row.worker.user.phone)}
      </a>

      <PhoneActions>
        <SmallBtn
          type="button"
          onClick={() => copyToClipboard(formatPhone(row.worker!.user!.phone!))}
          title="Скопировать"
        >
          Копировать
        </SmallBtn>
      </PhoneActions>
    </PhoneRow>
  ) : (
    <PhoneGate>
      <span className="hint">Телефон доступен после входа</span>
      <ShowPhoneBtn
        onClick={() => {
          const url = new URL("/login", window.location.origin);
          url.searchParams.set("redirect", window.location.pathname);
          window.location.href = url.toString();
        }}
      >
        Показать телефон
      </ShowPhoneBtn>
    </PhoneGate>
  )
) : null}

            <Pills>
              <Pill tone={row.isBusy ? "red" : "green"}>
                {row.isBusy ? "Занят" : "Свободен"}
              </Pill>
              {row.jobType && (
                <Pill>{row.jobType === "SOLO" ? "Соло" : "Компания"}</Pill>
              )}
              {row.hasTeam && <Pill>Команда · {row.teamMemberCount || 1}</Pill>}
              {row.readyForHugeProject && <Pill>Крупные проекты</Pill>}
            </Pills>
          </div>

          <Actions>
            <PrimaryBtn onClick={() => onOrder(row.id)}>Откликнуться</PrimaryBtn>
            <EditBtn style={{width: '100%'}} onClick={() => onOrder(row.id)}>Связаться</EditBtn>
          </Actions>
        </HeroHead>

        <Kpis>
          <Kpi>
            <div className="k">Опыт</div>
            <div className="v">{expYears ?? "—"}</div>
          </Kpi>
          <Kpi>
            <div className="k">Проекты</div>
            <div className="v">{orders.length || 0}</div>
          </Kpi>
          <Kpi>
            <div className="k">Фото</div>
            <div className="v">{totalPhotos}</div>
          </Kpi>
        </Kpis>

        {exps.length > 0 && (
          <Block style={{ marginTop: 18 }}>
            <BlockTitle>Опыт работы</BlockTitle>
            <ExpList>
              {exps.map((e, idx) => (
                <ExpItem key={idx}>
                  <span className="dot" />
                  <div className="meta">
                    <div className="line1">
                      <strong className="range">
                        {fmtYears(e.startedAt, e.endedAt)}
                      </strong>
                      {e.jobPlace && <span className="place"> · {e.jobPlace}</span>}
                    </div>
                    {e.jobDescription && (
                      <div className="desc">{e.jobDescription}</div>
                    )}
                  </div>
                </ExpItem>
              ))}
            </ExpList>
          </Block>
        )}
      </Hero>

      {files.length > 0 && (
        <Block>
          <BlockTitle>Фото работ</BlockTitle>
          <Image.PreviewGroup key={`wp-${row.id}`}>
            <FilesGrid>
              {files.map((fname) => {
                const src = fileUrl(fname);
                if (!src) return null;
                return <Image key={fname} src={src} alt="Фото из заказа" className="img" />;
              })}
            </FilesGrid>
          </Image.PreviewGroup>
        </Block>
      )}
    </Page>
  );
};

export default WorkerDetailPage;

/* ===== STYLES (refined, emerald) ===== */
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
  green: "#10B981",
  red: "#DC2626",
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

const IconRow = styled.div`
  display: flex;
  gap: 10px;
`;

const IconBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: ${TOKENS.radiusSm};
  border: 1px solid ${TOKENS.line};
  background: ${TOKENS.cardBg};
  display: grid;
  place-items: center;
  cursor: pointer;
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

const Avatar = styled.div<{ $src: string | null }>`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eef2f8;
  background: ${({ $src }) => ($src ? `url(${$src}) center/cover` : "#111827")};
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 28px;
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

const Badge = styled.span`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  color: ${TOKENS.primary};
  background: #eef4ff;
  border: 1px solid #dde8ff;
  margin-left: 10px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: ${TOKENS.textMuted};
  font-size: 13px;

  .rating {
    color: ${TOKENS.text};
    font-weight: 800;
  }
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
  display: inline-block;
`;

const PriceLine = styled.div`
  margin-top: 8px;
  font-weight: 800;
  color: ${TOKENS.text};
  font-size: 18px;

  .muted {
    color: ${TOKENS.textMuted};
    font-weight: 600;
  }
`;

const PhoneBox = styled.div`
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${TOKENS.green};
  font-weight: 700;
  background: ${TOKENS.primarySoftBg};
  border: 1px solid ${TOKENS.primarySoftLine};
  padding: 6px 10px;
  border-radius: ${TOKENS.radiusSm};
`;

const Pills = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Pill = styled.span<{ tone?: "green" | "red" }>`
  --c: ${({ tone }) => (tone === "red" ? TOKENS.red : TOKENS.green)};
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  background: color-mix(in oklab, var(--c) 12%, white);
  color: var(--c);
  border: 1px solid color-mix(in oklab, var(--c) 22%, white);
`;

const Actions = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
`;

const Primary = styled.button`
  height: 44px;
  border-radius: ${TOKENS.radiusMd};
  border: 0;
  cursor: pointer;
  font-weight: 800;
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

const Secondary = styled.button`
  height: 44px;
  border-radius: ${TOKENS.radiusMd};
  cursor: pointer;
  font-weight: 800;
  color: ${TOKENS.text};
  background: transparent;
  border: 1.5px solid ${TOKENS.line};
  transition: transform 0.06s ease, border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

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
  }
  .v {
    margin-top: 2px;
    font-weight: 900;
    color: ${TOKENS.text};
    font-size: 18px;
  }
`;

const Block = styled.section`
  max-width: ${TOKENS.maxw};
  margin: 18px auto 0;
  padding: 0 20px;
  display: grid;
  gap: 12px;
`;

const BlockTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${TOKENS.text};
`;

const FilesGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  .img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: ${TOKENS.radiusMd};
    border: 1px solid ${TOKENS.line};
    box-shadow: ${TOKENS.shadowSm};
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 40px rgba(2, 32, 71, 0.1);
    }
  }
`;

const ExpList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
`;

const ExpItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 10px;
  align-items: start;
  position: relative;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: ${TOKENS.primary};
    margin-top: 6px;
    box-shadow: 0 0 0 4px ${TOKENS.primarySoftBg};
  }

  .meta {
    background: ${TOKENS.cardBg};
    border: 1px solid ${TOKENS.line};
    border-radius: ${TOKENS.radiusMd};
    padding: 10px 12px;
    box-shadow: ${TOKENS.shadowSm};
  }

  .line1 {
    font-size: 14px;
    color: ${TOKENS.text};
    font-weight: 800;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .range {
    letter-spacing: 0.01em;
  }

  .place {
    color: ${TOKENS.textMuted};
    font-weight: 700;
  }

  .desc {
    margin-top: 4px;
    color: ${TOKENS.textMuted};
    font-size: 13px;
    line-height: 1.35;
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
    font-weight: 800;
    line-height: 40px;
    border: 0;
    text-decoration: none;
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.24);
    transition: background 0.15s ease, transform 0.06s ease;

    &:hover {
      background: ${TOKENS.primaryHover};
    }
    &:active {
      transform: translateY(1px);
    }
  }
`;


export const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  background: #0070ff;
  color: #fff;
  border: 1px solid #0070ff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 44px;
  }
`;

const Skeleton = () => (
  <div style={{ maxWidth: TOKENS.maxw, margin: "0 auto", padding: "0 20px" }}>
    <div
      style={{
        height: 196,
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


const PhoneRow = styled.div`
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f0f6ff;
  border: 1px solid #cfe3ff;
  padding: 8px 12px;
  border-radius: ${TOKENS.radiusSm};
  color: #0070ff;
  font-weight: 800;

  .phone {
    color: ${TOKENS.text};
    font-weight: 800;
    text-decoration: none;
  }
`;

const PhoneActions = styled.div`
  display: inline-flex;
  gap: 8px;
  margin-left: 4px;
`;

const SmallBtn = styled.button`
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #d3e2ff;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #f4f8ff;
    border-color: #0070ff;
    color: #0070ff;
  }

  &:focus-visible {
    outline: 2px solid #0070ff;
    outline-offset: 2px;
  }
`;

const PhoneGate = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: #ffffff;
  border: 1px dashed #d3e2ff;
  padding: 8px 10px;
  border-radius: ${TOKENS.radiusSm};

  .hint {
    color: ${TOKENS.textMuted};
    font-size: 13px;
    font-weight: 600;
  }
`;

const ShowPhoneBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  font-weight: 800;
  border: 1px solid #0070ff;
  background: #f0f6ff;
  color: #0056d6;
  cursor: pointer;
  transition: transform 0.06s ease, background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #e6efff;
    color: #0045b3;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #0070ff;
    outline-offset: 2px;
  }
`;