// src/features/profile/pages/ProProfileSection.tsx
import React from "react";
import { SectionTitle, RailRow } from "../pro-profile-section.style";
import { WorkerProfile } from "./components/WorkerProfile";
import { LegalProfile } from "./components/LegalProfile";
import { ClientProfile } from "./components/ClientProfile";

type Role = "WORKER" | "LEGAL" | "CLIENT";

export default function ProProfileSection({
  role = "WORKER" as Role,
}: {
  role?: Role;
}) {
  return (
    <section>
      {/* <SectionTitle>
        {role === "WORKER"
          ? "Профессиональный профиль"
          : role === "LEGAL"
          ? "Профиль компании"
          : "Пожелания заказчика"}
      </SectionTitle> */}
      {role === "WORKER" && <WorkerProfile />}
      {role === "LEGAL" && <LegalProfile />}
      {role === "CLIENT" && <ClientProfile />}
      {/* Если нужен левый sticky-сайдбар + правый контент (как у HH), разместите внутри компонентов */}
      <RailRow></RailRow>
    </section>
  );
}
