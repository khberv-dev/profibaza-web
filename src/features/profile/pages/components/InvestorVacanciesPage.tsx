import React from "react";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Card, CardBody } from "../../pro-profile-section.style";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import CustomSelect, {
  SelectOption,
} from "../../../../components/custom-select/CustomSelect";
import {
  useInvestorVacancies,
  useCreateInvestorVacancy,
  useUpdateInvestorVacancy,
} from "../../../../shared/modules/useInvestorVacancies";

type FormShape = {
  title: string;
  salary: string; // вводим строкой, потом парсим
  description: string;
  active: "true" | "false";
};

const modalBackdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 14,
  zIndex: 999,
};

const modalCard: React.CSSProperties = {
  width: "min(720px, 100%)",
  borderRadius: 16,
  background: "#fff",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const btn: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  ...btn,
  border: "none",
  background: "#111827",
  color: "#fff",
};

const grayCard: React.CSSProperties = {
  background: "#f3f4f6",
  borderRadius: 14,
  padding: 14,
};

export default function InvestorVacanciesPage() {
  const { t } = useTranslation();

  const isMobile = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 720;
  }, []);

  const { data: list = [], isLoading, error } = useInvestorVacancies(true);
  const { mutate: createVacancy, isPending: creating } =
    useCreateInvestorVacancy();
  const { mutate: updateVacancy, isPending: updating } =
    useUpdateInvestorVacancy();

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
      data.salary?.trim() === ""
        ? null
        : Number(String(data.salary).replace(/\s/g, ""));

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

  const cols = isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))";

  return (
    <div style={{ gridColumn: "1 / -1", marginTop: 15 }}>
      <Card
        style={{
          borderRadius: 18,
          border: "none",
          background: "#fff",
          boxShadow: "none",
        }}
      >
        <CardBody>
          <div style={headerRow}>
            <div style={{ display: "grid", gap: 6 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                {t("investor.vacancies.title")}
              </h2>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                {t("investor.vacancies.subtitle")}
              </div>
            </div>

            <button style={primaryBtn} onClick={openCreate}>
              {t("investor.vacancies.create")}
            </button>
          </div>

          <div style={{ height: 14 }} />

          {isLoading ? (
            <div style={{ color: "#64748b" }}>{t("loading")}</div>
          ) : error ? (
            <div
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                borderRadius: 14,
                padding: 12,
              }}
            >
              {(error as any)?.message || t("profile.loadFailed")}
            </div>
          ) : !list.length ? (
            <div style={{ ...grayCard, color: "#64748b" }}>
              {t("investor.vacancies.empty")}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 12,
              }}
            >
              {list.map((v: any) => {
                const salaryText =
                  typeof v.salary === "number"
                    ? `${v.salary.toLocaleString("ru-RU")} сум`
                    : t("investor.vacancies.salaryNA");

                const dateText = v.updatedAt
                  ? dayjs(v.updatedAt).format("DD.MM.YYYY")
                  : v.createdAt
                  ? dayjs(v.createdAt).format("DD.MM.YYYY")
                  : "";

                return (
                  <div key={v.id} style={grayCard}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "grid", gap: 6 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 900,
                            color: "#0f172a",
                          }}
                        >
                          {v.title}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 800, color: "#111827" }}>
                            {salaryText}
                          </span>
                          {dateText ? (
                            <span style={{ color: "#6b7280", fontSize: 13 }}>
                              {dateText}
                            </span>
                          ) : null}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 2,
                          }}
                        >
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 900,
                              background: v.active ? "#dcfce7" : "#e5e7eb",
                              color: v.active ? "#166534" : "#374151",
                            }}
                            title={
                              v.active
                                ? t("investor.vacancies.active")
                                : t("investor.vacancies.inactive")
                            }
                          >
                            {v.active
                              ? t("investor.vacancies.active")
                              : t("investor.vacancies.inactive")}
                          </span>
                        </div>

                        {v.description ? (
                          <div
                            style={{
                              color: "#475569",
                              fontSize: 14,
                              lineHeight: 1.35,
                              marginTop: 6,
                            }}
                          >
                            {String(v.description).slice(0, 180)}
                            {String(v.description).length > 180 ? "…" : ""}
                          </div>
                        ) : null}
                      </div>

                      <button style={btn} onClick={() => openEdit(v)}>
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
          <div style={modalCard} onMouseDown={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: 14,
                borderBottom: "1px solid #eef2f7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>
                {editId
                  ? t("investor.vacancies.editTitle")
                  : t("investor.vacancies.createTitle")}
              </div>
              <button style={btn} onClick={close}>
                {t("common.cancel")}
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ padding: 14, display: "grid", gap: 12 }}
            >
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button type="button" style={btn} onClick={close}>
                  {t("common.cancel")}
                </button>

                <button
                  type="submit"
                  style={primaryBtn}
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
