// src/pages/WorkerDetailPage.tsx
import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { Image, Rate } from "antd";
import {
  ArrowLeft,
  Phone,
  FileText,
  ImageIcon,
  Briefcase,
  Users,
  Building2,
  Trophy,
  Wrench,
  Clock,
  Activity,
  Star,
  Banknote,
  Calendar,
  FolderKanban,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getWorkerById,
  type OrderBrief,
  type SearchWorker,
} from "../../shared/endpoints/client";
import { getProfessions, type ProfessionCategory } from "../../shared/modules/worker";
import { useAuthStore } from "../../shared/stores/auth";
import { useOrderLabels } from "../../shared/i18n/useOrderLabels";
import { motion } from "framer-motion";
import { Stagger, StaggerItem } from "../../components/Stagger";
import { fadeUp } from "../../lib/motion";
import { avatarUrl, onAvatarError } from "../../shared/lib/avatar";
import { demoPublicUrl, orderPublicUrl } from "../../shared/lib/public-url";

/* ============== types ============== */
type DemoRaw = {
  id?: string;
  fileId?: string;
  comment?: string | null;
  createdAt?: string;
};
type DemoItem = string | DemoRaw;

/* ============== helpers ============== */
const fmtMoney = (n?: number | null) =>
  typeof n === "number" && n >= 0 ? `${n.toLocaleString("ru-RU")} сум` : "—";
const fio = (u?: {
  name?: string;
  surname?: string;
  middleName?: string | null;
}) =>
  [u?.surname, u?.name, u?.middleName].filter(Boolean).join(" ") || "Мастер";
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
const fmtAddress = (o?: Pick<OrderBrief, "address1" | "address2" | "address3">) =>
  [o?.address1, o?.address2, o?.address3].filter(Boolean).join(", ") || "—";
const demoUrlFromFileId = (fileId: string) => demoPublicUrl(fileId);
const demoFileId = (item: DemoItem): string =>
  typeof item === "string" ? item : item.fileId || "";
const normalizeDemos = (items?: DemoItem[]) =>
  (Array.isArray(items) ? items : [])
    .map((item) => demoFileId(item))
    .filter(Boolean);
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

const onOrder = (wpId: string) => {
  const url = new URL("/app/client/create-order", window.location.origin);
  url.searchParams.set("workerProfessionId", wpId);
  window.location.href = url.toString();
};

