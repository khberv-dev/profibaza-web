import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import {
  Textarea,
  PrimaryBtn,
  GhostBtn,
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
} from "./create-order.style";
import CustomSelect, {
  SelectOption,
} from "../../../../../components/custom-select/CustomSelect";
import { useCreateOrder } from "../../../api";
import { CustomInput } from "../../../../../components/custom-input";
import { DatePopoverInput } from "../../../../../components/custom-date-input/DatePopoverInput";
import { useDistricts, useRegions, useVillages } from "../../../../../shared/modules/location";
import { pickName } from "../../../../../shared/endpoints/location";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorkerById } from "../../../../../shared/endpoints/client";
import { Rate } from "antd";

type Props = { initialWorkerProfessionId?: string | null };

type FormValues = {
  workerProfessionId: string;
  budget: string; // храним как строку, парсим перед отправкой
  addr2: string;
  addr3: string;
  phone: string; // CustomInput(type="phone") кладёт только цифры ("998..."), если нужно
  deadline: string;
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
      deadline: dayjs().add(7, "day").format("YYYY-MM-DD"), // ← ДОБАВИЛИ
    },
    mode: "onChange",            // ← чтобы ошибка убиралась сразу после выбора
  });

  // ==== Остальной локальный стейт ====
  const [description, setDescription] = useState("");
  const deadline = watch("deadline");

  const [addr1, setAddr1] = useState("Toshkent");
  const [areas, setAreas] = useState<string[]>(addr1 ? [addr1] : []);

  const lng = (typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : "ru") || "ru";

  // выбранные локации
  const [regionId, setRegionId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [villageId, setVillageId] = useState<number | null>(null);
  
  // запросы
  const { data: regions = [], isLoading: regionsLoading } = useRegions();
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(regionId ?? undefined);
  const { data: villages = [], isLoading: villagesLoading } = useVillages(districtId ?? undefined);
  
  // options
  const regionOptions: SelectOption[] = useMemo(
    () => regions.map(r => ({ value: r.id, label: pickName(r, lng) })),
    [regions, lng]
  );
  const districtOptions: SelectOption[] = useMemo(
    () => districts.map(d => ({ value: d.id, label: pickName(d, lng) })),
    [districts, lng]
  );
  const villageOptions: SelectOption[] = useMemo(
    () => villages.map(v => ({ value: v.id, label: pickName(v, lng) })),
    [villages, lng]
  );


  const fio = (u?: { name?: string; surname?: string }) =>
    [u?.surname, u?.name].filter(Boolean).join(" ") || "—";
  
  const initials = (u?: { name?: string; surname?: string }) =>
    ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M";
  
  const fmtMoney = (n?: number) =>
    typeof n === "number" ? n.toLocaleString("ru-RU") + " сум" : "—";
  
  // хэндлеры
  const onRegionChange = (v: string | number | null) => {
    const id = v == null ? null : Number(v);
    setRegionId(id);
    setDistrictId(null);
    setVillageId(null);
  };
  const onDistrictChange = (v: string | number | null) => {
    const id = v == null ? null : Number(v);
    setDistrictId(id);
    setVillageId(null);
  };
  const onVillageChange = (v: string | number | null) => {
    const id = v == null ? null : Number(v);
    setVillageId(id);
  };

  const toggleArea = (a: string) =>
    setAreas((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));

  // значения из RHF
  const workerProfessionId = watch("workerProfessionId");

  const { data: workerBrief, isLoading: workerLoading } = useQuery({
    queryKey: ["worker-brief", workerProfessionId],
    enabled: !!workerProfessionId,
    queryFn: ({ signal }) => getWorkerById(workerProfessionId!, signal),
    staleTime: 5 * 60 * 1000,
  });

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

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error(
        "Заполните поля: ID профиля мастера, описание (≥ 8 символов), срок, бюджет."
      );
      return;
    }
    try {
      const regionName  = regionId   ? pickName(regions.find(r => r.id === regionId)!, lng)   : null;
      const districtName= districtId ? pickName(districts.find(d => d.id === districtId)!, lng): null;
      const villageName = villageId  ? pickName(villages.find(v => v.id === villageId)!, lng)  : null;
      
      const dto = {
        workerProfessionId: workerProfessionId.trim(),
        description: description.trim(),
        deadline,
        budget: budgetNum,
        address1: regionName,      // ← регион
        address2: districtName,    // ← район
        address3: villageName,     // ← махалля/посёлок
      };
      const res = await mutateAsync(dto);
      if (res?.ok) {
        toast.success("Buyurtma yaratildi va ustaga jo'natildi");
        navigate('/app/client/orders')
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
        </CardHeader>

        <CardBody>
          {/* Срок + ID мастера */}

          {workerProfessionId ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: 12,
        border: "1px solid #e7ecf3",
        borderRadius: 12,
        background: "#fff",
        marginBottom: 12,
      }}
    >
      {/* Аватар */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          border: "1px solid #e7ecf3",
          background: workerBrief?.worker?.user?.avatar
            ? `url(https://pointer.uz/public/avatar/${workerBrief.worker.user.avatar}) center/cover no-repeat`
            : "linear-gradient(180deg,#eef2ff,#f8fafc)",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          color: "#1e40af",
        }}
        aria-label="Аватар мастера"
      >
        {!workerBrief?.worker?.user?.avatar &&
          initials(workerBrief?.worker?.user)}
      </div>

      {/* ФИО + рейтинг */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 900, color: "#0f172a" }}>
          {workerLoading ? "Загрузка…" : fio(workerBrief?.worker?.user)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
          <Rate allowHalf disabled value={workerBrief?.rating ?? 0} style={{ fontSize: 16 }} />
          <span style={{ fontWeight: 700, color: "#12284a" }}>
            {(workerBrief?.rating ?? 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Вилка цены */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 800, color: "#12284a" }}>
          {fmtMoney(workerBrief?.minPrice)} — {fmtMoney(workerBrief?.maxPrice)}
        </div>
        <div style={{ color: "#6b7a90", fontSize: 12 }}>вилка мастера</div>
      </div>
    </div>
  ) : null}

          <Row>
            <TwoCol>
              <div>
                <SectionLabel>Срок выполнения</SectionLabel>
                <DatePopoverInput
  control={control}
  name="deadline"
  placeholder="ГГГГ-ММ-ДД"
  min={dayjs().format("YYYY-MM-DD")}
  rules={{ required: "Выберите дату" }}
  description="Укажите крайнюю дату — мастеру проще планировать."
