// src/features/profile/components/ClientProfile.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Field,
  Label,
  Textarea,
  Chips,
  Chip,
  PriceRow,
  Hint,
  PrimaryBtn,
  GhostBtn,
  ProfPickerWrap,
  TagList,
  Tag,
  InputBase,
  Dropdown,
  Empty,
  AddGhost,
  GroupLabel,
  OptionRow,
  OptionCheck,
  Input,
} from "../../../pro-profile-section.style";
import { CreateOrderCard } from "./CreateOrderCard";

const AREAS = [
  "Бухара",
  "Гиждуван",
  "Каган",
  "Вабкент",
  "Каракуль",
  "Самарканд",
  "Навои",
];
const PROF_GROUPS: Array<{ name: string; items: string[] }> = [
  {
    name: "Популярные",
    items: ["Электрик", "Сантехник", "Строитель", "Дизайнер"],
  },
  { name: "Отделка", items: ["Маляр", "Плотник", "Отделочник"] },
  { name: "Производство / монтаж", items: ["Сварщик", "Инженер-прораб"] },
];

export const ClientProfile: React.FC = () => {
  const [clientPref, setClientPref] = useState<
    "Индивидуально" | "Компания" | "Зарубеж"
  >("Индивидуально");
  const [clientNotes, setClientNotes] = useState("");
  const [clientBudgetMin, setClientBudgetMin] = useState("");
  const [clientBudgetMax, setClientBudgetMax] = useState("");
  const [areas, setAreas] = useState<string[]>(["Бухара"]);

  const [prof, setProf] = useState<string[]>(["Электрик"]);
  const [profQuery, setProfQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const toggleIn = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <Card style={{ marginTop: "20px" }}>
        <CreateOrderCard />
      </Card>
    </div>
  );
};
