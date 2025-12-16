import React from "react";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Card, CardBody } from "../../pro-profile-section.style";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import CustomSelect, { SelectOption } from "../../../../components/custom-select/CustomSelect";
import {
  useInvestorVacancies,
  useCreateInvestorVacancy,
  useUpdateInvestorVacancy,
} from "../../../../shared/modules/useInvestorVacancies";

type FormShape = {
  title: string;
  salary: string;
  description: string;
  active: "true" | "false";
};

/* ========================= helpers ========================= */
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);

    const onChange = () => setMatches(mq.matches);
    onChange();

    // Safari old support
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, [query]);

  return matches;
}

/* ========================= styles ========================= */

const pageWrap: React.CSSProperties = {
  gridColumn: "1 / -1",
  marginTop: 15,
};

const topHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const titleBox: React.CSSProperties = {
  display: "grid",
  gap: 6,
  minWidth: 220,
};

const h2: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  margin: 0,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const sub: React.CSSProperties = {
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.35,
};

const btnBase: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 40,
  transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  border: "none",
  background: "#111827",
  color: "#fff",
};

const btnGhost: React.CSSProperties = {
  ...btnBase,
  background: "#fff",
};

const gridWrap = (isMobile: boolean): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
  gap: 12,
});

const vacancyCard: React.CSSProperties = {
  borderRadius: 16,
  padding: 14,
  border: "1px solid #eaeef5",
  background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

const vacancyTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
};

const vacancyTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 950,
  color: "#0f172a",
  letterSpacing: "-0.01em",
  lineHeight: 1.2,
};

const metaRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: 6,
};

const salaryText: React.CSSProperties = {
  fontWeight: 900,
  color: "#111827",
};

const dateText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
};

const badgeRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 10,
};

const badge = (active: boolean): React.CSSProperties => ({
  padding: "5px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  background: active ? "#dcfce7" : "#f1f5f9",
  color: active ? "#166534" : "#334155",
  border: "1px solid " + (active ? "#bbf7d0" : "#e2e8f0"),
});

const desc: React.CSSProperties = {
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.4,
  marginTop: 10,
  display: "-webkit-box",
  WebkitLineClamp: 4 as any,
  WebkitBoxOrient: "vertical" as any,
  overflow: "hidden",
};

const salaryTextStyle: React.CSSProperties = {
  fontWeight: 900,
  color: "#111827",
};

const dateTextStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
};


const emptyBox: React.CSSProperties = {
  borderRadius: 16,
  padding: 14,
  border: "1px dashed #e2e8f0",
  background: "#f8fafc",
  color: "#64748b",
};

const errorBox: React.CSSProperties = {
  color: "#b91c1c",
  background: "#fee2e2",
  borderRadius: 16,
  padding: 12,
  border: "1px solid #fecaca",
};

const modalBackdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  zIndex: 999,
};

const modalCard = (_isMobile: boolean): React.CSSProperties => ({
  width: "min(760px, 100%)",
  borderRadius: 18,
  background: "#fff",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
  maxHeight: "90dvh",
  display: "flex",
  flexDirection: "column",

  // ✅ центрирование
  alignSelf: "center",
  margin: "auto",
});

const modalHeader: React.CSSProperties = {
  padding: 14,
  borderBottom: "1px solid #eef2f7",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
};

const modalTitle: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 16,
  color: "#0f172a",
};

const modalBody = (isMobile: boolean): React.CSSProperties => ({
  padding: 14,
  display: "grid",
  gap: 12,
  overflow: "auto",
  // чуть больше воздуха на мобиле
  paddingBottom: isMobile ? 18 : 14,
});

const modalActions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  paddingTop: 6,
};

/* ========================= component ========================= */