/* ============== page ============== */
const WorkerDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("uz") ? "uz" : "ru";
  const { fmtDate, getStatus } = useOrderLabels();

  const { data, isLoading, isError } = useQuery<SearchWorker | null, Error>({
    queryKey: ["opt", "order-search", "worker", id],
    queryFn: async ({ signal }) => {
      const res = await getWorkerById(id, signal);
      return res ?? null;
    },
    enabled: Boolean(id),
  });

  const { data: profCats = [] } = useQuery<ProfessionCategory[]>({
    queryKey: ["opt", "professions"],
    queryFn: ({ signal }) => getProfessions(signal),
    staleTime: 5 * 60 * 1000,
  });

  const profLabelById = useMemo(() => {
    const flat = profCats.flatMap((c) => c.professions || []);
    return (professionId?: string) => {
      if (!professionId) return "—";
      const found = flat.find((p) => p.id === professionId);
      if (!found) return "—";
      return lang === "uz" ? found.nameUz : found.nameRu;
    };
  }, [profCats, lang]);

  // ===== CONSTANTS / HELPERS (не хуки) =====
  const fileUrl = (name?: string | null) => orderPublicUrl(name);

  // ===== ВСЕ useMemo ДОЛЖНЫ БЫТЬ ДО ЛЮБЫХ return =====
  const row = data ?? null;

  const orders = useMemo<OrderBrief[]>(
    () => (Array.isArray(row?.orders) ? row!.orders! : []),
    [row]
  );

  const demos = useMemo(
    () => normalizeDemos(row?.demos as DemoItem[] | undefined),
    [row]
  );

  const isBusy = useMemo(
    () =>
      row?.isBusy ??
      orders.some((o) => o.status === "PROGRESS" || o.status === "IN_PROGRESS"),
    [row, orders]
  );

  const professionLabel = useMemo(
    () =>
      row?.profession
        ? lang === "uz"
          ? row.profession.nameUz
          : row.profession.nameRu
        : profLabelById(row?.professionId),
    [row, lang, profLabelById]
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

  const avatarSrc = avatarUrl(row?.worker?.user?.avatar);

  // ===== ТЕПЕРЬ МОЖНО ДЕЛАТЬ УСЛОВНЫЕ RETURN'ы =====
  if (isLoading) {
    return (
      <Page>
        <PageShell>
          <TopNav>
            <BackBtn type="button" onClick={() => navigate(-1)} aria-label="Назад">
              <ArrowLeft size={18} />
            </BackBtn>
            <TopNavTitle>Профиль мастера</TopNavTitle>
          </TopNav>
          <Skeleton />
        </PageShell>
      </Page>
    );
  }

  if (isError || !row) {
    return (
      <Page>
        <PageShell>
          <TopNav>
            <BackBtn type="button" onClick={() => navigate(-1)} aria-label="Назад">
              <ArrowLeft size={18} />
            </BackBtn>
            <TopNavTitle>Профиль мастера</TopNavTitle>
          </TopNav>
          <Empty>
          <h3>Профиль не найден</h3>
          <p>Возможно, ссылка устарела или мастер скрыт.</p>
          <Link className="btn" to="/find">
            Вернуться к поиску
          </Link>
        </Empty>
        </PageShell>
      </Page>
    );
  }

  return (
    <Page>
      <PageShell>
        <motion.div initial="hidden" animate="show" variants={fadeUp(0)}>
          <TopNav>
            <BackBtn type="button" onClick={() => navigate(-1)} aria-label="Назад">
              <ArrowLeft size={18} />
            </BackBtn>
            <TopNavTitle>Профиль мастера</TopNavTitle>
          </TopNav>
        </motion.div>

        <LayoutGrid>
          <MainCol>
            <Stagger style={{ display: "grid", gap: 20, width: "100%" }}>
            <StaggerItem>
            <Card>
              <SummaryRow>
                <AvatarSquare src={avatarSrc} alt="" onError={onAvatarError} />
                <SummaryBody>
                  <Title>{fio(row.worker?.user)}</Title>
                  <Subtitle>
                    {professionLabel}
                    {professionLabel !== "—" ? " · " : ""}
                    {row.jobType === "COMPANY" ? "Компания" : "Исполнитель"}
                    {row.hasTeam ? ` · Команда ${row.teamMemberCount || 1} чел.` : ""}
                  </Subtitle>
                  <SummaryMeta>
                    <MetaRow>
                      <span className="label">Профессия</span>
                      <span className="value">{professionLabel}</span>
                    </MetaRow>
                    <MetaRow>
                      <span className="label">Телефон</span>
                      <span className="value">
                        {row.worker?.user?.phone
                          ? isAuthed
                            ? formatPhone(row.worker.user.phone)
                            : "Доступен после входа"
                          : "—"}
                      </span>
                    </MetaRow>
                    <MetaRow>
                      <span className="label">Рейтинг</span>
                      <span className="value rating">
                        <Rate
                          allowHalf
                          disabled
                          value={row.rating ?? 0}
                          style={{ fontSize: 14, marginRight: 6 }}
                        />
                        {(row.rating ?? 0).toFixed(1)}
                      </span>
                    </MetaRow>
                  </SummaryMeta>
                </SummaryBody>
              </SummaryRow>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card>
              <CardHead>
                <CardHeadText>
                  <CardTitle>Основная информация</CardTitle>
                  <CardSubtitle>Статус, стоимость и ключевые показатели</CardSubtitle>
                </CardHeadText>
                <CardHeadActions>
                  <OutlineBtn type="button" onClick={() => onOrder(row.id)}>
                    Связаться
                  </OutlineBtn>
                  <PrimaryBtn type="button" onClick={() => onOrder(row.id)}>
                    Заказать
                  </PrimaryBtn>
                </CardHeadActions>
              </CardHead>
              <InfoPanel>
                <InfoGrid>
                  <InfoTile>
                    <InfoIcon $tone={isBusy ? "red" : "green"}>
                      <Activity size={18} />
                    </InfoIcon>
                    <InfoBody>
                      <span className="label">Статус</span>
                      <span className="value">
                        <StatusBadge $tone={isBusy ? "red" : "green"}>
                          {isBusy ? "Занят" : "Свободен"}
                        </StatusBadge>
                      </span>
                    </InfoBody>
                  </InfoTile>

                  <InfoTile>
                    <InfoIcon $tone="amber">
                      <Star size={18} />
                    </InfoIcon>
                    <InfoBody>
                      <span className="label">Рейтинг</span>
                      <span className="value rating">
                        <Rate
                          allowHalf
                          disabled
                          value={row.rating ?? 0}
                          style={{ fontSize: 13, marginRight: 6 }}
                        />
                        {(row.rating ?? 0).toFixed(1)}
                      </span>
                    </InfoBody>
                  </InfoTile>

                  <InfoTile>
                    <InfoIcon $tone="blue">
                      <FolderKanban size={18} />
                    </InfoIcon>
                    <InfoBody>
                      <span className="label">Проектов</span>
                      <span className="value">{orders.length}</span>
                    </InfoBody>
                  </InfoTile>

                  <InfoTile $wide>
                    <InfoIcon $tone="blue">
                      <Banknote size={18} />
                    </InfoIcon>
                    <InfoBody>
                      <span className="label">Стоимость работ</span>
                      <span className="value">
                        {fmtMoney(row.minPrice)}
                        <span className="sep">—</span>
                        {fmtMoney(row.maxPrice)}
                      </span>
                    </InfoBody>
                  </InfoTile>

                  <InfoTile>
                    <InfoIcon $tone="purple">
                      <Calendar size={18} />
                    </InfoIcon>
                    <InfoBody>
                      <span className="label">Дата регистрации</span>
                      <span className="value">{fmtUpdated(row.createdAt)}</span>
                    </InfoBody>
                  </InfoTile>
                </InfoGrid>
              </InfoPanel>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card>
              <CardHead>
                <CardTitle>Сведения о работе</CardTitle>
              </CardHead>
              <EmpGrid>
                <EmpItem>
                  <EmpIconBox>
                    <Briefcase size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Формат работы</span>
                    <span className="value">
                      {row.jobType === "SOLO" ? "Соло" : "Компания"}
                    </span>
                  </EmpContent>
                </EmpItem>
                <EmpItem>
                  <EmpIconBox>
                    <Users size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Команда</span>
                    <span className="value">
                      {row.hasTeam ? `${row.teamMemberCount || 1} человек` : "Нет"}
                    </span>
                  </EmpContent>
                </EmpItem>
                <EmpItem>
                  <EmpIconBox>
                    <Building2 size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Крупные проекты</span>
                    <span className="value">
                      {row.readyForHugeProject ? "Да" : "Нет"}
                    </span>
                  </EmpContent>
                </EmpItem>
                <EmpItem>
                  <EmpIconBox>
                    <Trophy size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Тендеры</span>
                    <span className="value">
                      {row.competitions === "YES" ? "Участвует" : "Нет"}
                    </span>
                  </EmpContent>
                </EmpItem>
                <EmpItem>
                  <EmpIconBox>
                    <Wrench size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Инструменты</span>
                    <span className="value">
                      {row.inventory?.trim() || "Не указано"}
                    </span>
                  </EmpContent>
                </EmpItem>
                <EmpItem>
                  <EmpIconBox>
                    <Clock size={18} />
                  </EmpIconBox>
                  <EmpContent>
                    <span className="label">Опыт</span>
                    <span className="value">{expYears ?? "—"}</span>
                  </EmpContent>
                </EmpItem>
              </EmpGrid>
            </Card>
            </StaggerItem>

            {exps.length > 0 && (
              <StaggerItem>
              <Card>
                <CardHead>
                  <CardTitle>Опыт работы</CardTitle>
                </CardHead>
                <GrayPanel>
                  <ExpList>
                    {exps.map((e, idx) => (
                      <ExpItem key={idx}>
                        <span className="dot" />
                        <div className="meta">
                          <div className="line1">
                            <strong>{fmtYears(e.startedAt, e.endedAt)}</strong>
                            {e.jobPlace && (
                              <span className="place"> · {e.jobPlace}</span>
                            )}
                          </div>
                          {e.jobDescription && (
                            <div className="desc">{e.jobDescription}</div>
                          )}
                        </div>
                      </ExpItem>
                    ))}
                  </ExpList>
                </GrayPanel>
              </Card>
              </StaggerItem>
            )}

            {(files.length > 0 || demos.length > 0) && (
              <StaggerItem>
              <Card>
                <CardHead>
                  <CardTitle>Фото работ</CardTitle>
                </CardHead>
                <GrayPanel $plain>
                  <Image.PreviewGroup key={`media-${row.id}`}>
                    <PhotoGrid>
                      {demos.map((fileId) => (
                        <Image
                          key={`demo-${fileId}`}
                          src={demoUrlFromFileId(fileId)}
                          alt="Демо"
                          className="thumb"
                        />
                      ))}
                      {files.map((fname) => {
                        const src = fileUrl(fname);
                        if (!src) return null;
                        return (
                          <Image
                            key={fname}
                            src={src}
                            alt="Фото из заказа"
                            className="thumb"
                          />
                        );
                      })}
                    </PhotoGrid>
                  </Image.PreviewGroup>
                </GrayPanel>
              </Card>
              </StaggerItem>
            )}
            </Stagger>
          </MainCol>

          <SidebarCol>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp(0.08)}
              style={{ width: "100%" }}
            >
            <SidebarCard>
              {orders.length > 0 && (
                <SidebarBlock>
                  <SidebarTitle>Заказы</SidebarTitle>
                  <NoteList>
                    {orders.map((order) => {
                      const status = getStatus(order.status);
                      return (
                        <NoteItem key={order.id}>
                          <NoteHead>
                            <span className="author">
                              {order.description?.trim() || "Заказ"}
                            </span>
                            <NoteBadge $tone={status.tone}>{status.text}</NoteBadge>
                          </NoteHead>
                          <NoteMeta>{fmtDate(order.createdAt)}</NoteMeta>
                          <NoteText>
                            {fmtMoney(order.budget)} · {fmtAddress(order)}
                          </NoteText>
                        </NoteItem>
                      );
                    })}
                  </NoteList>
                </SidebarBlock>
              )}

              <SidebarBlock>
                <SidebarTitle>Стоимость</SidebarTitle>
                <Timeline>
                  <TimelineItem>
                    <span className="dot" />
                    <div className="content">
                      <span className="date">Минимум</span>
                      <span className="rate">{fmtMoney(row.minPrice)}</span>
                    </div>
                  </TimelineItem>
                  <TimelineItem>
                    <span className="dot" />
                    <div className="content">
                      <span className="date">Максимум</span>
                      <span className="rate">{fmtMoney(row.maxPrice)}</span>
                    </div>
                  </TimelineItem>
                </Timeline>
              </SidebarBlock>

              {row.worker?.user?.phone && (
                <SidebarBlock>
                  <SidebarTitle>Контакты</SidebarTitle>
                  {isAuthed ? (
                    <ContactRow>
                      <Phone size={16} />
                      <div>
                        <div className="label">Телефон</div>
                        <a
                          href={`tel:${formatPhone(row.worker.user.phone)}`}
                          className="phone"
                        >
                          {formatPhone(row.worker.user.phone)}
                        </a>
                      </div>
                    <SmallBtn
                      className="copy-btn"
                      type="button"
                        onClick={() =>
                          copyToClipboard(formatPhone(row.worker!.user!.phone!))
                        }
                      >
                        Копировать
                      </SmallBtn>
                    </ContactRow>
                  ) : (
                    <PhoneGate>
                      <span className="hint">Телефон доступен после входа</span>
                    <ShowPhoneBtn
                      className="show-phone"
                      type="button"
                        onClick={() => {
                          const url = new URL("/login", window.location.origin);
                          url.searchParams.set("redirect", window.location.pathname);
                          window.location.href = url.toString();
                        }}
                      >
                        Показать телефон
                      </ShowPhoneBtn>
                    </PhoneGate>
                  )}
                </SidebarBlock>
              )}

              {(files.length > 0 || demos.length > 0) && (
                <SidebarBlock $last>
                  <SidebarTitle>Файлы</SidebarTitle>
                  <SideFileList>
                    {demos.slice(0, 5).map((fileId) => (
                      <SideFileItem key={fileId}>
                        <span className="icon blue">
                          <ImageIcon size={16} />
                        </span>
                        <span className="info">
                          <span className="name">{fileId}</span>
                          <span className="size">Демо</span>
                        </span>
                      </SideFileItem>
                    ))}
                    {files.slice(0, 5).map((fname) => (
                      <SideFileItem key={fname}>
                        <span className="icon red">
                          <FileText size={16} />
                        </span>
                        <span className="info">
                          <span className="name">{fname}</span>
                          <span className="size">Фото работ</span>
                        </span>
                      </SideFileItem>
                    ))}
                  </SideFileList>
                </SidebarBlock>
              )}
            </SidebarCard>
            </motion.div>
          </SidebarCol>
        </LayoutGrid>

        <MobileActionBar>
          <OutlineBtn
            className="bar-outline"
            type="button"
            onClick={() => onOrder(row.id)}
          >
            Связаться
          </OutlineBtn>
          <PrimaryBtn
            className="bar-primary"
            type="button"
            onClick={() => onOrder(row.id)}
          >
            Заказать
          </PrimaryBtn>
        </MobileActionBar>
      </PageShell>
    </Page>
  );
};

