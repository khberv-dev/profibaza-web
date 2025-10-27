import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { Profession, ProfessionCategory } from "../../shared/modules/worker";

export type ProfessionsModalProps = {
  open: boolean;
  onClose: () => void;
  categories: ProfessionCategory[];
  lang: "ru" | "uz";
  popularIds?: string[];
  selectedId?: string | null;
  onSelect: (p: Profession) => void;
};

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.38);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const Sheet = styled(motion.div)`
  width: min(980px, 92vw);
  max-height: 86vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(2, 32, 71, 0.14);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto 1fr;
`;

const Head = styled.div`
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }
  .spacer {
    flex: 1;
  }
  button.close {
    border: 0;
    background: transparent;
    font-size: 22px;
    cursor: pointer;
    line-height: 1;
    opacity: 0.6;
  }
`;

const SelectedBadge = styled.div`
  padding: 6px 10px;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #2f6bff;
  }
`;

const Tabs = styled.div`
  padding: 10px 14px 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  background: #ffffff;
`;

const Tab = styled.button<{ $active?: boolean }>`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: none;
  background: ${({ $active }) => ($active ? "#2f6bff" : "#f1f4f9")};
  color: ${({ $active }) => ($active ? "#fff" : "#0f172a")};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
`;

const Body = styled.div`
  padding: 14px 16px 20px;
  overflow: auto;
  background: #ffffff;
`;

const Grid = styled.div`
  display: grid;
  gap: 10px 14px;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  @media (min-width: 860px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ItemBtn = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: ${({ $active }) => ($active ? "#f1f4f9" : "#f8fafc")};
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#2f6bff" : "#0f172a")};
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: ${({ $active }) => ($active ? "#eef2ff" : "#f1f5f9")};
  }
`;

/* ======= motion variants ======= */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const sheetVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const label = (p: any, lang: "ru" | "uz") =>
  (lang === "uz" ? p?.nameUz : p?.nameRu) || p?.name || "";

/* ======= COMPONENT ======= */
export const ProfessionsModal: React.FC<ProfessionsModalProps> = ({
  open,
  onClose,
  categories,
  lang,
  popularIds = [],
  selectedId = null,
  onSelect,
}) => {
  const tabs = useMemo(() => {
    const normalized = categories.map((c) => ({
      id: String(c.id),
      nameRu: (c as any).nameRu,
      nameUz: (c as any).nameUz,
      professions: (c.professions ?? []) as Profession[],
    }));
    const popular =
      popularIds.length > 0
        ? {
            id: "__popular__",
            nameRu: "Популярные",
            nameUz: "Ommabop",
            professions: categories
              .flatMap((c) => c.professions ?? [])
              .filter((p) => popularIds.includes(p.id)),
          }
        : null;
    return popular ? [popular, ...normalized] : normalized;
  }, [categories, popularIds]);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!tabs.length) return;
    if (!activeId || !tabs.some((t) => t.id === activeId)) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  const active = tabs.find((t) => t.id === activeId) ?? null;

  const selectedLabel = useMemo(() => {
    if (!selectedId) return "";
    const p = categories
      .flatMap((c) => c.professions ?? [])
      .find((p) => p.id === selectedId);
    return p ? label(p, lang) : "";
  }, [categories, selectedId, lang]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Sheet
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Head>
              <h3>
                {lang === "uz" ? "Kasb toifalari" : "Категории профессий"}
              </h3>
              {selectedLabel && (
                <SelectedBadge>
                  <span className="dot" />
                  <span>{selectedLabel}</span>
                </SelectedBadge>
              )}
              <div className="spacer" />
              <button className="close" onClick={onClose}>
                ×
              </button>
            </Head>

            <Tabs>
              {tabs.map((t) => (
                <Tab
                  key={t.id}
                  $active={t.id === activeId}
                  onClick={() => setActiveId(t.id)}
                >
                  {label(t, lang)}
                </Tab>
              ))}
            </Tabs>

            <Body>
              {!active || !active.professions?.length ? (
                <div
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {lang === "uz"
                    ? "Bu toifada hozircha kasblar yo‘q"
                    : "В этой вкладке пока нет профессий"}
                </div>
              ) : (
                <Grid>
                  {active.professions.map((p) => (
                    <ItemBtn
                      key={p.id}
                      $active={p.id === selectedId}
                      onClick={() => onSelect(p)}
                    >
                      {label(p, lang)}
                    </ItemBtn>
                  ))}
                </Grid>
              )}
            </Body>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
