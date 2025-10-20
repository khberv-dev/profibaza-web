// pages/profile/experience/ExperienceFormPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  PrimaryBtn,
  GhostBtn,
  Page,
  Header,
  Title,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Field,
  Label,
  Input,
  Help,
  Notice,
  Actions,
} from "../worker-profile.style";

import { useEffect } from "react";
import {
  getWorkerProfessions,
  WorkerProfessionRow,
} from "../../../../../../shared/modules/worker";
import {
  postWorkerExperience,
  putWorkerExperience,
} from "../../../../../../shared/modules/experience";

type Mode = "create" | "edit";
type Props = { mode: Mode };

export default function ExperienceFormPage({ mode }: Props) {
  const { rowId } = useParams(); // id workerProfession для edit; для create можно передать через query ?pid=
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const pidFromQuery = sp.get("pid") || ""; // когда открываем “добавить опыт” из списка анкеты

  const [profRows, setProfRows] = useState<WorkerProfessionRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // поля формы
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState(""); // не уходит на бэк, но полезно юзеру
  const [startedYear, setStartedYear] = useState<number | "">("");
  const [endedYear, setEndedYear] = useState<number | "">("");
  const [now, setNow] = useState(true);
  const [desc, setDesc] = useState("");

  const targetProfessionId = (mode === "edit" ? rowId : pidFromQuery) || "";

  useEffect(() => {
    const ac = new AbortController();
    getWorkerProfessions(ac.signal)
      .then(setProfRows)
      .catch(() => setProfRows([]));
    return () => ac.abort();
  }, []);

  const canSave =
    !!targetProfessionId &&
    company.trim().length >= 2 &&
    typeof startedYear === "number" &&
    startedYear >= 1950 &&
    (now || (typeof endedYear === "number" && endedYear >= startedYear)) &&
    !saving;

  const onSave = async () => {
    try {
      setSaving(true);
      setErr(null);
      setOk(false);

      if (!canSave) throw new Error("Проверьте поля формы");

      const payload = {
        jobPlace: company.trim(),
        jobDescription: [position, desc].filter(Boolean).join(" — ").trim(),
        startedAt: Number(startedYear),
        endedAt: now ? undefined : endedYear ? Number(endedYear) : undefined,
      };

      if (mode === "edit") {
        if (!rowId) throw new Error("Не найден ID записи опыта");
        await putWorkerExperience(rowId, payload); // ← PUT
      } else {
        if (!targetProfessionId) throw new Error("Не найден ID профессии");
        await postWorkerExperience(targetProfessionId, payload); // ← POST
      }

      setOk(true);
      setTimeout(() => navigate("/app/profile"), 400);
    } catch (e: any) {
      setErr(e?.message || "Не удалось сохранить опыт");
    } finally {
      setSaving(false);
    }
  };

  const profName = useMemo(() => {
    const row = profRows.find((r) => r.id === targetProfessionId);
    // показываем название профессии в заголовке
    return (
      (row as any)?.profession?.nameRu || (row as any)?.profession?.nameUz || ""
    );
  }, [profRows, targetProfessionId]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!rowId || !pidFromQuery) return; // нужен и expId, и professionId
    if (!profRows.length) return;

    // находим профессию
    const prof = profRows.find((r) => r.id === pidFromQuery);
    // находим запись опыта по её id из params
    const exp = prof?.experience?.find?.(
      (x: any) => String(x.id) === String(rowId)
    );
    if (!exp) return;

    // распарсим поля (на бэке startedAt/endedAt у тебя как числа/годы)
    setCompany(exp.jobPlace ?? "");
    // ты в onSave склеиваешь position + desc в jobDescription — попробуем мягко разложить
    // шаблон: "позиция — остальное". Если нет "—", целиком кидаем в desc
    if (
      typeof exp.jobDescription === "string" &&
      exp.jobDescription.includes(" — ")
    ) {
      const [pos, ...rest] = exp.jobDescription.split(" — ");
      setPosition(pos ?? "");
      setDesc(rest.join(" — ") ?? "");
    } else {
      setPosition("");
      setDesc(exp.jobDescription ?? "");
    }

    const started = Number(exp.startedAt);
    const ended = exp.endedAt != null ? Number(exp.endedAt) : undefined;

    setStartedYear(Number.isFinite(started) ? started : "");
    if (ended != null && Number.isFinite(ended)) {
      setEndedYear(ended);
      setNow(false);
    } else {
      setEndedYear("");
      setNow(true); // «н.в.»
    }
  }, [mode, rowId, pidFromQuery, profRows]);

  return (
    <Page>
      <Header>
        <Title>Место работы</Title>
      </Header>

      <Card style={{ maxWidth: 920 }}>
        <CardHeader>
          <CardTitle>
            {profName ? `Для профессии: ${profName}` : "Добавление опыта"}
          </CardTitle>
          <GhostBtn type="button" onClick={() => navigate(-1)}>
            Отменить
          </GhostBtn>
        </CardHeader>

        <CardBody>
          <div style={{ display: "grid", gap: 14 }}>
            <Field>
              <Label>Компания</Label>
              <Input
                placeholder="Компания"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </Field>

            <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: 10,
  }}
>
  <Field>
    <Label>Начало (год)</Label>
    <Input
      inputMode="numeric"
      placeholder="Год"
      value={startedYear}
      onChange={(e) =>
        setStartedYear(e.target.value ? Number(e.target.value) : "")
      }
    />
  </Field>

  <Field>
    <Label>Окончание (год)</Label>
    <Input
      inputMode="numeric"
      placeholder="Год"
      disabled={now} // ← станет кликабельным, когда now = false
      value={endedYear}
      onChange={(e) =>
        setEndedYear(e.target.value ? Number(e.target.value) : "")
      }
    />
  </Field>

  <Field>
    <Label>&nbsp;</Label>
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 42,
        padding: "0 10px",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <input
        type="checkbox"
        checked={now}
        onChange={(e) => {
          const checked = e.target.checked;
          setNow(checked);
          if (checked) setEndedYear(""); // очищаем конец, если «по н.в.»
        }}
      />
      По настоящее время
    </label>
  </Field>
</div>

            <Field>
              <Label>Обязанности и достижения</Label>
              <textarea
                placeholder="Чем занимались?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{
                  minHeight: 140,
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
            </Field>

            {err && <Notice tone="error">{err}</Notice>}
            {ok && <Notice tone="success">Сохранено</Notice>}

            <Actions>
              <PrimaryBtn type="button" disabled={!canSave} onClick={onSave}>
                {saving ? "Сохраняем…" : "Сохранить"}
              </PrimaryBtn>
              <GhostBtn type="button" onClick={() => navigate(-1)}>
                Отменить
              </GhostBtn>
            </Actions>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}