export default WorkerDetailPage;

/* ===== STYLES ===== */
const TOKENS = {
  maxw: "1180px",
  pageBg: "#F4F7FB",
  radiusLg: "12px",
  radiusMd: "10px",
  radiusSm: "8px",
  shadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
  line: "#E5E7EB",
  lineSoft: "#F3F4F6",
  cardBg: "#FFFFFF",
  panelBg: "#F9FAFB",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primarySoftBg: "#EFF6FF",
  primarySoftLine: "#BFDBFE",
  green: "#047857",
  greenBg: "#ECFDF5",
  greenLine: "#A7F3D0",
  red: "#B91C1C",
  redBg: "#FEF2F2",
  redLine: "#FECACA",
};

const Page = styled.div`
  background: ${TOKENS.pageBg};
  min-height: 100vh;
  overflow-x: clip;
`;

const PageShell = styled.div`
  max-width: ${TOKENS.maxw};
  margin: 0 auto;
  padding: 20px 24px 48px;
  padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));

  @media (max-width: 640px) {
    padding: 12px 12px 32px;
    padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  }
`;

const TopNav = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    margin-bottom: 14px;
    gap: 10px;
  }
`;

const TopNavTitle = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${TOKENS.text};
  letter-spacing: -0.01em;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid ${TOKENS.line};
  background: ${TOKENS.cardBg};
  cursor: pointer;
  color: ${TOKENS.textMuted};
  border-radius: ${TOKENS.radiusSm};
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: #d1d5db;
    color: ${TOKENS.text};
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MainCol = styled.div`
  display: grid;
  gap: 20px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 14px;
  }
