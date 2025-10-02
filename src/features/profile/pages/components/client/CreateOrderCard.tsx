import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import {
  Textarea,
  PrimaryBtn,
  GhostBtn,
  ProfPickerWrap,
  TagList,
  Tag,
  InputBase,
  GroupLabel,
  Dropdown,
  OptionRow,
  OptionCheck,
} from "../../../pro-profile-section.style";

import {
  OrderGrid,
  CardWrap,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  SectionLabel,
  TwoCol,
  ThreeCol,
  Chips,
  BudgetChip,
  Hint,
  Actions,
  SummaryList,
  SoftBar,
  Small,
  DropdownScroll,
} from "./create-order.style";
import CustomSelect, {
  SelectOption,
} from "../../../../../components/custom-select/CustomSelect";
import { useCreateOrder } from "../../../api";
import { CustomInput } from "../../../../../components/custom-input";

type Props = { initialWorkerProfessionId?: string | null };

type FormValues = {
  workerProfessionId: string;
  budget: string; // храним как строку, парсим перед отправкой
  addr2: string;
  addr3: string;
  phone: string; // CustomInput(type="phone") кладёт только цифры ("998..."), если нужно
};

const AREAS = [
  "Toshkent",
  "Buxoro",
  "Samarqand",
  "Navoiy",
  "Andijon",
  "Farg‘ona",
];
const QUICK_BUDGETS = [300_000, 500_000, 1_000_000, 2_000_000, 5_000_000];

const PROF_GROUPS: Array<{ name: string; items: string[] }> = [
  {
    name: "Ommabop",
    items: ["Elektrik", "Santexnik", "Quruvchi", "Payvandchi"],
  },
  { name: "Ichki ta’mir", items: ["Malyar", "Duradgor", "Parketchi"] },
  { name: "Montaj / ishlab chiqarish", items: ["GKL usta", "Yog‘och ustasi"] },
];