export default function InvestorVacanciesPage() {
  const { t } = useTranslation();

  const isMobile = useMediaQuery("(max-width: 719px)");
  const isNarrow = useMediaQuery("(max-width: 420px)");

  const { data: list = [], isLoading, error } = useInvestorVacancies(true);
  const { mutate: createVacancy, isPending: creating } = useCreateInvestorVacancy();
  const { mutate: updateVacancy, isPending: updating } = useUpdateInvestorVacancy();

  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  const { control, handleSubmit, reset, formState } = useForm<FormShape>({
    defaultValues: { title: "", salary: "", description: "", active: "true" },
    mode: "onChange",
  });

  const ACTIVE_OPTIONS: SelectOption[] = [
    { value: "true", label: t("investor.vacancies.active") },
    { value: "false", label: t("investor.vacancies.inactive") },
  ];

  const openCreate = () => {
    setEditId(null);
    reset({ title: "", salary: "", description: "", active: "true" });
    setOpen(true);
  };

  const openEdit = (v: any) => {
    setEditId(v.id);
    reset({
      title: v.title ?? "",
      salary: typeof v.salary === "number" ? String(v.salary) : "",
      description: v.description ?? "",
      active: v.active ? "true" : "false",
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const onSubmit = (data: FormShape) => {
    const salaryNum =
      data.salary?.trim() === "" ? null : Number(String(data.salary).replace(/\s/g, ""));

    const payloadBase = {
      title: data.title.trim(),
      salary: Number.isFinite(salaryNum as any) ? salaryNum : null,
      description: data.description?.trim() || null,
      active: data.active === "true",
    };

    if (!payloadBase.title) return;

    if (editId) {
      updateVacancy(
        { id: editId, ...payloadBase },
        {
          onSuccess: () => close(),
          onError: (e: any) => alert(e?.message || t("common.saveFailed")),
        }
      );
    } else {
      createVacancy(
        {
          title: payloadBase.title,
          salary: payloadBase.salary,
          description: payloadBase.description,
        },
        {
          onSuccess: () => close(),
          onError: (e: any) => alert(e?.message || t("common.saveFailed")),
        }
      );
    }
  };

  const ctaStyle = React.useMemo(() => {
    // на очень узких — делаем кнопку full width
    if (isNarrow) return { ...btnPrimary, width: "100%" };
    return btnPrimary;
  }, [isNarrow]);

  return (
    <div style={pageWrap}>
      <Card style={{ borderRadius: 18, border: "none", background: "#fff", boxShadow: "none" }}>
        <CardBody>
          <div style={topHeader}>
            <div style={titleBox}>
              <h2 style={h2}>{t("investor.vacancies.title")}</h2>
              <div style={sub}>{t("investor.vacancies.subtitle")}</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: isNarrow ? "100%" : "auto" }}>
              <button style={ctaStyle} onClick={openCreate}>
                {t("investor.vacancies.create")}
              </button>
            </div>
          </div>

          <div style={{ height: 14 }} />

          {isLoading ? (
            <div style={{ color: "#64748b" }}>{t("loading")}</div>
          ) : error ? (
            <div style={errorBox}>{(error as any)?.message || t("profile.loadFailed")}</div>
          ) : !list.length ? (
            <div style={emptyBox}>{t("investor.vacancies.empty")}</div>
          ) : (
            <div style={gridWrap(isMobile)}>
              {list.map((v: any) => {
const salaryLabel =
typeof v.salary === "number"
  ? `${v.salary.toLocaleString("ru-RU")} сум`
  : t("investor.vacancies.salaryNA");

const dateLabel = v.updatedAt
? dayjs(v.updatedAt).format("DD.MM.YYYY")
: v.createdAt
  ? dayjs(v.createdAt).format("DD.MM.YYYY")
  : "";
                return (
                  <div key={v.id} style={vacancyCard}>
                    <div style={vacancyTop}>
                      <div style={{ minWidth: 0 }}>
                        <div style={vacancyTitle}>{v.title}</div>

                        <div style={metaRow}>
                        <span style={salaryTextStyle}>{salaryLabel}</span>
                        {dateLabel ? <span style={dateTextStyle}>{dateLabel}</span> : null}
                        </div>

                        <div style={badgeRow}>
                          <span
                            style={badge(!!v.active)}
                            title={
                              v.active ? t("investor.vacancies.active") : t("investor.vacancies.inactive")
                            }
                          >
                            {v.active ? t("investor.vacancies.active") : t("investor.vacancies.inactive")}
                          </span>
                        </div>

                        {v.description ? (
                          <div style={desc}>{String(v.description)}</div>
                        ) : null}
                      </div>

                      <button style={btnGhost} onClick={() => openEdit(v)}>
                        {t("common.change")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal create/edit */}
      {open ? (
        <div style={modalBackdrop} onMouseDown={close}>
          <div style={modalCard(isMobile)} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={modalTitle}>
                {editId ? t("investor.vacancies.editTitle") : t("investor.vacancies.createTitle")}
              </div>
              <button style={btnGhost} onClick={close}>
                {t("common.cancel")}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={modalBody(isMobile)}>
              <CustomInput
                control={control}
                name="title"
                placeholder={t("investor.vacancies.fields.titlePh")}
                required
                rules={{
                  required: t("validation.required"),
                  minLength: { value: 2, message: "Минимум 2 символа" },
                }}
              />

              <CustomInput
                control={control}
                name="salary"
                placeholder={t("investor.vacancies.fields.salaryPh")}
              />

              <CustomInput
                control={control}
                name="description"
                placeholder={t("investor.vacancies.fields.descPh")}
              />

              {editId ? (
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <CustomSelect
                      id="active"
                      options={ACTIVE_OPTIONS}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      placeholder={t("placeholders2.select")}
                      menuMaxHeight={240}
                    />
                  )}
                />
              ) : null}

              <div style={modalActions}>
                {/* <button type="button" style={btnGhost} onClick={close}>
                  {t("common.cancel")}
                </button> */}

                <button
                  type="submit"
                  style={{
                    ...btnPrimary,
                    width: isNarrow ? "100%" : "auto",
                    opacity: !formState.isValid || creating || updating ? 0.7 : 1,
                    cursor: !formState.isValid || creating || updating ? "not-allowed" : "pointer",
                  }}
                  disabled={!formState.isValid || creating || updating}
                >
                  {creating || updating ? t("common.saving") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