`;

const SidebarCol = styled.aside`
  min-width: 0;
`;

const Card = styled.section`
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.radiusLg};
  box-shadow: ${TOKENS.shadow};
  overflow: hidden;

  @media (max-width: 640px) {
    border-radius: 10px;
  }
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 20px;
  padding: 24px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 14px;
    padding: 16px;
    text-align: left;
  }
`;

const AvatarSquare = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid ${TOKENS.line};
  background: #f9fafb url("/avatar.png") center/cover no-repeat;

  @media (max-width: 640px) {
    width: 72px;
    height: 72px;
    border-radius: 10px;
  }
`;

const SummaryBody = styled.div`
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: clamp(20px, 4.5vw, 24px);
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${TOKENS.text};
  font-weight: 700;
  word-break: break-word;
`;

const Subtitle = styled.p`
  margin: 0 0 14px;
  font-size: 13px;
  color: ${TOKENS.textMuted};
  font-weight: 500;
  line-height: 1.45;
  word-break: break-word;

  @media (max-width: 640px) {
    margin-bottom: 12px;
    font-size: 12px;
  }
`;

const SummaryMeta = styled.div`
  display: grid;
  gap: 10px;
  max-width: 420px;

  @media (max-width: 640px) {
    max-width: none;
    gap: 8px;
  }
`;

