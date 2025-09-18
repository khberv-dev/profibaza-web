// ProfilePage.tsx
import { useMemo, useState } from "react";
import { useMe } from "../../../shared/modules/user";
import { useTranslation } from "react-i18next";
import {
  Wrap,
  TopBar,
  Crumb,
  Card,
  CardBody,
  AvatarWrap,
  Avatar,
  Info,
  Name,
  Subline,
  MetaRow,
  Badge,
  Actions,
  PrimaryBtn,
  GhostBtn,
  SectionTitle,
  Grid2,
  ContactCard,
  ContactIcon,
  FieldTitle,
  FieldValue,
  AddLink,
  Notice,
  SkeletonLine,
} from "../profile-style";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import EditProfileModal from "./components/EditProfileModal";
import { NavLink } from "react-router-dom";

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
  const [editOpen, setEditOpen] = useState(false);

  const phonePretty = useMemo(
    () => formatPhoneHuman(data?.phone),
    [data?.phone]
  );

  return (
    <Wrap>
      <TopBar>
        <Crumb>
          {t("profile.breadcrumbs")} / <span>{t("profile.title")}</span>
        </Crumb>
        <LangSwitcher />
      </TopBar>

      <Card>
        <CardBody>
          <AvatarWrap>
            <Avatar aria-label="avatar placeholder" />
          </AvatarWrap>

          <Info>
            <Name>
              {isLoading ? (
                <SkeletonLine w={220} />
              ) : (
                <>
                  {data?.name || "—"} {data?.surname || ""}
                </>
              )}
            </Name>
            <Subline>
              {isLoading ? (
                <SkeletonLine w={160} />
              ) : data ? (
                new Date(data.createdAt).toLocaleDateString()
              ) : (
                "—"
              )}
            </Subline>

            <MetaRow>
              {isLoading ? (
                <SkeletonLine w={80} />
              ) : (
                <Badge>
                  {data?.role ? t(`profile.roles.${data.role}`) : "—"}
                </Badge>
              )}
              <Badge tone="muted">{t("profile.visibility.public")}</Badge>
            </MetaRow>

            <Actions>
              <PrimaryBtn type="button" onClick={() => setEditOpen(true)}>
                {t("profile.edit")}
              </PrimaryBtn>
              <NavLink to="/app/settings" style={{ textDecoration: "none" }}>
                <GhostBtn type="button">{t("profile.settings")}</GhostBtn>
              </NavLink>
            </Actions>
          </Info>
        </CardBody>
      </Card>

      {isError && (
        <Notice tone="error">
          {(error as any)?.message || t("profile.loadFailed")}
        </Notice>
      )}

      <SectionTitle>{t("profile.contacts")}</SectionTitle>

      <Grid2>
        <ContactCard>
          <ContactIcon src="/phone.svg" alt="" />
          <div>
            <FieldTitle>{t("profile.phone")}</FieldTitle>
            <FieldValue>
              {isLoading ? <SkeletonLine w={120} /> : phonePretty}
            </FieldValue>
          </div>
        </ContactCard>

        <ContactCard>
          <ContactIcon src="/mail.svg" alt="" />
          <div>
            <FieldTitle>{t("profile.email")}</FieldTitle>
            <FieldValue>
              {isLoading ? <SkeletonLine w={200} /> : data?.email || "—"}
            </FieldValue>
          </div>
        </ContactCard>
      </Grid2>

      <SectionTitle>{t("profile.otherContacts")}</SectionTitle>
      <AddLink href="#">{t("profile.add")}</AddLink>

      <SectionTitle style={{ marginTop: 28 }}>
        {t("profile.searchSettings")}
      </SectionTitle>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={data}
      />
    </Wrap>
  );
}
