import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateVacancy,
  useUpdateVacancy,
  useVacancy,
} from "../../shared/modules/vacancy";
import {
  Card,
  CardBody,
  PrimaryBtn,
  GhostBtn,
  Row,
  Field,
  Label,
} from "../profile/pro-profile-section.style";
import { CustomInput } from "../../components/custom-input/CustomInput";

type FormShape = {
  title: string;
  salary: string; // показываем как строку; при сабмите конвертируем в number|null
  description: string;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VacancyEditorPage() {
  const q = useQuery();
  const mode = (q.get("mode") || "create").toLowerCase(); // "create" | "edit"
  const id = q.get("id") || "";
  const nav = useNavigate();

  const {
    data: vac,
    isLoading: loadingVac,
    isError,
    error,
  } = useVacancy(id, mode === "edit" && !!id);
  const { mutate: createVac, isPending: creating } = useCreateVacancy();
  const { mutate: updateVac, isPending: updating } = useUpdateVacancy();

  const { control, handleSubmit, reset, setValue, formState, watch, register } =
    useForm<FormShape>({
      defaultValues: { title: "", salary: "", description: "" },
      mode: "onChange",
    });

  // Гидрация формы в режиме редактирования
  React.useEffect(() => {
    if (mode !== "edit") return;
    if (!vac) return;
    setValue("title", vac.title ?? "", { shouldValidate: true });
    setValue("salary", vac.salary != null ? String(vac.salary) : "", {
      shouldValidate: false,
    });
    setValue("description", vac.description ?? "", { shouldValidate: false });
  }, [mode, vac, setValue]);

  const toNumberOrNull = (s: string): number | null => {
    const trimmed = (s || "").trim();
    if (!trimmed) return null;
    const n = Number(trimmed.replace(/\s+/g, ""));
    return Number.isNaN(n) ? (alert("Неверное значение зарплаты"), null) : n;
  };

  const onSubmit = (v: FormShape) => {
    const dto = {
      title: v.title.trim(),
      salary: toNumberOrNull(v.salary),
      description: v.description.trim(),
    };
    if (dto.salary === null && v.salary.trim() !== "") return; // если была не пустая строка, но парс не удался

    if (mode === "edit") {
      if (!id) {
        alert("ID вакансии не указан");
        return;
      }
      updateVac(
        { id, ...dto },
        {
          onSuccess: () => {
            nav(-1);
          },
          onError: (e: any) =>
            alert(e?.message || "Не удалось сохранить вакансию"),
        }
      );
    } else {
      createVac(dto, {
        onSuccess: (created) => {
          nav(-1);
        },
        onError: (e: any) => alert(e?.message || "Не удалось создать вакансию"),
      });
    }
  };

  const titleText =
    mode === "edit" ? "Редактировать вакансию" : "Создать вакансию";
  const pending = creating || updating;

  if (mode === "edit" && loadingVac)
    return <div style={{ padding: 16 }}>Загрузка…</div>;
  if (mode === "edit" && (isError || (!vac && !loadingVac)))
    return (
      <div style={{ padding: 16, color: "#ef4444" }}>
        {(error as any)?.message || "Вакансия не найдена"}
      </div>
    );

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: "8px 0 16px", fontSize: 24, fontWeight: 800 }}>
        {titleText}
      </h1>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row style={{ gap: 10 }}>
              <Field style={{ flex: 1 }}>
                <CustomInput
                  control={control}
                  name="title"
                  label="Название вакансии"
                  placeholder="Backend dasturchi"
                  required
                  rules={{
                    required: "Укажите название",
                    minLength: { value: 2, message: "Минимум 2 символа" },
                  }}
                />
              </Field>

              <Field style={{ width: 260 }}>
                <CustomInput
                  control={control}
                  name="salary"
                  label="Зарплата (сум)"
                  placeholder="99000000"
                />
              </Field>
            </Row>

            <Field style={{ marginTop: 12 }}>
              <Label>Описание</Label>
              <textarea
                {...register("description")}
                placeholder="Bizaga norm bekendchi kere"
                style={{
                  maxWidth: "1200px",
                  width: "100%",
                  minHeight: 160,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #e7ecf3",
                  outline: "none",
                }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 480) + "px";
                }}
              />
            </Field>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <PrimaryBtn
                type="submit"
                disabled={pending || !formState.isValid}
              >
                {pending
                  ? mode === "edit"
                    ? "Сохраняем…"
                    : "Создаём…"
                  : mode === "edit"
                  ? "Сохранить"
                  : "Создать"}
              </PrimaryBtn>
              <GhostBtn type="button" onClick={() => reset()}>
                Сбросить
              </GhostBtn>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