const MetaRow = styled.div`
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  font-size: 14px;

  .label {
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }

  .value {
    color: ${TOKENS.text};
    font-weight: 600;
    min-width: 0;
    word-break: break-word;
  }

  .rating {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 8px;
    font-size: 13px;
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 10px;
    padding: 14px 14px 0;
  }
`;

const CardHeadText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${TOKENS.textMuted};
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${TOKENS.text};
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const CardHeadActions = styled(CardActions)`
  @media (max-width: 640px) {
    display: none;
  }
`;

const OutlineBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: ${TOKENS.radiusSm};
  border: 1px solid ${TOKENS.line};
  background: ${TOKENS.cardBg};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${TOKENS.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  }
`;

const InfoPanel = styled.div`
  margin: 16px 24px 24px;
  padding: 16px;
  background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid ${TOKENS.lineSoft};
  border-radius: ${TOKENS.radiusMd};

  @media (max-width: 640px) {
    margin: 12px 14px 14px;
    padding: 10px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const InfoTile = styled.div<{ $wide?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  min-width: 0;

  ${({ $wide }) =>
    $wide &&
    `
    grid-column: span 2;

    @media (max-width: 900px) {
      grid-column: span 2;
    }

    @media (max-width: 540px) {
      grid-column: span 1;
    }
  `}

  @media (max-width: 640px) {
    padding: 12px;
    gap: 12px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    }
  }
`;

const InfoIcon = styled.span<{
  $tone?: "blue" | "green" | "amber" | "purple" | "red";
}>`
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;

  ${({ $tone }) =>
    $tone === "green"
      ? `background: ${TOKENS.green};`
      : $tone === "amber"
        ? `background: #D97706;`
        : $tone === "purple"
          ? `background: #7C3AED;`
          : $tone === "red"
            ? `background: ${TOKENS.red};`
            : `background: ${TOKENS.primary};`}

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
`;

const InfoBody = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  .label {
    font-size: 12px;
    font-weight: 500;
    color: ${TOKENS.textMuted};
  }

  .value {
    font-size: 15px;
    font-weight: 700;
    color: ${TOKENS.text};
    line-height: 1.35;
    word-break: break-word;
  }

  @media (max-width: 640px) {
    .value {
      font-size: 14px;
    }
  }

  .value.rating {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
  }

  .sep {
    margin: 0 6px;
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }
`;

const GrayPanel = styled.div<{ $plain?: boolean }>`
  margin: 16px 24px 24px;
  padding: ${({ $plain }) => ($plain ? "0" : "20px")};
  background: ${({ $plain }) => ($plain ? "transparent" : TOKENS.panelBg)};
  border: ${({ $plain }) => ($plain ? "none" : `1px solid ${TOKENS.lineSoft}`)};
  border-radius: ${TOKENS.radiusMd};

  @media (max-width: 640px) {
    margin: 12px 14px 14px;
    padding: ${({ $plain }) => ($plain ? "0" : "14px")};
  }
`;

const EmpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 32px;
  padding: 8px 24px 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 4px 14px 14px;
    gap: 14px;
  }
