import React from "react";
import dayjs from "dayjs";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Card, CardBody } from "../../pro-profile-section.style";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import CustomSelect, {
  SelectOption,
} from "../../../../components/custom-select/CustomSelect";
import { useCreateInvestorProject } from "../../../../shared/modules/useInvestorProjects";
import {
  ProjectCapacity,
  EmploymentType,
  WorkGraph,
} from "../../../../shared/endpoints/investorProjects";
import { useNavigate } from "react-router-dom";
import { useProfessions } from "../../../../shared/modules/useProfessions";

type FormEmployment = {
  profession: string;
  count: number | string;
  startDate: string;
  endDate: string;
  employmentType: EmploymentType;
  workGraph: WorkGraph;
};

type FormShape = {
  capacity: ProjectCapacity;
  partnersText: string; // "Akfa, Eshiklar"
  description: string;
  employment: FormEmployment[];
};

const btn: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  ...btn,
  border: "none",
  background: "#111827",
  color: "#fff",
};

const block: React.CSSProperties = {
  background: "#f3f4f6",
  borderRadius: 14,
  padding: 14,
};

const label: React.CSSProperties = {
  fontSize: 13,
  color: "#64748B",
  fontWeight: 800,
  marginBottom: 6,
};

const dateInputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  height: 44,
  boxSizing: "border-box", // 🔴 КЛЮЧЕВОЕ
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  padding: "0 12px",
  outline: "none",
  background: "#fff",
  fontSize: 14,
};

