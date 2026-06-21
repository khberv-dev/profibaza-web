import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn";

const STATUS_TONES: Record<
  string,
  "blue" | "green" | "amber" | "gray" | "red"
> = {
  NEW: "blue",
  PROGRESS: "amber",
  DONE: "green",
  CANCELLED: "red",
  ACCEPTED: "green",
  REJECTED: "red",
};

export function useOrderLabels() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language?.startsWith("uz");
  const numberLocale = isUz ? "uz-UZ" : "ru-RU";

  useEffect(() => {
    dayjs.locale(isUz ? "uz-latn" : "ru");
  }, [isUz]);

  const dash = t("orders.dash");

  const fmtMoney = useCallback(
    (n?: number | null) =>
      typeof n === "number" && !Number.isNaN(n)
        ? `${n.toLocaleString(numberLocale)} ${t("orders.currency")}`
        : dash,
    [dash, numberLocale, t]
  );

  const fio = useCallback(
    (u?: {
      name?: string;
      surname?: string;
      middleName?: string | null;
    }) =>
      [u?.surname, u?.name].filter(Boolean).join(" ") ||
      t("orders.fallbackWorker"),
    [t]
  );

  const fmtDate = useCallback(
    (iso?: string | null) => (iso ? dayjs(iso).format("DD.MM.YYYY") : dash),
    [dash]
  );

  const fmtFromNow = useCallback(
    (iso?: string) => (iso ? dayjs(iso).fromNow() : ""),
    []
  );

  const getStatus = useCallback(
    (status?: string) => ({
      text: status
        ? t(`orders.status.${status}`, { defaultValue: status })
        : dash,
      tone: STATUS_TONES[status ?? ""] ?? ("gray" as const),
    }),
    [dash, t]
  );

  const initials = useCallback(
    (u?: { name?: string; surname?: string }) =>
      ((u?.surname?.[0] ?? "") + (u?.name?.[0] ?? "")).toUpperCase() || "M",
    []
  );

  return {
    t,
    dash,
    fmtMoney,
    fio,
    fmtDate,
    fmtFromNow,
    getStatus,
    initials,
  };
}
