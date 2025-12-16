// src/features/profile/pages/ProfilePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz";
import styled from "@emotion/styled";

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
  NameRow,
  CompanyBadge,
  LogoutBtn,
} from "../profile-style";

import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import EditProfileModal from "./components/EditProfileModal";

import { useMe, USER_QUERY_KEY } from "../../../shared/modules/user";
import { CLIENT_ME_QK as CLIENT_ME_QUERY_KEY } from "../../../shared/modules/client";
import { LEGAL_ME_QK as LEGAL_ME_QUERY_KEY } from "../../../shared/modules/legal";
import { useAvatar, useUploadAvatar } from "../../../shared/modules/avatar";

// Локации + имя по языку
import {
  useRegions,
  useDistricts,
  useVillages,
} from "../../../shared/modules/location";
import { pickName } from "../../../shared/endpoints/location";

import {
  useLegalMe,
  useUpdateLegalAddress,
} from "../../../shared/modules/legal";

import {
  useInvestorMe,
  INVESTOR_ME_QK as INVESTOR_ME_QUERY_KEY,
} from "../../../shared/modules/useInvestor";

// Клиентское API: адрес + /client/me
import {
  useUpdateClientAddress,
  useClientMe,
} from "../../../shared/modules/client";

// Кастомный селект
import CustomSelect, {
  SelectOption,
} from "../../../components/custom-select/CustomSelect";
import ProProfileSection from "./ProProfileSection";
import { useQueryClient } from "@tanstack/react-query";
import { EditBtn } from "../pro-profile-section.style";
import { useUpdateInvestorAddress } from "../../../shared/endpoints/investor";

/* — аккуратная карточка адреса — */
/* — hh-like address card — */
const AddressCard = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.03);
`;

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const AddressTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const AddressHint = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const LinkBtn = styled.button`
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  background: #fff;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
  border-radius: 10px;
  transition: box-shadow 0.15s ease, transform 0.06s ease, background 0.15s ease;
  &:hover {
    background: #f9fafb;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const AddressLine = styled.div`
  color: #0f172a;
  font-weight: 600;
  min-height: 22px;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const AddressSub = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
`;

const AddressDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 12px 0;
`;

/* Кнопочная полоса действий */
const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 12px;
`;

/* Сетка селектов */
const SelectRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

function formatPhoneHuman(p?: string | null) {
  const d = (p || "").replace(/\D/g, "");
  if (d.length !== 12) return p || "—";
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)}-${d.slice(
    8,
    10
  )}-${d.slice(10)}`;
}

/** поиск по nameRu/nameUz */
function findByAnyName<
  T extends { id: number; nameRu: string; nameUz: string }
