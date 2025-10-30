// src/layouts/FindOrTopbarLayout.tsx
import { TopbarLayout } from "./TopbarLayout";
import { FindLayout } from "./FindLayout";
import { useAuthStore } from "../shared/stores/auth";

export function FindOrTopbarLayout() {
  const isAuthed = useAuthStore((s) => s.isAuthed);

  // если авторизован — показываем TopbarLayout
  // (т.е. тот же хедер, что у /app)
  if (isAuthed) {
    return <TopbarLayout />;
  }

  // иначе публичный лендинг-стиль лейаута
  return <FindLayout />;
}
