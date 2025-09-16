import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  SwitcherButton,
  SwitcherMenu,
  SwitcherMenuItem,
  SwitcherWrapper,
} from "./style";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const langs = [
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O‘zbekcha" },
];

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  // закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SwitcherWrapper ref={wrapperRef}>
      <SwitcherButton onClick={toggle}>
        {langs.find((l) => l.code === i18n.resolvedLanguage)?.label ?? "Lang"}
        {open ? <IoChevronUp /> : <IoChevronDown />}
      </SwitcherButton>

      {open && (
        <SwitcherMenu>
          {langs.map((l) => (
            <SwitcherMenuItem
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                close();
              }}
              active={i18n.resolvedLanguage === l.code}
            >
              {l.label}
              {i18n.resolvedLanguage === l.code && " ✓"}
            </SwitcherMenuItem>
          ))}
        </SwitcherMenu>
      )}
    </SwitcherWrapper>
  );
}
