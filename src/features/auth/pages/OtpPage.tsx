// pages/auth/register/RegisterPage.tsx
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import styled from "@emotion/styled";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaUserTie, FaUser } from "react-icons/fa6";
import { PiCheckBold } from "react-icons/pi";

import { CustomInput } from "../../../components/custom-input";
import { CustomButton } from "../../../components/custom-button";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import { useRegister } from "../../../shared/modules/auth";

import {
  PageWrap,
  LeftSide,
  Brand,
  Welcome,
  Subtitle,
  RightSide,
  Card,
  CardTitle,
  TopHint,
  LinksRow,
  LinkA,
  AgreementText,
  AgreementA,
} from "../login-style";
import { DatePopoverInput } from "../../../components/custom-date-input/DatePopoverInput";
import dayjs from "dayjs";

/* ---------- типы формы ---------- */
type FormValues = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "CLIENT" | "WORKER" | "";
  clientKind?: "PERSON" | "LEGAL";
  gender: "MALE" | "FEMALE";
  birthday: string;
};

/* ---------- стили выбора роли (карточки) ---------- */
const RoleWrap = styled.div`
  display: grid;
  gap: 8px;
  margin: 6px 0 4px;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  color: #374151;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const RoleCard = styled.label<{ active?: boolean; hasError?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: center;
  /* место под галочку справа */
  padding: 12px 44px 12px 12px;

  /* при active — прозрачная граница, ободок рисуем через background */
  border: 1px solid
    ${({ active, hasError }) =>
      hasError ? "#ef4444" : active ? "transparent" : "rgba(15,18,25,.12)"};
  border-radius: 12px;

  /* красивый активный ободок */
  background: ${({ active }) =>
    active
      ? "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg, #7aa2ff, #1E5CFB) border-box"
      : "#fff"};

  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.06s,
    background 0.2s;

  /* тень при активной карточке */
  box-shadow: ${({ active }) =>
    active
      ? "0 8px 24px rgba(30,92,251,0.12)"
      : "0 8px 22px rgba(2,32,71,0.06)"};

  &:hover {
    border-color: ${({ hasError, active }) =>
      hasError ? "#ef4444" : active ? "transparent" : "#94b2ff"};
    box-shadow: ${({ active }) =>
      active
        ? "0 10px 26px rgba(30,92,251,0.16)"
        : "0 10px 22px rgba(2, 32, 71, 0.08)"};
  }
  &:active {
    transform: translateY(1px);
  }

  &:has(input[type="radio"]:focus-visible) {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(30, 92, 251, 0.2),
      0 8px 24px rgba(30, 92, 251, 0.14);
  }
`;

const HiddenRadioMain = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const RoleIconBox = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  display: grid;
  place-items: center;

  svg {
    font-size: 22px;
    color: #1e5cfb;
  }
`;

const RoleText = styled.div`
  display: grid;
  gap: 2px;
`;

const RoleTitle = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

const RoleDesc = styled.div`
  font-size: 13px;
  color: #667085;
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  font-size: 13px;
  margin-top: 4px;
`;

/* синяя галочка в правом верхнем углу карточки */
const RoleTick = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #1e5cfb;
  color: #fff;
  box-shadow: 0 6px 16px rgba(30, 92, 251, 0.3);
`;

/* ——— компактный сегмент «Юр / Физ» (CLIENT) ——— */
const MiniSegWrap = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 6px;

  @media (max-width: 520px) {
    padding-left: 0;
  }
`;

const MiniSegLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
`;