export default function InvestorCreateProject() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: createProject, isPending } = useCreateInvestorProject();
  const { data: professionCategories, isLoading: professionsLoading } =
    useProfessions();

  const isMobile = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 720;
  }, []);

  const PROFESSION_OPTS: SelectOption[] = React.useMemo(() => {
    if (!professionCategories) return [];

    return professionCategories.flatMap((cat) =>
      (cat.professions || []).map((p) => ({
        value: p.nameRu, // 👈 отправляем ИМЯ
        label: p.nameRu, // или nameUz по i18n
      }))
    );
  }, [professionCategories]);

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<FormShape>({
      defaultValues: {
        capacity: "SMALL",
        partnersText: "Akfa",
        description: "",
        employment: [
          {
            profession: "",
            count: 1,
            startDate: dayjs().format("YYYY-MM-DD"),
            endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
            employmentType: "EMPLOYEE",
            workGraph: "FULLTIME",
          },
        ],
      },
      mode: "onChange",
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employment",
  });

  const CAPACITY_OPTS: SelectOption[] = [
    { value: "SMALL", label: t("investor.projects.capacitySmall") },
    { value: "MIDDLE", label: t("investor.projects.capacityMiddle") },
    { value: "LARGE", label: t("investor.projects.capacityLarge") },
  ];

  const EMPLOYMENT_TYPE_OPTS: SelectOption[] = [
    { value: "EMPLOYEE", label: t("investor.projects.empTypeEmployee") },
    { value: "FREELANCE", label: t("investor.projects.empTypeFreelance") },
    { value: "CONTRACT", label: t("investor.projects.empTypeContract") },
  ];

  const WORK_GRAPH_OPTS: SelectOption[] = [
    { value: "FULLTIME", label: t("investor.projects.graphFull") },
    { value: "PARTTIME", label: t("investor.projects.graphPart") },
    { value: "FLEX", label: t("investor.projects.graphFlex") },
  ];

  const onSubmit = (data: FormShape) => {
    const partners = (data.partnersText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const employment = (data.employment || []).map((e) => ({
      profession: (e.profession || "").trim(),
      count: Math.max(1, Number(e.count || 0)),
      startDate: e.startDate,
      endDate: e.endDate,
      employmentType: e.employmentType,
      workGraph: e.workGraph,
    }));

    type CreateInvestorProjectDto = {
      capacity: ProjectCapacity;
      partners: string[];
      description: string;
      employment: Array<{
        profession: string;
        count: number;
        startDate: string; // YYYY-MM-DD
        endDate: string; // YYYY-MM-DD
        employmentType: EmploymentType;
        workGraph: WorkGraph;
      }>;
    };

    const payload: CreateInvestorProjectDto = {
      capacity: data.capacity,
      partners,
      description: (data.description || "").trim(),
      employment,
    };

    createProject(payload, {
      onSuccess: () => {
        // очистим только описание, а партнёров/форму оставим
        navigate("/app/profile");
        setValue("description", "", { shouldValidate: true });
      },
      onError: (e: any) =>
        alert(e?.message || t("investor.projects.createFailed")),
    });
  };

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
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                {t("investor.projects.createTitle")}
              </h2>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                {t("investor.projects.createSubtitle")}
              </div>
            </div>

            <button
              style={primaryBtn}
              onClick={handleSubmit(onSubmit)}
              disabled={!formState.isValid || isPending}
              title={t("common.save")}
            >
              {isPending ? t("common.saving") : t("common.save")}
            </button>
          </div>

          {/* Base info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={block}>
              <div style={label}>{t("investor.projects.capacity")}</div>
              <Controller
                control={control}
                name="capacity"
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomSelect
                    id="capacity"
                    options={CAPACITY_OPTS}
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                    placeholder={t("placeholders2.select")}
                    menuMaxHeight={260}
                  />
                )}
              />
            </div>

            <div style={block}>
              <div style={label}>{t("investor.projects.partners")}</div>
              <CustomInput
                control={control}
                name="partnersText"
                placeholder={t("investor.projects.partnersPh")}
                rules={{}}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                {t("investor.projects.partnersHint")}
              </div>
            </div>

            <div style={{ ...block, gridColumn: isMobile ? "auto" : "1 / -1" }}>
              <div style={label}>{t("investor.projects.description")}</div>
              <CustomInput
                control={control}
                name="description"
                placeholder={t("investor.projects.descriptionPh")}
                required
                rules={{
                  required: t("validation.required"),
                  minLength: { value: 5, message: "Минимум 5 символов" },
                }}
              />
            </div>
          </div>

          <div style={{ height: 14 }} />

          {/* Employment list */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
              {t("investor.projects.employmentTitle")}
            </div>

            <button
              style={btn}
              type="button"
              onClick={() =>
                append({
                  profession: "",
                  count: 1,
                  startDate: dayjs().format("YYYY-MM-DD"),
                  endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
                  employmentType: "EMPLOYEE",
                  workGraph: "FULLTIME",
                })
              }
            >
              {t("investor.projects.addEmployment")}
            </button>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ display: "grid", gap: 12 }}>
            {fields.map((f, idx) => (
              <div key={f.id} style={block}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontWeight: 900, color: "#0f172a" }}>
                    {t("investor.projects.position")} #{idx + 1}
                  </div>

                  {fields.length > 1 ? (
                    <button
                      style={btn}
                      type="button"
                      onClick={() => remove(idx)}
                    >
                      {t("investor.projects.removeEmployment")}
                    </button>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div style={label}>{t("investor.projects.profession")}</div>

                    <Controller
                      control={control}
                      name={`employment.${idx}.profession`}
                      rules={{ required: t("validation.required") }}
                      render={({ field }) => (
                        <CustomSelect
                          id={`profession_${idx}`}
                          options={PROFESSION_OPTS}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          placeholder={
                            professionsLoading
                              ? t("loading")
                              : t("investor.projects.professionPh")
                          }
                          menuMaxHeight={300}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <div style={label}>{t("investor.projects.count")}</div>
                    <CustomInput
                      control={control}
                      name={`employment.${idx}.count` as const}
                      placeholder="1"
                      required
                      rules={{ required: t("validation.required") }}
                    />
                  </div>

                  <div>
                    <div style={label}>
                      {t("investor.projects.employmentType")}
                    </div>
                    <Controller
                      control={control}
                      name={`employment.${idx}.employmentType` as const}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomSelect
                          id={`employmentType_${idx}`}
                          options={EMPLOYMENT_TYPE_OPTS}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          placeholder={t("placeholders2.select")}
                          menuMaxHeight={240}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <div style={label}>{t("investor.projects.workGraph")}</div>
                    <Controller
                      control={control}
                      name={`employment.${idx}.workGraph` as const}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomSelect
                          id={`workGraph_${idx}`}
                          options={WORK_GRAPH_OPTS}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          placeholder={t("placeholders2.select")}
                          menuMaxHeight={240}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <div style={label}>{t("investor.projects.startDate")}</div>

                    <div style={{ overflow: "hidden" }}>
                      <Controller
                        control={control}
                        name={`employment.${idx}.startDate` as const}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <input
                            type="date"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            style={dateInputStyle}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={label}>{t("investor.projects.endDate")}</div>

                    <div style={{ overflow: "hidden" }}>
                      <Controller
                        control={control}
                        name={`employment.${idx}.endDate` as const}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <input
                            type="date"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            style={dateInputStyle}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