`;

const EmpItem = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
`;

const EmpIconBox = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;
  background: ${TOKENS.primary};
`;

const EmpContent = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  .label {
    font-size: 12px;
    font-weight: 500;
    color: ${TOKENS.textMuted};
  }

  .value {
    font-size: 14px;
    font-weight: 700;
    color: ${TOKENS.text};
    word-break: break-word;
  }
`;

const StatusBadge = styled.span<{ $tone?: "green" | "red" }>`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $tone }) => ($tone === "red" ? TOKENS.red : TOKENS.green)};
  background: ${({ $tone }) => ($tone === "red" ? TOKENS.redBg : TOKENS.greenBg)};
  border: 1px solid ${({ $tone }) => ($tone === "red" ? TOKENS.redLine : TOKENS.greenLine)};
`;

const SidebarCard = styled.div`
  background: ${TOKENS.cardBg};
  border: 1px solid ${TOKENS.line};
  border-radius: ${TOKENS.radiusLg};
  box-shadow: ${TOKENS.shadow};
  overflow: hidden;
`;

const SidebarBlock = styled.div<{ $last?: boolean }>`
  padding: 20px 22px;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${TOKENS.lineSoft}`)};

  @media (max-width: 640px) {
    padding: 16px 14px;
  }
`;

const SidebarTitle = styled.h4`
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 700;
  color: ${TOKENS.text};
