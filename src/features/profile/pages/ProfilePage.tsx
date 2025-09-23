// src/features/profile/pages/ProfilePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "../profile-style";

import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import EditProfileModal from "./components/EditProfileModal";

import { useMe } from "../../../shared/modules/user";
import { useAvatar, useUploadAvatar } from "../../../shared/modules/avatar";

// Локации + имя по языку
import {
  useRegions,
  useDistricts,
  useVillages,
} from "../../../shared/modules/location";
import { pickName } from "../../../shared/endpoints/location";

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

/* — компактная сетка под селекты — */
const SelectRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

/* — аккуратная карточка адреса — */
const AddressCard = styled.section`
  border: 1px solid #e7ecf3;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
`;

const AddressHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const AddressTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const LinkBtn = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: #1e5cfb;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
  transition: opacity 0.15s ease, transform 0.06s ease;
  &:hover {
    opacity: 0.85;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const AddressLine = styled.div`
  color: #0f172a;
  font-weight: 600;
  min-height: 20px;
`;

const AddressSub = styled.div`
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
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
    return d.isValid() ? d.locale(i18n.language).format("DD.MM.YYYY HH:mm") : "—";
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
  useEffect(() => {
    if (!isEditingAddress) return;
    if (!isClient) return;
    if (!clientMe) return;
    if (!regions) return;
    if (hydrateStage !== 0) return;

    const r = findByAnyName(regions, clientMe.address1);
    if (r) {
      setRegionId(r.id);
      setHydrateStage(1);
    } else {
      setHydrateStage(3);
    }
  }, [isEditingAddress, isClient, clientMe, regions, hydrateStage]);

  useEffect(() => {
    if (!isEditingAddress) return;
    if (hydrateStage !== 1) return;
    if (!regionId) return;
    if (!districts) return;

    const d = findByAnyName(districts, clientMe?.address2 || undefined);
    if (d) {
      setDistrictId(d.id);
      setHydrateStage(2);
    } else {
      setHydrateStage(3);
    }
  }, [isEditingAddress, hydrateStage, regionId, districts, clientMe?.address2]);

  useEffect(() => {
    if (!isEditingAddress) return;
    if (hydrateStage !== 2) return;
    if (!districtId) return;
    if (!villages) return;

    const v = findByAnyName(villages, clientMe?.address3 || undefined);
    if (v) setVillageId(v.id);
    setHydrateStage(3);
  }, [
    isEditingAddress,
    hydrateStage,
    districtId,
    villages,
    clientMe?.address3,
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

  // Сохранение
  const { mutate: saveAddress, isPending: savingAddress } =
    useUpdateClientAddress();
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

    saveAddress(
      { address1, address2, address3 },
      {
        onSuccess: () => {
          setAddrSaved("ok");
          setSaveMsg(t("profile.address.saved") || "Адрес сохранён");
          setIsEditingAddress(false);
          // через 2.5 сек убираем сообщение
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
      clientMe?.address1?.trim(),
      clientMe?.address2?.trim(),
      clientMe?.address3?.trim(),
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  }, [clientMe?.address1, clientMe?.address2, clientMe?.address3]);

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
  ) : data?.createdAt ? (
    dayjs(data.createdAt).isValid()
      ? dayjs(data.createdAt).locale(i18n.language).format("DD.MM.YYYY HH:mm")
      : "—"
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

      {/* Адрес — только для CLIENT */}
      {isClient && (
        <>
          <AddressCard>
            <AddressHeader>
              <AddressTitle>
                {t("profile.address.title") || "Адрес"}
              </AddressTitle>
              {!isEditingAddress && (
                <LinkBtn onClick={openAddressEditor}>
                  {currentAddressText === "—"
                    ? (t("profile.address.add") as string) || "Добавить"
                    : (t("profile.edit") as string) || "Изменить"}
                </LinkBtn>
              )}
            </AddressHeader>

            {!isEditingAddress ? (
              <>
                <AddressLine>{currentAddressText}</AddressLine>
                <AddressSub>
  {saveMsg
    ? saveMsg
    : clientMe
    ? safeFormatDate(clientMe.updatedAt || clientMe.createdAt)
    : ""}
</AddressSub>
              </>
            ) : (
              <>
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

                <Row>
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
                  >
                    {savingAddress
                      ? (t("profile.address.saving") as string) || "Сохраняем…"
                      : (t("profile.address.save") as string) || "Сохранить"}
                  </PrimaryBtn>
                  <LinkBtn onClick={cancelAddressEditor}>
                    {t("cancel") || "Отмена"}
                  </LinkBtn>
                </Row>
              </>
            )}
          </AddressCard>
        </>
      )}

{data?.role === "WORKER" && <ProProfileSection role="WORKER" />}
{data?.role === "LEGAL"  && <ProProfileSection role="LEGAL" />}
{data?.role === "CLIENT" && <ProProfileSection role="CLIENT" />}

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