>(items: T[] | undefined, needle?: string | null) {
  if (!items || !needle) return undefined;
  const n = needle.trim().toLowerCase();
  return items.find(
    (x) =>
      x.nameRu.trim().toLowerCase() === n || x.nameUz.trim().toLowerCase() === n
  );
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, error } = useMe();

  const safeFormatDate = (v?: string | null) => {
    if (!v) return "—";
    const d = dayjs(v);
    return d.isValid()
      ? d.locale(i18n.language).format("DD.MM.YYYY HH:mm")
      : "—";
  };

  // === Аватарка ===
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
        e.target.value = "";
      },
      onError: (err: any) => {
        alert(err?.message || "Ошибка загрузки аватарки");
      },
    });
  };

  // === CLIENT address ===
  const isClient = data?.role === "CLIENT";
  const { data: clientMe } = useClientMe(!!isClient);

  const isLegal = data?.role === "LEGAL";
  const { data: legalMe } = useLegalMe(!!isLegal);

  const isInvestor = data?.role === "INVESTOR";
  const { data: investorMe } = useInvestorMe(!!isInvestor);

  const activeProfile = isClient
    ? clientMe
    : isLegal
    ? legalMe
    : isInvestor
    ? investorMe
    : undefined;

  const [regionId, setRegionId] = useState<number | undefined>(undefined);
  const [districtId, setDistrictId] = useState<number | undefined>(undefined);
  const [villageId, setVillageId] = useState<number | undefined>(undefined);

  const { data: regions, isLoading: regionsLoading } = useRegions();
  const { data: districts, isLoading: districtsLoading } =
    useDistricts(regionId);
  const { data: villages, isLoading: villagesLoading } =
    useVillages(districtId);

  const regionOptions: SelectOption[] = (regions || []).map((r) => ({
    value: r.id,
    label: pickName(r, i18n.language),
  }));
  const districtOptions: SelectOption[] = (districts || []).map((d) => ({
    value: d.id,
    label: pickName(d, i18n.language),
  }));
  const villageOptions: SelectOption[] = (villages || []).map((v) => ({
    value: v.id,
    label: pickName(v, i18n.language),
  }));

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [hydrateStage, setHydrateStage] = useState<0 | 1 | 2 | 3>(3);

  const openAddressEditor = () => {
    setIsEditingAddress(true);
    setRegionId(undefined);
    setDistrictId(undefined);
    setVillageId(undefined);
    setHydrateStage(0);
  };

  const cancelAddressEditor = () => {
    setIsEditingAddress(false);
    setRegionId(undefined);
    setDistrictId(undefined);
    setVillageId(undefined);
    setHydrateStage(3);
    setAddrSaved(null);
    setSaveMsg(null);
  };

  // Гидрация — только когда редактор открыт
  // 1: region
  useEffect(() => {
    if (!isEditingAddress) return;
    if (!(isClient || isLegal || isInvestor)) return;
    if (!activeProfile) return;
    if (!regions) return;
    if (hydrateStage !== 0) return;

    const r = findByAnyName(regions, activeProfile.address1);
    if (r) {
      setRegionId(r.id);
      setHydrateStage(1);
    } else {
      setHydrateStage(3);
    }
  }, [
    isEditingAddress,
    isClient,
    isLegal,
    activeProfile,
    regions,
    hydrateStage,
  ]);

  // 2: district
  useEffect(() => {
    if (!isEditingAddress) return;
    if (hydrateStage !== 1) return;
    if (!regionId) return;
    if (!districts) return;

    const d = findByAnyName(districts, activeProfile?.address2 || undefined);
    if (d) {
      setDistrictId(d.id);
      setHydrateStage(2);
    } else {
      setHydrateStage(3);
    }
  }, [
    isEditingAddress,
    hydrateStage,
    regionId,
    districts,
    activeProfile?.address2,
  ]);

  // 3: village
  useEffect(() => {
    if (!isEditingAddress) return;
    if (hydrateStage !== 2) return;
    if (!districtId) return;
    if (!villages) return;

    const v = findByAnyName(villages, activeProfile?.address3 || undefined);
    if (v) setVillageId(v.id);
    setHydrateStage(3);
  }, [
    isEditingAddress,
    hydrateStage,
    districtId,
    villages,
    activeProfile?.address3,
  ]);

  const onRegionChange = (val: string | number | null) => {
    const id = val != null ? Number(val) : undefined;
    setRegionId(id);
    setDistrictId(undefined);
    setVillageId(undefined);
  };
  const onDistrictChange = (val: string | number | null) => {
    const id = val != null ? Number(val) : undefined;
    setDistrictId(id);
    setVillageId(undefined);
  };
  const onVillageChange = (val: string | number | null) => {
    const id = val != null ? Number(val) : undefined;
    setVillageId(id);
  };

  const qc = useQueryClient();

  // Сохранение
  const { mutate: saveClientAddress, isPending: savingClientAddress } =
    useUpdateClientAddress();
  const { mutate: saveLegalAddress, isPending: savingLegalAddress } =
    useUpdateLegalAddress();

  const { mutate: saveInvestorAddress, isPending: savingInvestorAddress } =
    useUpdateInvestorAddress();

  const savingAddress = (
    isClient
      ? savingClientAddress
      : isLegal
      ? savingLegalAddress
      : isInvestor
      ? savingInvestorAddress
      : false
  ) as boolean;

  const [addrSaved, setAddrSaved] = useState<null | "ok" | "err">(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const submitAddress = () => {
    const region = regions?.find((r) => r.id === regionId);
    const district = districts?.find((d) => d.id === districtId);
    const village = villages?.find((v) => v.id === villageId);

    if (!region || !district || !village) {
      alert(
        t("profile.address.fillAll") ||
          "Выберите область, район и населённый пункт"
      );
      return;
    }

    const address1 = pickName(region, i18n.language);
    const address2 = pickName(district, i18n.language);
    const address3 = pickName(village, i18n.language);

    const mutate = isClient
      ? saveClientAddress
      : isLegal
      ? saveLegalAddress
      : isInvestor
      ? saveInvestorAddress
      : null;
    if (!mutate) return;

    mutate(
      { address1, address2, address3 },
      {
        onSuccess: async () => {
          setAddrSaved("ok");
          setSaveMsg(t("profile.address.saved") || "Адрес сохранён");
          setIsEditingAddress(false);

          // 🔄 Жёстко обновляем кэш:
          await Promise.allSettled([
            qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
            qc.invalidateQueries({
              queryKey: isClient
                ? CLIENT_ME_QUERY_KEY
                : isLegal
                ? LEGAL_ME_QUERY_KEY
                : isInvestor
                ? INVESTOR_ME_QUERY_KEY
                : USER_QUERY_KEY,
            }),
          ]);

          // убираем всплывашку через 2.5с
          setTimeout(() => setSaveMsg(null), 2500);
        },
        onError: (e: any) => {
          setAddrSaved("err");
          alert(
            e?.message ||
              (t("profile.address.saveFailed") as string) ||
              "Не удалось сохранить адрес"
          );
        },
      }
    );
  };

  const currentAddressText = useMemo(() => {
    const parts = [
      activeProfile?.address1?.trim(),
      activeProfile?.address2?.trim(),
      activeProfile?.address3?.trim(),
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  }, [
    activeProfile?.address1,
    activeProfile?.address2,
    activeProfile?.address3,
  ]);

  const currentAddressDate = useMemo(() => {
    return safeFormatDate(activeProfile?.updatedAt || activeProfile?.createdAt);
  }, [activeProfile?.updatedAt, activeProfile?.createdAt]);

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("pb_auth");
      sessionStorage.removeItem("pb_auth");

      // если есть другие auth-ключи — можно добавить тут
      // localStorage.removeItem("token");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Wrap>
      <div style={{ padding: 16 }}>
        <TopBar>
          <Crumb>
            {t("profile.breadcrumbs")} / <span>{t("profile.title")}</span>
          </Crumb>
          <LangSwitcher />
        </TopBar>

        <Card>
          <CardBody>
            <AvatarWrap>
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
                  <NameRow>
                    <span>
                      {(data?.name || "—") + " " + (data?.surname || "")}
                    </span>
                  </NameRow>
                )}
              </Name>

              <Subline>
                {isLoading ? (
                  <SkeletonLine w={160} />
                ) : data?.createdAt ? (
                  dayjs(data.createdAt).isValid() ? (
                    dayjs(data.createdAt)
                      .locale(i18n.language)
                      .format("DD.MM.YYYY HH:mm")
                  ) : (
                    "—"
                  )
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

                {isLegal && legalMe?.name ? (
                  <CompanyBadge title={legalMe.name}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="#0070ff"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      focusable="false"
                      className="magritte-icon___rRr4Q_12-3-5 magritte-icon_initial-accent___E3b-y_12-3-5"
                    >
                      <g>
                        <g>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.29443 14.8729C6.76051 15.4025 7.28287 15.996 7.998 15.996V15.988C8.72144 15.988 9.24393 15.394 9.70211 14.8643C9.9754 14.5433 10.2728 14.2062 10.53 14.1019C10.7973 13.9875 11.217 14.0107 11.6374 14.0339C11.6594 14.0352 11.6815 14.0364 11.7036 14.0376L11.7306 14.0391C12.4376 14.0788 13.1647 14.1197 13.6488 13.6363C14.1254 13.1605 14.084 12.4261 14.0442 11.7196L14.0427 11.694C14.0416 11.6747 14.0406 11.6553 14.0395 11.6358C14.016 11.2201 13.9918 10.7905 14.107 10.5222C14.2196 10.2653 14.5491 9.97647 14.8707 9.69555L14.8885 9.67992C15.4144 9.21853 15.996 8.7083 15.996 7.99403C15.996 7.27169 15.4012 6.75 14.8707 6.29251C14.5491 6.01962 14.2115 5.72263 14.107 5.4658C13.9925 5.19902 14.0158 4.78025 14.039 4.36068C14.0403 4.33846 14.0415 4.31623 14.0427 4.29403C14.091 3.57971 14.1392 2.84127 13.6488 2.35168C13.1722 1.86785 12.4365 1.90919 11.7288 1.94896L11.7036 1.95038C11.6841 1.95146 11.6646 1.95256 11.645 1.95366C11.2287 1.97704 10.7987 2.00119 10.53 1.8862C10.2728 1.77384 9.98344 1.44471 9.70211 1.12367L9.68644 1.10586C9.22435 0.580731 8.71334 0 7.998 0C7.27456 0 6.75208 0.593949 6.29391 1.12367C6.02061 1.44471 5.7232 1.78187 5.46597 1.8862C5.19885 2.00052 4.77953 1.97731 4.35942 1.95407C4.33707 1.95283 4.31472 1.95159 4.29239 1.95038C4.2834 1.94987 4.27439 1.94937 4.26539 1.94886C3.55843 1.90912 2.83131 1.86825 2.34715 2.35168C1.87101 2.83503 1.91194 3.5609 1.95173 4.26668C1.95225 4.2758 1.95276 4.28491 1.95328 4.29403C1.95443 4.31508 1.95559 4.33618 1.95676 4.35729C1.98011 4.7787 2.0038 5.20632 1.88898 5.47383C1.77645 5.73067 1.44687 6.01963 1.12534 6.30054L1.10753 6.31617C0.581598 6.77756 0 7.28779 0 8.00207C0 8.72441 0.594821 9.2461 1.12534 9.70359C1.44687 9.97648 1.78448 10.2734 1.88898 10.5302C2.00348 10.797 1.98024 11.2158 1.95696 11.6354C1.95572 11.6576 1.95449 11.6799 1.95328 11.7021C1.90505 12.4164 1.85682 13.1547 2.34715 13.6443C2.82377 14.1282 3.55945 14.0868 4.26715 14.047L4.29239 14.0456C4.31163 14.0446 4.33092 14.0435 4.35023 14.0424C4.76672 14.019 5.19711 13.9948 5.46597 14.1099C5.7232 14.2223 6.01309 14.5519 6.29443 14.8729ZM11.9872 5.99862L10.9972 5.00867L6.99825 9.00767L4.99875 7.00817L4.0088 7.99812L6.99825 10.9876L11.9872 5.99862Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </g>
                    </svg>
                    {legalMe.name}
                  </CompanyBadge>
                ) : null}
                {/* <Badge tone="muted">{t("profile.visibility.public")}</Badge> */}
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
                  <EditBtn type="button" disabled={uploading}>
                    {t("profile.settings")}
                  </EditBtn>
                </NavLink>

                <LogoutBtn type="button" onClick={handleLogout}>
                  {t("common.logout") || "Выйти"}
                </LogoutBtn>
              </Actions>

              {(avatarLoading || uploading) && (
                <Subline>
                  {uploading
                    ? t("profile.uploading") || "Отправляем файл..."
                    : t("profile.loadingAvatar") || "Загружаем аватар..."}
                </Subline>
              )}
              {avatarError && avatarUrl == null && null}
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
      </div>

      {(isClient || isLegal || isInvestor) && (
        <AddressCard>
          <AddressHeader>
            <div style={{ display: "grid", gap: 2 }}>
              <AddressTitle>
                {t("profile.address.title") || "Адрес"}
              </AddressTitle>
              {!isEditingAddress && (
                <AddressHint>
                  {currentAddressText === "—"
                    ? (t("profile.address.addHint") as string) ||
                      "Добавьте ваш адрес, чтобы соискатели видели локацию"
                    : (t("profile.address.editHint") as string) ||
                      "Обновите адрес при переезде или смене офиса"}
                </AddressHint>
              )}
            </div>

            {!isEditingAddress && (
              <EditBtn onClick={openAddressEditor}>
                {currentAddressText === "—"
                  ? (t("profile.address.add") as string) || "Добавить"
                  : (t("profile.edit") as string) || "Изменить"}
              </EditBtn>
            )}
          </AddressHeader>

          {!isEditingAddress ? (
            <>
              <AddressLine>{currentAddressText}</AddressLine>
              <AddressSub>{saveMsg ? saveMsg : currentAddressDate}</AddressSub>
            </>
          ) : (
            <>
              <AddressDivider />

              {/* Сетка селектов */}
              <SelectRow>
                <CustomSelect
                  id="region"
                  options={regionOptions}
                  value={regionId ?? null}
                  onChange={onRegionChange}
                  placeholder={t("profile.address.selectRegion") as string}
                  disabled={false}
                  loading={regionsLoading}
                  menuMaxHeight={300}
                />
                <CustomSelect
                  id="district"
                  options={districtOptions}
                  value={districtId ?? null}
                  onChange={onDistrictChange}
                  placeholder={t("profile.address.selectDistrict") as string}
                  disabled={!regionId}
                  loading={districtsLoading}
                  menuMaxHeight={300}
                />
                <CustomSelect
                  id="village"
                  options={villageOptions}
                  value={villageId ?? null}
                  onChange={onVillageChange}
                  placeholder={t("profile.address.selectVillage") as string}
                  disabled={!districtId}
                  loading={villagesLoading}
                  menuMaxHeight={300}
                />
              </SelectRow>

              <ActionsRow>
                <EditBtn onClick={cancelAddressEditor}>
                  {t("common1.cancel") || "Отмена"}
                </EditBtn>
                <PrimaryBtn
                  type="button"
                  onClick={submitAddress}
                  disabled={
                    savingAddress ||
                    !regionId ||
                    !districtId ||
                    !villageId ||
                    regionsLoading ||
                    districtsLoading ||
                    villagesLoading
                  }
                  style={{ borderRadius: 10, padding: "10px 16px" }}
                >
                  {savingAddress
                    ? (t("profile.address.saving") as string) || "Сохраняем…"
                    : (t("profile.address.save") as string) || "Сохранить"}
                </PrimaryBtn>
              </ActionsRow>
            </>
          )}
        </AddressCard>
      )}

      {data?.role === "WORKER" && <ProProfileSection role="WORKER" />}
      {data?.role === "LEGAL" && <ProProfileSection role="LEGAL" />}
      {data?.role === "CLIENT" && <ProProfileSection role="CLIENT" />}
      {data?.role === "INVESTOR" && <ProProfileSection role="INVESTOR" />}
      <div style={{ padding: 16 }}>
        {/* <SectionTitle>{t("profile.otherContacts")}</SectionTitle>
        <AddLink href="#">{t("profile.add")}</AddLink>

        <SectionTitle style={{ marginTop: 28 }}>
          {t("profile.searchSettings")}
        </SectionTitle> */}
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={data}
      />
    </Wrap>
  );
}