/>
              </div>

              {/* <div>
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
              </div> */}
            </TwoCol>
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
  <SectionLabel>Локация работ</SectionLabel>
  <ThreeCol>
    <CustomSelect
      id="region-select"
      options={regionOptions}
      value={regionId}
      onChange={onRegionChange}
      placeholder={regionsLoading ? "Загрузка…" : "Регион"}
      loading={regionsLoading}
      width="100%"
    />
    <CustomSelect
      id="district-select"
      options={districtOptions}
      value={districtId}
      onChange={onDistrictChange}
      placeholder={regionId ? (districtsLoading ? "Загрузка…" : "Район") : "Сначала выберите регион"}
      loading={districtsLoading}
      disabled={!regionId}
      width="100%"
    />
    <CustomSelect
      id="village-select"
      options={villageOptions}
      value={villageId}
      onChange={onVillageChange}
      placeholder={districtId ? (villagesLoading ? "Загрузка…" : "Посёлок/махалля (необязательно)") : "Выберите район"}
      loading={villagesLoading}
      disabled={!districtId}
      width="100%"
    />
  </ThreeCol>
  <Hint>Сначала выберите регион, затем район. Посёлок/махалля — по желанию.</Hint>
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
  бюджет {fmtSum(budgetNum)}, локация: {
    [
      regionId   ? pickName(regions.find(r => r.id === regionId)!, lng)   : null,
      districtId ? pickName(districts.find(d => d.id === districtId)!, lng): null,
      villageId  ? pickName(villages.find(v => v.id === villageId)!, lng)  : null,
    ].filter(Boolean).join(", ")
  }.
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
            {/* <li>
              <span>ID мастера</span>
              <b>
                {workerProfessionId
                  ? workerProfessionId.slice(0, 10) + "…"
                  : "—"}
              </b>
            </li> */}
            <li>
              <span>Срок</span>
              <b>{dayjs(deadline).format("DD.MM.YYYY")}</b>
            </li>
            <li>
              <span>Бюджет</span>
              <b>{fmtSum(budgetNum)}</b>
            </li>
            <li>
    <span>Регион</span>
    <b>{regionId ? pickName(regions.find(r => r.id === regionId)!, lng) : "—"}</b>
  </li>
  <li>
    <span>Регион</span>
    <b>{regionId ? pickName(regions.find(r => r.id === regionId)!, lng) : "—"}</b>
  </li>
  <li>
    <span>Район</span>
    <b>{districtId ? pickName(districts.find(d => d.id === districtId)!, lng) : "—"}</b>
  </li>
  <li>
    <span>Махалля / посёлок</span>
    <b>{villageId ? pickName(villages.find(v => v.id === villageId)!, lng) : "—"}</b>
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
