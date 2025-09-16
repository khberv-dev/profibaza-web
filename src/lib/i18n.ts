import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "../locales/ru/common.json";
import uz from "../locales/uz/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ru: { common: ru }, uz: { common: uz } },
    fallbackLng: "uz",
    ns: ["common"],
    defaultNS: "common",
    supportedLngs: ["ru", "uz"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "querystring", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
