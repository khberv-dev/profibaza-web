// src/features/profile/pages/ProfilePage.tsx
import { useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
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

import { useMe } from "../../../shared/modules/user";
import { useAvatar, useUploadAvatar } from "../../../shared/modules/avatar";

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

  // Аватарка: получаем текущую (GET /avatar) и загружаем новую (POST /update-avatar)
  const {
    url: avatarUrl,
    isLoading: avatarLoading,
    isError: avatarError,
  } = useAvatar();
  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const phonePretty = useMemo(
    () => formatPhoneHuman(data?.phone),
    [data?.phone]
  );

  const onPick = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // простая валидация файла
    if (!/^image\//.test(f.type)) {
      alert("Допустимы только файлы изображений (JPG, PNG, WEBP и т.п.)");
      e.target.value = "";
      return;
    }
    const MAX = 3 * 1024 * 1024;
    if (f.size > MAX) {
      alert("Размер файла не должен превышать 3 МБ");
      e.target.value = "";
      return;
    }

    uploadAvatar(f, {
      onSuccess: () => {
        // сбросим значение инпута, чтобы можно было загрузить тот же файл повторно
        e.target.value = "";
      },
      onError: (err: any) => {
        alert(err?.message || "Ошибка загрузки аватарки");
      },
    });
  };

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
            {/* Если есть загруженная аватарка — показываем её, иначе — плейсхолдер из стилей */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                width={112}
                height={112}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  border: "2px solid #E7ECF3",
                  objectFit: "cover",
                  background: "#f1f5f9",
                }}
              />
            ) : (
              <Avatar aria-label="avatar placeholder" />
            )}
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
              <PrimaryBtn type="button" onClick={onPick} disabled={uploading}>
                {uploading
                  ? t("profile.uploading") || "Загрузка..."
                  : t("profile.uploadAvatar") || "Загрузить аватар"}
              </PrimaryBtn>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />

              <NavLink to="/app/settings" style={{ textDecoration: "none" }}>
                <GhostBtn type="button" disabled={uploading}>
                  {t("profile.settings")}
                </GhostBtn>
              </NavLink>
            </Actions>

            {(avatarLoading || uploading) && (
              <Subline>
                {uploading
                  ? t("profile.uploading") || "Отправляем файл..."
                  : t("profile.loadingAvatar") || "Загружаем аватар..."}
              </Subline>
            )}
            {avatarError &&
              avatarUrl == null &&
              // убрано сообщение об ошибке, плейсхолдер остаётся
              null}
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
