import { useMemo } from "react";
import { useMe } from "../../../shared/modules/user";
import { useTranslation } from "react-i18next";
import {
  Wrap,
  Breadcrumbs,
  Card,
  Info,
  Name,
  Subline,
  EditBtn,
  Avatar,
  SectionTitle,
  Grid2,
  ContactCard,
  ContactIcon,
  FieldTitle,
  FieldValue,
  AddLink,
} from "../profile-style";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";

function formatPhoneHuman(p?: string | null) {
  const d = (p || "").replace(/\D/g, "");
  if (d.length !== 12) return p || "—";
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)}-${d.slice(
    8,
    10
  )}-${d.slice(10)}`;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useMe();

  const phonePretty = useMemo(
    () => formatPhoneHuman(data?.phone),
    [data?.phone]
  );

  return (
    <Wrap>
      <Breadcrumbs>
        {t("profile.breadcrumbs")} / <span>{t("profile.title")}</span>
      </Breadcrumbs>

      <Card>
        <Info>
          <Name>
            {data?.name || "—"} {data?.surname || ""}
          </Name>
          <Subline>
            {data ? new Date(data.createdAt).toLocaleDateString() : "—"}
          </Subline>
          <EditBtn type="button">{t("profile.edit")}</EditBtn>
        </Info>

        <Avatar aria-label="avatar placeholder" />
      </Card>

      {isLoading && <div style={{ padding: 12 }}>{t("loading")}</div>}
      {isError && (
        <div style={{ padding: 12, color: "#ef4444" }}>
          {(error as any)?.message || t("profile.loadFailed")}
        </div>
      )}

      <SectionTitle>{t("profile.contacts")}</SectionTitle>

      <Grid2>
        <ContactCard>
          <ContactIcon src="/phone.svg" alt="" />
          <div>
            <FieldTitle>{t("profile.phone")}</FieldTitle>
            <FieldValue>{phonePretty}</FieldValue>
          </div>
        </ContactCard>

        <ContactCard>
          <ContactIcon src="/mail.svg" alt="" />
          <div>
            <FieldTitle>{t("profile.email")}</FieldTitle>
            <FieldValue>{data?.email || "—"}</FieldValue>
          </div>
        </ContactCard>
      </Grid2>

      <SectionTitle>{t("profile.otherContacts")}</SectionTitle>
      <AddLink href="#">{t("profile.add")}</AddLink>

      <SectionTitle style={{ marginTop: 24 }}>
        {t("profile.searchSettings")}
      </SectionTitle>
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LangSwitcher />
      </div>
    </Wrap>
  );
}
