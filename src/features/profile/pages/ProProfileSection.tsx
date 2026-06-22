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
  embedded = false,
}: {
  role?: Role;
  embedded?: boolean;
}) {
  return (
    <section>
      {role === "WORKER" && <WorkerProfile embedded={embedded} />}
      {role === "LEGAL" && <LegalProfile />}
      {role === "CLIENT" && <ClientProfile />}
      {role === "INVESTOR" && <InvestorProfile />}
      <RailRow></RailRow>
    </section>
  );
}