export const CreateOrderCard: React.FC<Props> = ({
  initialWorkerProfessionId,
}) => {
  // ==== RHF: ИНИЦИАЛИЗАЦИЯ ====
  const { control, watch, setValue, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      workerProfessionId: initialWorkerProfessionId || "",
      budget: "",
      addr2: "",
      addr3: "",
      phone: "",
    },
    mode: "onBlur",
  });

  // ==== Остальной локальный стейт ====
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(
    dayjs().add(7, "day").format("YYYY-MM-DD")
  );

  const [addr1, setAddr1] = useState("Toshkent");
  const [areas, setAreas] = useState<string[]>(addr1 ? [addr1] : []);
  const areaOptions: SelectOption[] = useMemo(
    () => AREAS.map((a) => ({ value: a, label: a })),
    []
  );

  const [prof, setProf] = useState<string[]>([]);
  const [profQuery, setProfQuery] = useState("");
  const [open, setOpen] = useState(false);

  const toggleArea = (a: string) =>
    setAreas((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));

  // значения из RHF
  const workerProfessionId = watch("workerProfessionId");
  const budgetStr = watch("budget");
  const addr2 = watch("addr2");
  const addr3 = watch("addr3");
  const budgetNum = Number(budgetStr) || 0;

  const { mutateAsync, isPending } = useCreateOrder();

  const canSubmit =
    !!workerProfessionId &&
    description.trim().length >= 8 &&
    !!deadline &&
    budgetNum >= 0;

  const addBudget = (v: number) =>
    setValue("budget", String(v), { shouldDirty: true, shouldValidate: true });

  const fmtSum = (n?: number) => (n ? n.toLocaleString("ru-RU") + " сум" : "—");

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error(
        "Заполните поля: ID профиля мастера, описание (≥ 8 символов), срок, бюджет."
      );
      return;
    }
    try {
      const dto = {
        workerProfessionId: workerProfessionId.trim(),
        description: description.trim(),
        deadline,
        budget: budgetNum,
        address1: addr1 || null,
        address2: addr2 || null,
        address3: addr3 || null,
      };
      const res = await mutateAsync(dto);
      if (res?.ok) {
        toast.success("Заявка создана");
        reset({
          workerProfessionId: initialWorkerProfessionId || "",
          budget: "",
          addr2: "",
          addr3: "",
          phone: "",
        });
        setDescription("");
        setAddr1("Toshkent");
        setAreas(["Toshkent"]);
      } else {
        toast.error("Не удалось создать заявку");
      }
    } catch (e: any) {
      toast.error(e?.message || "Ошибка создания заявки");
    }
  };

  return (
    <OrderGrid>
      {/* ФОРМА */}
      <CardWrap>
        <CardHeader>
          <CardTitle>Создание заявки</CardTitle>
          <Small>Светлый стиль, аккуратный как в hh</Small>
        </CardHeader>

        <CardBody>
          {/* Срок + ID мастера */}
          <Row>
            <TwoCol>
              <div>
                <SectionLabel>Срок выполнения</SectionLabel>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={dayjs().format("YYYY-MM-DD")}
                  style={{
                    height: 38,
                    width: "100%",
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid #e7ecf3",
                    background: "#fff",
                    color: "#0f172a",
                  }}
                />
                <Hint>Укажите крайнюю дату — мастеру проще планировать.</Hint>
              </div>

              <div>
                <SectionLabel>ID профиля мастера</SectionLabel>
                <CustomInput
                  control={control}
                  name="workerProfessionId"
                  placeholder="783f1a3e-2557-4b91-ba8f-cac8524d4bc6"
                  rules={{ required: "Укажите ID профиля мастера" }}
                />
                <Hint>
                  Подставляется автоматически при заявке из карточки мастера.
                </Hint>
              </div>
            </TwoCol>
          </Row>

          {/* Теги профессий */}
          <Row>
            <SectionLabel>Кого ищете (теги)</SectionLabel>
            <ProfPickerWrap>
              <TagList>
                {prof.map((p) => (
                  <Tag key={p}>
                    <span>{p}</span>
                    <button
                      type="button"
                      aria-label="remove"
                      onClick={() => setProf((s) => s.filter((x) => x !== p))}
                    >
                      ×
                    </button>
                  </Tag>
                ))}
                <InputBase
                  placeholder={
                    prof.length ? "Добавить ещё…" : "Например: Elektrik"
                  }
                  value={profQuery}
                  onChange={(e) => setProfQuery(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onClick={() => setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = profQuery.trim();
                      if (!val) return;
                      setProf((s) => (s.includes(val) ? s : [...s, val]));
                      setProfQuery("");
                      setOpen(false);
                    }
                    if (e.key === "Backspace" && !profQuery && prof.length) {
                      setProf((s) => s.slice(0, -1));
                    }
                  }}
                />
              </TagList>

              {open && (
                <Dropdown onMouseDown={(e) => e.preventDefault()}>
                  <DropdownScroll>
                    {PROF_GROUPS.map((g) => {
                      const items = g.items.filter((x) =>
                        x.toLowerCase().includes(profQuery.trim().toLowerCase())
                      );
                      if (!items.length) return null;
                      return (
                        <div key={g.name}>
                          <GroupLabel>{g.name}</GroupLabel>
                          {items.map((opt) => {
                            const active = prof.includes(opt);
                            return (
                              <OptionRow
                                key={opt}
                                aria-checked={active}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setProf((s) =>
                                    active
                                      ? s.filter((x) => x !== opt)
                                      : [...s, opt]
                                  );
                                  setProfQuery("");
                                  setOpen(false);
                                }}
                              >
                                <OptionCheck data-active={active} />
                                <span>{opt}</span>
                              </OptionRow>
                            );
                          })}
                        </div>
                      );
                    })}
                  </DropdownScroll>
                </Dropdown>
              )}
            </ProfPickerWrap>
            <Hint>
              Теги помогают подобрать мастеров — в API не отправляются.
            </Hint>
          </Row>

          {/* Бюджет + пресеты */}
          <Row>
            <SectionLabel>Бюджет</SectionLabel>
            <TwoCol>
              <CustomInput
                control={control}
                name="budget"
                placeholder="сум"
                rules={{
                  validate: (v: string) =>
                    v === "" || /^\d+$/.test(v) || "Только цифры",
                }}
              />
              <Chips>
                {QUICK_BUDGETS.map((b) => (
                  <BudgetChip
                    key={b}
                    active={Number(budgetStr) === b}
                    onClick={() => addBudget(b)}
                  >
                    {b.toLocaleString("ru-RU")}
                  </BudgetChip>
                ))}
              </Chips>
            </TwoCol>
            <Hint>Можно оставить пустым — мастера предложат свои ставки.</Hint>
          </Row>

          {/* Регионы: селект + чипсы */}
          <Row>
            <SectionLabel>Локация работ (регионы)</SectionLabel>
            <TwoCol>
              <CustomSelect
                id="area-select"
                options={areaOptions}
                value={addr1}
                onChange={(v) => {
                  const val = String(v || "");
                  setAddr1(val);
                  if (val && !areas.includes(val)) setAreas((s) => [...s, val]);
                }}
                placeholder="Выберите регион"
                width="100%"
              />
              <Chips>
                {AREAS.map((a) => (
                  <BudgetChip
                    as="button"
                    key={a}
                    active={areas.includes(a)}
                    onClick={() => toggleArea(a)}
                  >
                    {a}
                  </BudgetChip>
                ))}
              </Chips>
            </TwoCol>
            <Hint>Выберите 1–3 приоритетных региона.</Hint>
          </Row>

          {/* Адрес-детализация + телефон */}
          <Row>
            <SectionLabel>Адрес (детализация)</SectionLabel>
            <ThreeCol>
              <CustomInput
                control={control}
                name="addr2"
                placeholder="Район/посёлок"
              />
              <CustomInput
                control={control}
                name="addr3"
                placeholder="Улица/ориентир"
              />
              <CustomInput
                control={control}
                name="phone"
                type="phone"
                placeholder="+998 (__) ___-__-__"
              />
            </ThreeCol>
            <Hint>
              Можно указать частично — главное, чтобы мастер понимал логистику.
            </Hint>
          </Row>

          {/* Описание */}
          <Row>
            <SectionLabel>Описание задачи</SectionLabel>
            <Textarea
              rows={6}
              placeholder="Пример: Zo'r devor bor, shundan sim o'tkazish kerak. Material bor, ishni 5 yanvargacha tugatish kerak."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Hint>Чем подробнее — тем точнее отклики.</Hint>
          </Row>

          <Actions>
            <PrimaryBtn
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
            >
              {isPending ? "Отправляем…" : "Создать заявку"}
            </PrimaryBtn>
            <GhostBtn type="button" onClick={() => window.history.back()}>
              Отмена
            </GhostBtn>
          </Actions>

          <SoftBar>
            <b>Предпросмотр:</b> Дедлайн {dayjs(deadline).format("DD.MM.YYYY")},
            бюджет {fmtSum(budgetNum)}, регион(ы):{" "}
            {areas.length ? areas.join(", ") : "—"}.
          </SoftBar>
        </CardBody>
      </CardWrap>

      {/* САЙДБАР */}
      <CardWrap>
        <CardHeader>
          <CardTitle>Итого по заявке</CardTitle>
        </CardHeader>
        <CardBody>
          <SummaryList>
            <li>
              <span>ID мастера</span>
              <b>
                {workerProfessionId
                  ? workerProfessionId.slice(0, 10) + "…"
                  : "—"}
              </b>
            </li>
            <li>
              <span>Срок</span>
              <b>{dayjs(deadline).format("DD.MM.YYYY")}</b>
            </li>
            <li>
              <span>Бюджет</span>
              <b>{fmtSum(budgetNum)}</b>
            </li>
            <li>
              <span>Регион(ы)</span>
              <b>{areas.length ? areas.join(", ") : "—"}</b>
            </li>
            <li>
              <span>Адрес</span>
              <b>{[addr1, addr2, addr3].filter(Boolean).join(", ") || "—"}</b>
            </li>
            <li>
              <span>Описание</span>
              <b>
                {description
                  ? description.length > 26
                    ? description.slice(0, 26) + "…"
                    : description
                  : "—"}
              </b>
            </li>
          </SummaryList>
          <SoftBar>
            После отправки заявка попадёт мастеру. Он увидит дедлайн, бюджет и
            адрес и сможет быстро откликнуться.
          </SoftBar>
        </CardBody>
      </CardWrap>
    </OrderGrid>
  );
};