`;

const NoteList = styled.div`
  display: grid;
  gap: 16px;
`;

const NoteItem = styled.article`
  display: grid;
  gap: 4px;
`;

const NoteHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  .author {
    font-size: 13px;
    font-weight: 700;
    color: ${TOKENS.text};
    line-height: 1.4;
    min-width: 0;
    flex: 1;
    word-break: break-word;
  }
`;

const NoteBadge = styled.span<{
  $tone?: "blue" | "green" | "amber" | "gray" | "red";
}>`
  flex-shrink: 0;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  color: ${({ $tone }) =>
    $tone === "green"
      ? TOKENS.green
      : $tone === "red"
        ? TOKENS.red
        : $tone === "amber"
          ? "#B45309"
          : $tone === "blue"
            ? TOKENS.primaryDark
            : TOKENS.textMuted};
  background: ${({ $tone }) =>
    $tone === "green"
      ? TOKENS.greenBg
      : $tone === "red"
        ? TOKENS.redBg
        : $tone === "amber"
          ? "#FFFBEB"
          : $tone === "blue"
            ? TOKENS.primarySoftBg
            : "#F3F4F6"};
`;

const NoteMeta = styled.div`
  font-size: 12px;
  color: ${TOKENS.textMuted};
  font-weight: 500;
`;

const NoteText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${TOKENS.textMuted};
  font-weight: 500;
`;

const Timeline = styled.div`
  position: relative;
  display: grid;
  gap: 18px;
  padding-left: 4px;

  &::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: ${TOKENS.line};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 12px;
  align-items: start;

  .dot {
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 2px;
    background: ${TOKENS.primary};
    box-shadow: 0 0 0 3px ${TOKENS.primarySoftBg};
    z-index: 1;
  }

  .content {
    display: grid;
    gap: 2px;
  }

  .date {
    font-size: 12px;
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }

  .rate {
    font-size: 14px;
    color: ${TOKENS.text};
    font-weight: 700;
  }
`;

const SmallBtn = styled.button`
  height: 30px;
  padding: 0 10px;
  border-radius: ${TOKENS.radiusSm};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${TOKENS.line};
  background: #ffffff;
  color: ${TOKENS.text};
  cursor: pointer;

  &:hover {
    border-color: ${TOKENS.primary};
    color: ${TOKENS.primary};
  }
`;

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 12px;
  align-items: start;
  color: ${TOKENS.primary};

  .label {
    font-size: 12px;
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }

  .phone {
    color: ${TOKENS.text};
    font-weight: 700;
    text-decoration: none;
    font-size: 14px;
  }

  .copy-btn {
    grid-column: 1 / -1;
    justify-self: start;
  }
`;

