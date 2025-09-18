// pages/settings/SettingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";

import {
  PageWrap,
  Title,
  Tabs,
  TabBtn,
  Section,
  Actions,
  PrimaryBtn,
  GhostBtn,
  Card,
  Row,
} from "../settings.style";

import { useMe } from "../../../shared/modules/user";
import { CustomInput } from "../../../components/custom-input";
import { useUpdateUser } from "../../../shared/modules/useUpdateUser";
import { Modal, ModalFooter } from "../../../components/modal/Modal";
import { userApi } from "../../../shared/endpoints/user";

/* ===== utils: аккуратно достать текст ошибки из ответа бэка ===== */
function getApiMessage(err: any, fallback: string): string {
  if (isAxiosError(err) && err.response?.data) {
    const data: any = err.response.data;
    const m = data?.message ?? data?.error ?? data;
    if (typeof m === "string") return m;
    if (m && typeof m === "object") {
      // пробуем ru -> uz -> первое строковое значение
      const first =
        m.ru ?? m.uz ?? Object.values(m).find((v) => typeof v === "string");
      if (typeof first === "string") return first;
    }
  }
  if (typeof err?.message === "string") return err.message;
  return fallback;
}

type TabsKeys = "profile" | "blocked" | "images" | "notify" | "apps";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabsKeys>("profile");
  const { data: me } = useMe();

  const [editingPassword, setEditingPassword] = useState(false);
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);

  const phoneHuman = useMemo(() => {
    const d = (me?.phone || "").replace(/\D/g, "");
    if (d.length !== 12) return me?.phone || "—";
    return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)}-${d.slice(
      8,
      10
    )}-${d.slice(10)}`;
  }, [me?.phone]);

  const passwordUpdatedText = useMemo(() => {
    if (!me?.updatedAt) return "—";
    const mins = Math.max(
      1,
      Math.round((Date.now() - new Date(me.updatedAt).getTime()) / 60000)
    );
    return t("settings.password.updatedAgo", { mins });
  }, [me?.updatedAt, t]);

  return (
    <PageWrap>
      <Title>{t("settings.title")}</Title>

      <Tabs>
        <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>
          {t("settings.tabs.profile")}
        </TabBtn>
        <TabBtn active={tab === "blocked"} onClick={() => setTab("blocked")}>
          {t("settings.tabs.blocked")}
        </TabBtn>
        <TabBtn active={tab === "images"} onClick={() => setTab("images")}>
          {t("settings.tabs.images")}
        </TabBtn>
        <TabBtn active={tab === "notify"} onClick={() => setTab("notify")}>
          {t("settings.tabs.notify")}
        </TabBtn>
        <TabBtn active={tab === "apps"} onClick={() => setTab("apps")}>
          {t("settings.tabs.apps")}
        </TabBtn>
      </Tabs>

      {tab === "profile" && (
        <>
          {!editingPassword ? (
            <Card>
              <Row>
                <div className="label">{t("settings.password.title")}</div>
                <div className="value">{passwordUpdatedText}</div>
                <button
                  className="action"
                  onClick={() => setEditingPassword(true)}
                >
                  {t("common.change")}
                </button>
              </Row>
              <Row>
                <div className="label">{t("settings.phone.title")}</div>
                <div className="value">{phoneHuman}</div>
                <button
                  className="action"
                  onClick={() => setEditPhoneOpen(true)}
                >
                  {t("common.change")}
                </button>
              </Row>
            </Card>
          ) : (
            <>
              <PasswordInlineForm
                onCancel={() => setEditingPassword(false)}
                onDone={() => setEditingPassword(false)}
              />
              <Card>
                <Row>
                  <div className="label">{t("settings.phone.title")}</div>
                  <div className="value">{phoneHuman}</div>
                  <button
                    className="action"
                    onClick={() => setEditPhoneOpen(true)}
                  >
                    {t("common.change")}
                  </button>
                </Row>
              </Card>
            </>
          )}

          <EditPhoneModal
            open={editPhoneOpen}
            onClose={() => setEditPhoneOpen(false)}
            defaultPhone={(me?.phone || "").replace(/\D/g, "")}
          />
        </>
      )}
    </PageWrap>
  );
}

/* ===== Inline-форма смены пароля ===== */
function PasswordInlineForm({
  onCancel,
  onDone,
}: {
  onCancel: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, reset } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirm: string;
  }>({ defaultValues: { oldPassword: "", newPassword: "", confirm: "" } });

  const newPwd = watch("newPassword");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (v: {
    oldPassword: string;
    newPassword: string;
    confirm: string;
  }) => {
    setErr(null);
    if (v.newPassword !== v.confirm) {
      setErr(t("settings.password.errors.mismatch"));
      return;
    }
    try {
      setLoading(true);
      await userApi.updatePassword(v.oldPassword, v.newPassword); // PUT /user/update-password
      reset();
      onDone();
    } catch (e: any) {
      const msg = getApiMessage(e, t("settings.password.errors.generic"));
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          control={control}
          name="oldPassword"
          label={t("settings.password.old")}
          type="password"
          rules={{ required: t("validation.required") as string }}
        />
        <CustomInput
          control={control}
          name="newPassword"
          label={t("settings.password.new")}
          type="password"
          rules={{
            required: t("validation.required") as string,
            minLength: { value: 6, message: t("validation.min6") as string },
          }}
        />
        <CustomInput
          control={control}
          name="confirm"
          label={t("settings.password.confirm")}
          type="password"
          rules={{
            required: t("validation.required") as string,
            validate: (v: string) =>
              v === newPwd ||
              (t("settings.password.errors.mismatch") as string),
          }}
        />

        {err ? (
          <div style={{ color: "#b91c1c", marginTop: 6 }}>{err}</div>
        ) : null}

        <Actions>
          <PrimaryBtn type="submit" disabled={loading}>
            {loading ? t("common.saving") : t("common.save")}
          </PrimaryBtn>
          <GhostBtn type="button" onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </GhostBtn>
        </Actions>
      </form>
    </Section>
  );
}

/* ===== Модалка изменения телефона ===== */
function EditPhoneModal({
  open,
  onClose,
  defaultPhone,
}: {
  open: boolean;
  onClose: () => void;
  defaultPhone: string;
}) {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useUpdateUser();
  const { control, handleSubmit, reset } = useForm<{ phone: string }>({
    defaultValues: { phone: defaultPhone || "" },
  });

  useEffect(() => {
    if (open) reset({ phone: defaultPhone || "" });
  }, [open, defaultPhone, reset]);

  const onSubmit = (v: { phone: string }) => {
    mutate(
      { phone: (v.phone || "").replace(/\D/g, "") },
      { onSuccess: onClose }
    );
  };

  // нормализуем возможный объект ошибки на случай похожего формата
  const phoneErrorText =
    error && typeof (error as any)?.message === "object"
      ? getApiMessage(error, t("settings.phone.errors.generic"))
      : (error as any)?.message || "";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("settings.phone.changeTitle")}
      width={520}
      closeOnOverlay
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          control={control}
          name="phone"
          type="phone"
          label={t("settings.phone.new")}
          placeholder="+998 (__) ___-__-__"
          rules={{
            required: t("validation.required") as string,
            validate: (v: string) =>
              /^\d{12}$/.test((v || "").replace(/\D/g, "")) ||
              (t("validation.phoneFull") as string),
          }}
        />
        <ModalFooter>
          <GhostBtn type="button" onClick={onClose} disabled={isPending}>
            {t("common.cancel")}
          </GhostBtn>
          <PrimaryBtn as="button" type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : t("common.save")}
          </PrimaryBtn>
        </ModalFooter>
        {error ? (
          <div style={{ color: "#b91c1c", marginTop: 8 }}>
            {phoneErrorText || t("settings.phone.errors.generic")}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