const MiniSegGroup = styled.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MiniSegOption = styled.label<{ active?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${({ active }) => (active ? "#1E5CFB" : "#E5E7EB")};
  background: ${({ active }) => (active ? "#EEF2FF" : "#fff")};
  color: ${({ active }) => (active ? "#1E5CFB" : "#334155")};
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease,
    transform 0.06s ease;

  &:hover {
    border-color: ${({ active }) => (active ? "#1E5CFB" : "#CBD5E1")};
  }
  &:active {
    transform: translateY(1px);
  }

  &:has(input[type="radio"]:focus-visible) {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(30, 92, 251, 0.2);
  }
`;

const MiniHiddenRadio = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
`;

/* ---------- компонент ---------- */
const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useRegister();

  const { control, handleSubmit, setError, watch } = useForm<FormValues>({
    defaultValues: {
      name: "",
      surname: "",
      middleName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      clientKind: "PERSON",
      gender: "MALE",
      birthday: "",
    },
    mode: "onChange",
  });

  const pwd = watch("password");

  const onSubmit = async (values: FormValues) => {
    const rawPhone = values.phone.replace(/\D/g, "");

    if (rawPhone.length !== 12) {
      setError("phone", { message: t("phoneInvalid") });
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", { message: t("passwordsNotMatch") });
      return;
    }
    if (!values.role) {
      setError("role", { message: t("roleRequired") });
      return;
    }

    // Итоговая роль:
    // CLIENT -> (PERSON => CLIENT, LEGAL => LEGAL)
    // WORKER -> WORKER
    let roleToSend: "CLIENT" | "LEGAL" | "WORKER";
    if (values.role === "WORKER") {
      roleToSend = "WORKER";
    } else {
      roleToSend = values.clientKind === "LEGAL" ? "LEGAL" : "CLIENT";
    }

    try {
      await register({
        name: values.name.trim(),
        surname: values.surname.trim(),
        middleName: values.middleName?.trim() || "",
        phone: rawPhone,
        password: values.password,
        role: roleToSend,
        gender: values.gender,
        birthday: values.birthday,
      });
      navigate("/login", { state: { phone: rawPhone } });
    } catch (e: any) {
      let serverMsg = t("loginFailed");
      if (isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") serverMsg = data;
        else if (typeof data === "object") {
          const firstVal = Object.values(data)[0];
          if (firstVal && typeof firstVal === "string") serverMsg = firstVal;
        }
      }
      setError("phone", { message: serverMsg });
      setError("password", { message: serverMsg });
    }
  };

  return (
    <PageWrap>
      {/* Левая часть */}
      <LeftSide>
        <Link to="/">
          <Brand>{t("brand")}</Brand>
        </Link>
        <DotLottieReact
          src="https://lottie.host/44ba2cb8-1b7b-4e37-a5c5-99d9fb319ec1/SCGqvvOcYo.lottie"
          loop
          autoplay
        />
        <Welcome>{t("registerWelcome")}</Welcome>
        <Subtitle>{t("registerSubtitle")}</Subtitle>
      </LeftSide>

      {/* Правая часть */}
      <RightSide>
        <Card onSubmit={handleSubmit(onSubmit)}>
          <CardTitle>{t("registerTitle")}</CardTitle>
          <TopHint>
            {t("haveAccount")} <LinkA href="/login">{t("goLogin")}</LinkA>
          </TopHint>

          <CustomInput
            control={control}
            name="name"
            placeholder={t("name")}
            rules={{ required: t("nameRequired") as string }}
          />
          <CustomInput
            control={control}
            name="surname"
            placeholder={t("surname")}
            rules={{ required: t("surnameRequired") as string }}
          />
          <CustomInput
            control={control}
            name="middleName"
            placeholder={t("middleName")}
          />

          <CustomInput
            control={control}
            name="phone"
            type="phone"
            placeholder="+998 (__) ___-__-__"
            rules={{
              required: t("phoneRequired") as string,
              validate: (v: string) =>
                v.replace(/\D/g, "").length === 12 ||
                (t("phoneInvalid") as string),
            }}
          />

          <FieldLabel>Пол</FieldLabel>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <>
                  <label
                    style={{
                      flex: 1,
                      border:
                        field.value === "MALE"
                          ? "2px solid #1E5CFB"
                          : "1px solid #ccc",
                      borderRadius: 8,
                      padding: "10px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: field.value === "MALE" ? "#EEF2FF" : "#fff",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      value="MALE"
                      checked={field.value === "MALE"}
                      onChange={() => field.onChange("MALE")}
                      style={{ display: "none" }}
                    />
                    Мужчина
                  </label>

                  <label
                    style={{
                      flex: 1,
                      border:
                        field.value === "FEMALE"
                          ? "2px solid #1E5CFB"
                          : "1px solid #ccc",
                      borderRadius: 8,
                      padding: "10px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: field.value === "FEMALE" ? "#EEF2FF" : "#fff",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      value="FEMALE"
                      checked={field.value === "FEMALE"}
                      onChange={() => field.onChange("FEMALE")}
                      style={{ display: "none" }}
                    />
                    Женщина
                  </label>
                </>
              )}
            />
          </div>

          <DatePopoverInput
            control={control}
            name="birthday"
            label="Дата рождения"
            placeholder="ГГГГ-ММ-ДД"
            required
            // Ограничим возраст: от 16 до 100 лет
            min={dayjs().subtract(100, "year").format("YYYY-MM-DD")}
            max={dayjs().subtract(16, "year").format("YYYY-MM-DD")}
            rules={{
              required: "Укажите дату рождения",
              validate: (v: string) => {
                // формат YYYY-MM-DD
                if (!/^\d{4}-\d{2}-\d{2}$/.test(v))
                  return "Введите в формате YYYY-MM-DD";
                const d = dayjs(v, "YYYY-MM-DD", true);
                if (!d.isValid()) return "Некорректная дата";
                const age = dayjs().diff(d, "year");
                if (age < 16) return "Возраст должен быть 16+";
                if (age > 100) return "Возраст не может превышать 100 лет";
                return true;
              },
            }}
          />

          {/* Выбор основной роли */}
          <Controller
            name="role"
            control={control}
            rules={{ required: t("roleRequired") as string }}
            render={({ field, fieldState }) => {
              const hasError = !!fieldState.error;
              return (
                <RoleWrap>
                  <FieldLabel>{t("role")}</FieldLabel>
                  <RoleGrid>
                    {/* CLIENT */}
                    <RoleCard
                      active={field.value === "CLIENT"}
                      hasError={hasError}
                    >
                      <HiddenRadioMain
                        type="radio"
                        value="CLIENT"
                        checked={field.value === "CLIENT"}
                        onChange={() => field.onChange("CLIENT")}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      {field.value === "CLIENT" && (
                        <RoleTick aria-hidden>
                          <PiCheckBold />
                        </RoleTick>
                      )}
                      <RoleIconBox>
                        <FaUser />
                      </RoleIconBox>
                      <RoleText>
                        <RoleTitle>{t("roleClient")}</RoleTitle>
                        <RoleDesc>{t("roleClientDesc")}</RoleDesc>
                      </RoleText>
                    </RoleCard>

                    {/* WORKER */}
                    <RoleCard
                      active={field.value === "WORKER"}
                      hasError={hasError}
                    >
                      <HiddenRadioMain
                        type="radio"
                        value="WORKER"
                        checked={field.value === "WORKER"}
                        onChange={() => field.onChange("WORKER")}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      {field.value === "WORKER" && (
                        <RoleTick aria-hidden>
                          <PiCheckBold />
                        </RoleTick>
                      )}
                      <RoleIconBox>
                        <FaUserTie />
                      </RoleIconBox>
                      <RoleText>
                        <RoleTitle>{t("roleWorker")}</RoleTitle>
                        <RoleDesc>{t("roleWorkerDesc")}</RoleDesc>
                      </RoleText>
                    </RoleCard>
                  </RoleGrid>

                  {/* Подблок выбора подтипа — только при CLIENT */}
                  {field.value === "CLIENT" && (
                    <Controller
                      name="clientKind"
                      control={control}
                      render={({ field: cField }) => (
                        <MiniSegWrap
                          role="radiogroup"
                          aria-labelledby="client-kind-label"
                        >
                          <MiniSegLabel id="client-kind-label">
                            {t("clientKindHint")}
                          </MiniSegLabel>

                          <MiniSegGroup>
                            {/* ЮР лицо — слева */}
                            <MiniSegOption active={cField.value === "LEGAL"}>
                              <MiniHiddenRadio
                                type="radio"
                                value="LEGAL"
                                checked={cField.value === "LEGAL"}
                                onChange={() => cField.onChange("LEGAL")}
                                name={cField.name}
                              />
                              {t("workerKindLegal")}
                            </MiniSegOption>

                            {/* Физ лицо — справа */}
                            <MiniSegOption active={cField.value === "PERSON"}>
                              <MiniHiddenRadio
                                type="radio"
                                value="PERSON"
                                checked={cField.value === "PERSON"}
                                onChange={() => cField.onChange("PERSON")}
                                name={cField.name}
                              />
                              {t("workerKindPerson")}
                            </MiniSegOption>
                          </MiniSegGroup>
                        </MiniSegWrap>
                      )}
                    />
                  )}

                  {hasError && <ErrorMsg>{fieldState.error?.message}</ErrorMsg>}
                </RoleWrap>
              );
            }}
          />

          <CustomInput
            control={control}
            name="password"
            type="password"
            placeholder={t("password")}
            rules={{
              required: t("passwordRequired") as string,
              minLength: { value: 8, message: t("passwordHelper") as string },
            }}
          />
          <CustomInput
            control={control}
            name="confirmPassword"
            type="password"
            placeholder={t("confirmPassword")}
            rules={{
              required: t("passwordRequired") as string,
              validate: (v: string) =>
                v === pwd || (t("passwordsNotMatch") as string),
            }}
          />

          <CustomButton
            type="submit"
            fullWidth
            loading={isPending}
            disabled={isPending}
          >
            {t("registerCta")}
          </CustomButton>

          <AgreementText>
            <Trans
              i18nKey="agreementRich"
              values={{ btn: t("registerCta") }}
              components={{
                tos: <AgreementA href="/terms" target="_blank" />,
                privacy: <AgreementA href="/privacy" target="_blank" />,
                pd: <AgreementA href="/personal-data" target="_blank" />,
                strong: <strong />,
              }}
            />
          </AgreementText>

          <LinksRow />
        </Card>
      </RightSide>

      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LangSwitcher />
      </div>
    </PageWrap>
  );
};

export default RegisterPage;