const SideFileList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
`;

const SideFileItem = styled.li`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 12px;
  align-items: center;

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: grid;
    place-items: center;

    &.red {
      background: #fef2f2;
      color: #dc2626;
    }

    &.blue {
      background: ${TOKENS.primarySoftBg};
      color: ${TOKENS.primary};
    }
  }

  .info {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .name {
    font-size: 13px;
    font-weight: 700;
    color: ${TOKENS.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    font-size: 12px;
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }
`;

export const PrimaryBtn = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: ${TOKENS.radiusSm};
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  color: #fff;
  background: ${TOKENS.primary};
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${TOKENS.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const MobileActionBar = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 10px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    padding: 12px 12px calc(12px + env(safe-area-inset-bottom, 0px));
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    border-top: 1px solid ${TOKENS.line};
    box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.08);

    .bar-outline,
    .bar-primary {
      width: 100%;
      height: 46px;
      font-size: 14px;
    }
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

  .thumb {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: ${TOKENS.radiusSm};
    border: 1px solid ${TOKENS.line};
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    .thumb {
      height: 108px;
    }
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
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
  gap: 12px;
  align-items: start;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${TOKENS.primary};
    margin-top: 8px;
    box-shadow: 0 0 0 3px ${TOKENS.primarySoftBg};
  }

  .meta {
    background: ${TOKENS.cardBg};
    border: 1px solid ${TOKENS.line};
    border-radius: ${TOKENS.radiusSm};
    padding: 12px 14px;
  }

  .line1 {
    font-size: 14px;
    color: ${TOKENS.text};
    font-weight: 700;
  }

  .place {
    color: ${TOKENS.textMuted};
    font-weight: 500;
  }

  .desc {
    margin-top: 6px;
    color: ${TOKENS.textMuted};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const Empty = styled.div`
  margin: 24px auto;
  background: ${TOKENS.cardBg};
  border: 1px dashed #cbd5e1;
  border-radius: ${TOKENS.radiusLg};
  padding: 36px 24px;
  text-align: center;
  box-shadow: ${TOKENS.shadow};
  color: ${TOKENS.text};

  h3 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: ${TOKENS.textMuted};
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    height: 44px;
    padding: 0 18px;
    border-radius: ${TOKENS.radiusSm};
    background: linear-gradient(180deg, ${TOKENS.primary} 0%, ${TOKENS.primaryDark} 100%);
    color: #fff;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.22);
  }
`;

const Skeleton = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <div
      style={{
        height: 160,
        background: "linear-gradient(90deg, #fff 25%, #eef2f7 37%, #fff 63%)",
        backgroundSize: "400% 100%",
        border: "1px solid #e2e8f0",
        borderRadius: TOKENS.radiusLg,
        boxShadow: TOKENS.shadow,
        animation: "shimmer 1.4s infinite",
      }}
    />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 16,
      }}
    >
      <div
        style={{
          height: 240,
          background: "linear-gradient(90deg, #fff 25%, #eef2f7 37%, #fff 63%)",
          backgroundSize: "400% 100%",
          border: "1px solid #e2e8f0",
          borderRadius: TOKENS.radiusLg,
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          height: 240,
          background: "linear-gradient(90deg, #fff 25%, #eef2f7 37%, #fff 63%)",
          backgroundSize: "400% 100%",
          border: "1px solid #e2e8f0",
          borderRadius: TOKENS.radiusMd,
          animation: "shimmer 1.4s infinite",
        }}
      />
    </div>
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

const PhoneGate = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  border: 1px dashed #cbd5e1;
  padding: 10px 12px;
  border-radius: ${TOKENS.radiusMd};

  .hint {
    color: ${TOKENS.textMuted};
    font-size: 13px;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    .show-phone {
      width: 100%;
      height: 44px;
    }
  }
`;

const ShowPhoneBtn = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: ${TOKENS.radiusSm};
  font-weight: 700;
  font-size: 13px;
  border: 1px solid ${TOKENS.primarySoftLine};
  background: ${TOKENS.primarySoftBg};
  color: ${TOKENS.primaryDark};
  cursor: pointer;

  &:hover {
    background: #dbeafe;
  }
`;