// src/features/profile/pages/ProfilePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz";
import { Camera, Settings, LogOut, User, Users, CircleUser, Phone, Mail, Briefcase, IdCard } from "lucide-react";

import {
  Notice,
  SkeletonLine,
  ProfilePageWrap,
  ProfileShell,
  ProfileTopRow,
  ProfilePageTitle,
  ProfileLayout,
  ProfileMain,
  ProfileCard,
  ProfileHero,
  ProfileHeroTop,
  ProfileAvatarWrap,
  ProfileAvatar,
  ProfileAvatarPlaceholder,
  ProfileHeroContent,
  ProfileHeroHead,
  ProfileHeroIdentity,
  ProfileName,
  ProfileSubtitle,
  ProfileHeroToolbar,
  ProfileHeroDivider,
  ProfileHeroMeta,
  ProfileHeroMetaItem,
  ProfileHeroHint,
  ProfileHeroBtn,
  ProfileHeroOutlineBtn,
  ProfileHeroLogoutBtn,
  ProfileCardHead,
  ProfileCardTitle,
  ProfileCardSubtitle,
  ProfileCardActions,
  ProfileCardBody,
  ProfileFormGrid,
  ProfileField,
  ProfileFieldLabel,
  ProfileFieldIcon,
  ProfileFieldValue,
  ProfileSectionIcon,
  ProfileCardTitleRow,
  ProfileOutlineBtn,
  ProfilePrimaryBtn,
  ProfileAddressLine,
  ProfileAddressSub,
  ProfileSelectRow,
  ProfileActionsRow,
  ProfileTabs,
  ProfileTabList,
  ProfileTab,
  ProfileTabPanel,
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
import { useUpdateInvestorAddress } from "../../../shared/endpoints/investor";
import { ANON_AVATAR, onAvatarError } from "../../../shared/lib/avatar";

const onProfileAvatarError = onAvatarError;

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

type ProfileTabId = "general" | "pro";

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
  } = useAvatar();
  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("general");
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
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const fullName = useMemo(() => {
    if (isLoading) return "";
    return [data?.surname, data?.name, data?.middleName].filter(Boolean).join(" ") || "—";
  }, [isLoading, data?.surname, data?.name, data?.middleName]);

  const memberSince = useMemo(() => {
    if (!data?.createdAt) return "—";
    const d = dayjs(data.createdAt);
    return d.isValid()
      ? d.locale(i18n.language).format("DD.MM.YYYY")
      : "—";
  }, [data?.createdAt, i18n.language]);

  const avatarSrc = avatarUrl || ANON_AVATAR;
  const roleLabel = data?.role ? t(`profile.roles.${data.role}`) : "—";

  const subtitle = useMemo(() => {
    if (isLoading) return "";
    const parts = [roleLabel];
    if (isLegal && legalMe?.name) parts.push(legalMe.name);
    return parts.filter(Boolean).join(" · ");
  }, [isLoading, roleLabel, isLegal, legalMe?.name]);

  const proRole = data?.role as "WORKER" | "LEGAL" | "CLIENT" | "INVESTOR" | undefined;
  const hasProProfile =
    proRole === "WORKER" ||
    proRole === "LEGAL" ||
    proRole === "CLIENT" ||
    proRole === "INVESTOR";

  const proTabLabel = useMemo(() => {
    switch (proRole) {
      case "WORKER":
        return t("profile.tabWorker");
      case "LEGAL":
        return t("profile.tabLegal");
      case "CLIENT":
        return t("profile.tabClient");
      case "INVESTOR":
        return t("profile.tabInvestor");
      default:
        return t("profile.tabWorker");
    }
  }, [proRole, t]);

  return (
    <ProfilePageWrap>
      <ProfileShell>
        <ProfileTopRow>
          <ProfilePageTitle>{t("profile.title")}</ProfilePageTitle>
          <LangSwitcher />
        </ProfileTopRow>

        {isError && (
          <Notice tone="error">
            {(error as any)?.message || t("profile.loadFailed")}
          </Notice>
        )}

        <ProfileLayout>
          <ProfileMain>
            <ProfileCard>
              <ProfileHero>
                <ProfileHeroTop>
                  <ProfileAvatarWrap>
                    {avatarUrl ? (
                      <ProfileAvatar
                        src={avatarSrc}
                        alt=""
                        onClick={onPick}
                        onError={onProfileAvatarError}
                      />
                    ) : (
                      <ProfileAvatarPlaceholder
                        role="button"
                        aria-label="avatar"
                        onClick={onPick}
                      />
                    )}
                  </ProfileAvatarWrap>

                  <ProfileHeroContent>
                    <ProfileHeroHead>
                      <ProfileHeroIdentity>
                        <ProfileName>
                          {isLoading ? <SkeletonLine w={220} /> : fullName}
                        </ProfileName>
                        {!isLoading && subtitle && (
                          <ProfileSubtitle>{subtitle}</ProfileSubtitle>
                        )}
                      </ProfileHeroIdentity>

                      <ProfileHeroToolbar>
                        <ProfileHeroBtn
                          type="button"
                          onClick={onPick}
                          disabled={uploading}
                        >
                          <Camera size={15} />
                          {uploading
                            ? t("profile.uploading")
                            : t("profile.uploadAvatar")}
                        </ProfileHeroBtn>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                          style={{ display: "none" }}
                        />
                        <NavLink
                          to="/app/settings"
                          style={{ textDecoration: "none" }}
                        >
                          <ProfileHeroOutlineBtn type="button">
                            <Settings size={15} />
                            {t("profile.settings")}
                          </ProfileHeroOutlineBtn>
                        </NavLink>
                        <ProfileHeroLogoutBtn type="button" onClick={handleLogout}>
                          <LogOut size={15} />
                          {t("common.logout") || "Выйти"}
                        </ProfileHeroLogoutBtn>
                      </ProfileHeroToolbar>
                    </ProfileHeroHead>

                    {(avatarLoading || uploading) && (
                      <ProfileHeroHint>
                        {uploading
                          ? t("profile.uploading")
                          : t("profile.loadingAvatar")}
                      </ProfileHeroHint>
                    )}
                  </ProfileHeroContent>
                </ProfileHeroTop>

                <ProfileHeroDivider />

                <ProfileHeroMeta>
                  <ProfileHeroMetaItem>
                    <span className="label">{t("profile.phone")}</span>
                    <span className="value">
                      {isLoading ? <SkeletonLine w={120} /> : phonePretty}
                    </span>
                  </ProfileHeroMetaItem>
                  <ProfileHeroMetaItem>
                    <span className="label">{t("profile.email")}</span>
                    <span className="value">
                      {isLoading ? <SkeletonLine w={200} /> : data?.email || "—"}
                    </span>
                  </ProfileHeroMetaItem>
                  <ProfileHeroMetaItem>
                    <span className="label">
                      {t("profile.registrationDate", "Дата регистрации")}
                    </span>
                    <span className="value">
                      {isLoading ? <SkeletonLine w={100} /> : memberSince}
                    </span>
                  </ProfileHeroMetaItem>
                </ProfileHeroMeta>
              </ProfileHero>
            </ProfileCard>

            {hasProProfile && (
              <ProfileTabs>
                <ProfileTabList role="tablist" aria-label={t("profile.title")}>
                  <ProfileTab
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "general"}
                    $active={activeTab === "general"}
                    onClick={() => setActiveTab("general")}
                  >
                    {t("profile.tabGeneral")}
                  </ProfileTab>
                  <ProfileTab
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "pro"}
                    $active={activeTab === "pro"}
                    onClick={() => setActiveTab("pro")}
                  >
                    {proTabLabel}
                  </ProfileTab>
                </ProfileTabList>
              </ProfileTabs>
            )}

            {(!hasProProfile || activeTab === "general") && (
              <ProfileTabPanel>
            <ProfileCard>
              <ProfileCardHead>
                <ProfileCardTitleRow>
                  <ProfileSectionIcon aria-hidden>
                    <IdCard />
                  </ProfileSectionIcon>
                  <div>
                    <ProfileCardTitle>
                      {t("profile.personalInfo", "Личная информация")}
                    </ProfileCardTitle>
                    <ProfileCardSubtitle>
                      {t("profile.personalInfoHint", "Основные данные профиля")}
                    </ProfileCardSubtitle>
                  </div>
                </ProfileCardTitleRow>
              </ProfileCardHead>
              <ProfileCardBody>
                <ProfileFormGrid>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <User />
                      </ProfileFieldIcon>
                      {t("profile.firstName", "Имя")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? <SkeletonLine w={120} /> : data?.name || "—"}
                    </ProfileFieldValue>
                  </ProfileField>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <Users />
                      </ProfileFieldIcon>
                      {t("profile.lastName", "Фамилия")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? <SkeletonLine w={120} /> : data?.surname || "—"}
                    </ProfileFieldValue>
                  </ProfileField>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <CircleUser />
                      </ProfileFieldIcon>
                      {t("profile.middleName", "Отчество")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? (
                        <SkeletonLine w={120} />
                      ) : (
                        data?.middleName || "—"
                      )}
                    </ProfileFieldValue>
                  </ProfileField>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <Phone />
                      </ProfileFieldIcon>
                      {t("profile.phone")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? <SkeletonLine w={140} /> : phonePretty}
                    </ProfileFieldValue>
                  </ProfileField>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <Mail />
                      </ProfileFieldIcon>
                      {t("profile.email")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? <SkeletonLine w={180} /> : data?.email || "—"}
                    </ProfileFieldValue>
                  </ProfileField>
                  <ProfileField>
                    <ProfileFieldLabel>
                      <ProfileFieldIcon aria-hidden>
                        <Briefcase />
                      </ProfileFieldIcon>
                      {t("profile.accountRole", "Роль")}
                    </ProfileFieldLabel>
                    <ProfileFieldValue>
                      {isLoading ? <SkeletonLine w={100} /> : roleLabel}
                    </ProfileFieldValue>
                  </ProfileField>
                </ProfileFormGrid>
              </ProfileCardBody>
            </ProfileCard>

            {(isClient || isLegal || isInvestor) && (
              <ProfileCard>
                <ProfileCardHead>
                  <div>
                    <ProfileCardTitle>
                      {t("profile.address.title")}
                    </ProfileCardTitle>
                    {!isEditingAddress && (
                      <ProfileCardSubtitle>
                        {currentAddressText === "—"
                          ? t("profile.address.addHint")
                          : t("profile.address.editHint")}
                      </ProfileCardSubtitle>
                    )}
                  </div>
                  {!isEditingAddress && (
                    <ProfileCardActions>
                      <ProfileOutlineBtn type="button" onClick={openAddressEditor}>
                        {currentAddressText === "—"
                          ? t("profile.address.add")
                          : t("profile.edit")}
                      </ProfileOutlineBtn>
                    </ProfileCardActions>
                  )}
                </ProfileCardHead>

                {!isEditingAddress ? (
                  <ProfileCardBody>
                    <ProfileAddressLine>{currentAddressText}</ProfileAddressLine>
                    <ProfileAddressSub>
                      {saveMsg ? saveMsg : currentAddressDate}
                    </ProfileAddressSub>
                  </ProfileCardBody>
                ) : (
                  <ProfileCardBody>
                    <ProfileSelectRow>
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
                    </ProfileSelectRow>

                    <ProfileActionsRow>
                      <ProfileOutlineBtn type="button" onClick={cancelAddressEditor}>
                        {t("common1.cancel") || "Отмена"}
                      </ProfileOutlineBtn>
                      <ProfilePrimaryBtn
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
                      >
                        {savingAddress
                          ? t("profile.address.saving")
                          : t("profile.address.save")}
                      </ProfilePrimaryBtn>
                    </ProfileActionsRow>
                  </ProfileCardBody>
                )}
              </ProfileCard>
            )}

              </ProfileTabPanel>
            )}

            {hasProProfile && activeTab === "pro" && proRole && (
              <ProfileTabPanel>
                <ProProfileSection embedded role={proRole} />
              </ProfileTabPanel>
            )}

          </ProfileMain>
        </ProfileLayout>
      </ProfileShell>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={data}
      />
    </ProfilePageWrap>
  );
}
