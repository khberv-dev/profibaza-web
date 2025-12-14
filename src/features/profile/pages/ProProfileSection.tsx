// src/features/profile/pages/ProProfileSection.tsx
import React from "react";
import { SectionTitle, RailRow } from "../pro-profile-section.style";
import { WorkerProfile } from "./components/worker/WorkerProfile";
import { LegalProfile } from "./components/LegalProfile";
import { ClientProfile } from "./components/client/ClientProfile";
import InvestorProfile from "./components/InvestorProfile";

type Role = "WORKER" | "LEGAL" | "CLIENT" | "INVESTOR";

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
      {role === "INVESTOR" && <InvestorProfile />}
      {/* Если нужен левый sticky-сайдбар + правый контент (как у HH), разместите внутри компонентов */}
      <RailRow></RailRow>
    </section>
  );
}
