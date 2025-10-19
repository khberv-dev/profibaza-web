// src/features/profile/components/LegalProfile.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Row,
  Field,
  Label,
  PrimaryBtn,
  GhostBtn,
  EditBtn,
} from "../../pro-profile-section.style";
import CustomSelect, {
  SelectOption,
} from "../../../../components/custom-select/CustomSelect";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import {
  useLegalMe,
  useUpdateLegalProfile,
  LEGAL_ME_QK as LEGAL_ME_QUERY_KEY,
} from "../../../../shared/modules/legal";
import { useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "../../../../shared/modules/user";
import dayjs from "dayjs";
import { useMyVacancies } from "../../../../shared/modules/vacancy";
import { NavLink, useNavigate } from "react-router-dom";

type FormShape = {
  companyName: string;
  companyType: string | number | null;
};

const COMPANY_TYPE_VALUES = [
  "MCHJ",
  "IP",
  "XK",
  "AJ",
  "FERX",
  "OTHER",
] as const;

export const LegalProfile: React.FC = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { mutate: updateProfile, isPending } = useUpdateLegalProfile();

  const navigate = useNavigate();
  const { data: vacancies = [], isLoading: vacLoading } = useMyVacancies();
  const { data: legalMe } = useLegalMe(true);

  const { control, handleSubmit, watch, formState, setValue } =
    useForm<FormShape>({
      defaultValues: { companyName: "", companyType: "MCHJ" },
      mode: "onChange",
    });

  const [isEditingCompany, setIsEditingCompany] = React.useState(false);

  const COMPANY_TYPES: SelectOption[] = COMPANY_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`companyTypes.${v}`),
  }));

  const KNOWN_TYPES = new Set(COMPANY_TYPE_VALUES.map(String)); // {"MCHJ","IP","XK","AJ","FERX","OTHER"}

  function splitNameAndType(full?: string | null): {
    base: string;
    type: FormShape["companyType"];
  } {
    const raw = (full || "").trim();
    if (!raw) return { base: "", type: "MCHJ" };
    const parts = raw.split(/\s+/);
    const last = parts[parts.length - 1]?.toUpperCase();
    if (last && KNOWN_TYPES.has(last)) {
      const base = parts.slice(0, -1).join(" ").trim();
      return { base, type: last as FormShape["companyType"] };
    }
    return { base: raw, type: "OTHER" };
  }

  React.useEffect(() => {
    if (!legalMe?.name) return;
    const { base, type } = splitNameAndType(legalMe.name);
    setValue("companyName", base, { shouldValidate: true, shouldDirty: false });
    setValue("companyType", type, { shouldValidate: true, shouldDirty: false });
  }, [legalMe?.name, setValue]);

  const composeName = (name: string, type: string | number | null) => {
    const base = (name || "").trim();
    const suffix = String(type || "").toUpperCase();
    if (!base) return "";
    if (!suffix || suffix === "OTHER") return base;
    return `${base} ${suffix}`.trim(); // "Korzinka MCHJ"
  };

  const onSubmit = (data: FormShape) => {
    const name = composeName(data.companyName, data.companyType);
    if (!name) return;
    updateProfile(
      { name },
      {
        onSuccess: async () => {
          await Promise.allSettled([
            qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
            qc.invalidateQueries({ queryKey: LEGAL_ME_QUERY_KEY }),
          ]);
          setIsEditingCompany(false); // выйти из режима редактирования
        },
        onError: (e: any) => {
          alert(
            e?.message || t("profile.loadFailed") || "Не удалось сохранить"
          );
        },
      }
    );
  };

  // просто чтобы не ругался линтер (использование watch, если нужно)
  const nameVal = watch("companyName");
  const typeVal = watch("companyType");

  return (
    <div style={{ gridColumn: "1 / -1", marginTop: 15 }}>
      {/* ===== Карточка профиля компании (hh-стиль) ===== */}
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 6px 20px rgba(2,6,23,0.03)",
          marginTop: 8,
        }}
      >
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* заголовок */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: 0,
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                }}
              >
                Профиль компании
              </h2>
              <span
                style={{
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                {legalMe?.updatedAt
                  ? `Обновлено ${dayjs(legalMe.updatedAt).format("DD.MM.YYYY")}`
                  : ""}
              </span>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                {!isEditingCompany ? (
                  // режим ПРОСМОТР
                  <EditBtn
                    type="button"
                    onClick={() => setIsEditingCompany(true)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 10,
                      width: 180,
                    }}
                  >
                    Редактировать
                  </EditBtn>
                ) : (
                  // режим РЕДАКТИРОВАНИЕ
                  <>
                    <EditBtn
                      type="button"
                      onClick={() => {
                        const { base, type } = splitNameAndType(legalMe?.name);
                        setValue("companyName", base ?? "", {
                          shouldValidate: true,
                          shouldDirty: false,
                        });
                        setValue("companyType", type ?? "MCHJ", {
                          shouldValidate: true,
                          shouldDirty: false,
                        });
                        setIsEditingCompany(false);
                      }}
                      style={{ padding: "10px 20px", borderRadius: 10 }}
                    >
                      Отмена
                    </EditBtn>
                    <PrimaryBtn
                      type="submit"
                      disabled={isPending || !formState.isValid}
                      style={{ padding: "10px 20px", borderRadius: 10 }}
                    >
                      {isPending ? "Сохраняем…" : "Сохранить"}
                    </PrimaryBtn>
                  </>
                )}
              </div>
            </div>

            {/* поля */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                alignItems: "end",
              }}
            >
              <Field style={{ width: "100%" }}>
                <Label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  Тип организации
                </Label>

                <div
                  style={
                    !isEditingCompany
                      ? { background: "#f8fafc", borderRadius: 12, padding: 0 }
                      : undefined
                  }
                >
                  <Controller
                    control={control}
                    name="companyType"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomSelect
                        id="companyType"
                        options={COMPANY_TYPES}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        placeholder={t("placeholders2.select")}
                        menuMaxHeight={300}
                        disabled={!isEditingCompany}
                        // визуал readonly
                      />
                    )}
                  />
                </div>
              </Field>

              <Field style={{ width: "100%" }}>
                <Label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  Название организации
                </Label>

                <div
                  style={
                    !isEditingCompany
                      ? { background: "#f8fafc", borderRadius: 12, padding: 0 }
                      : undefined
                  }
                >
                  <CustomInput
                    control={control}
                    name="companyName"
                    placeholder="Например: Korzinka"
                    required
                    rules={{
                      required: "Введите название",
                      minLength: { value: 2, message: "Минимум 2 символа" },
                    }}
                    disabled={!isEditingCompany}
                  />
                </div>
              </Field>
            </div>

            {/* кнопки */}
          </form>
        </CardBody>
      </Card>

      {/* ===== Вакансии (hh-стиль) ===== */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: "24px 0 12px",
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            Вакансии
          </h3>

          <PrimaryBtn
            type="button"
            onClick={() => navigate("/app/legal/vacancy?mode=create")}
            title="Создать вакансию"
            style={{ borderRadius: 10, padding: "10px 14px" }}
          >
            Создать вакансию
          </PrimaryBtn>
        </div>

        {vacLoading ? (
          <div style={{ color: "#64748b" }}>Загрузка…</div>
        ) : !vacancies.length ? (
          <div
            style={{
              color: "#64748b",
              border: "1px dashed #e7ecf3",
              borderRadius: 12,
              padding: 16,
              background: "#fafafa",
            }}
          >
            Пока нет опубликованных вакансий.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {vacancies.map((v) => {
              const salaryText = v.salary
                ? `${Number(v.salary).toLocaleString("ru-RU")} сум`
                : "З/п не указана";
              const dateText = v.updatedAt
                ? dayjs(v.updatedAt).format("DD.MM.YYYY HH:mm")
                : v.createdAt
                ? dayjs(v.createdAt).format("DD.MM.YYYY HH:mm")
                : "";

              return (
                <div
                  key={v.id}
                  style={{
                    border: "1px solid #e7ecf3",
                    borderRadius: 14,
                    padding: 14,
                    background: "#fff",
                    display: "grid",
                    gridTemplateColumns: "1fr max-content",
                    gap: 12,
                    alignItems: "center",
                    transition: "box-shadow .15s ease, transform .06s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 18px rgba(2,6,23,0.06)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {/* Левая колонка */}
                  <div style={{ display: "grid", gap: 6 }}>
                    {/* Заголовок + чипы */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <NavLink
                        to={`/app/legal/vacancy?mode=edit&id=${v.id}`}
                        style={{
                          fontWeight: 700,
                          fontSize: 18,
                          lineHeight: 1.2,
                          color: "#0F172A",
                          textDecoration: "none",
                        }}
                      >
                        {v.title}
                      </NavLink>

                      {/* Чип активности */}
                      <span
                        title={v.active ? "Опубликована" : "Черновик"}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          border: `1px solid ${
                            v.active ? "#DCFCE7" : "#E5E7EB"
                          }`,
                          background: v.active ? "#F0FDF4" : "#F9FAFB",
                          color: v.active ? "#166534" : "#374151",
                        }}
                      >
                        {v.active ? "Активна" : "Черновик"}
                      </span>
                    </div>

                    {/* Мета-строка: зарплата • дата */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        alignItems: "baseline",
                        color: "#111827",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {salaryText}
                      </span>
                      <span style={{ color: "#D1D5DB" }}>•</span>
                      <span style={{ color: "#6B7280", fontSize: 13 }}>
                        {dateText}
                      </span>
                    </div>

                    {/* Короткий превью описания */}
                    {v.description ? (
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {v.description}
                      </div>
                    ) : null}
                  </div>

                  {/* Правая колонка — действия */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <NavLink
                      to={`/app/legal/vacancy?mode=edit&id=${v.id}`}
                      style={{ textDecoration: "none" }}
                      title="Редактировать вакансию"
                    >
                      <EditBtn type="button">Редактировать</EditBtn>
                    </NavLink>
                    {/* при необходимости: кнопка публикации/снятия */}
                    {/* <GhostBtn type="button">Снять с публикации</GhostBtn> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalProfile;
