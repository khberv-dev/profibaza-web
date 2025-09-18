// pages/auth/register/RegisterPage.tsx
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import styled from "@emotion/styled";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaUserTie } from "react-icons/fa6";
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
import { IoBusinessSharp } from "react-icons/io5";

/* ---------- типы формы ---------- */
type FormValues = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string; // маска в CustomInput, в onSubmit берём только цифры
  password: string;
  confirmPassword: string;
  role: "CLIENT" | "WORKER" | "";
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
  grid-template-columns: 1fr; /* ⬅️ только 1 колонка */
  gap: 12px;
`;

const RoleCard = styled.label<{ active?: boolean; hasError?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid
    ${({ active, hasError }) =>
      hasError ? "#ef4444" : active ? "#2563eb" : "rgba(15,18,25,.12)"};
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.06s;

  &:hover {
    border-color: ${({ hasError }) => (hasError ? "#ef4444" : "#94b2ff")};
    box-shadow: 0 8px 22px rgba(2, 32, 71, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const HiddenRadio = styled.input`
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
    font-size: 22px; /* размер иконки */
    color: #1e5cfb; /* LinkedIn blue */
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
      role: "", // обязательный выбор
    },
    mode: "onChange",
  });

  const pwd = watch("password");

  const onSubmit = async (values: FormValues) => {
    const rawPhone = values.phone.replace(/\D/g, "");

    // локальные проверки
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

    try {
      await register({
        name: values.name.trim(),
        surname: values.surname.trim(),
        middleName: values.middleName?.trim() || "",
        phone: rawPhone,
        password: values.password,
        role: values.role as "CLIENT" | "WORKER",
      });

      // после успешной регистрации — на логин (или ввод кода, если так задумано)
      navigate("/login", { state: { phone: rawPhone } });
    } catch (e: any) {
      // красивый вывод ошибки сервера
      let serverMsg = t("loginFailed");
      if (isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") {
          serverMsg = data;
        } else if (typeof data === "object") {
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
        <Brand>{t("brand")}</Brand>
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

          {/* Выбор роли — карточки */}
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
                    <RoleCard
                      active={field.value === "CLIENT"}
                      hasError={hasError}
                    >
                      <HiddenRadio
                        type="radio"
                        value="CLIENT"
                        checked={field.value === "CLIENT"}
                        onChange={() => field.onChange("CLIENT")}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <RoleIconBox>
                        <IoBusinessSharp />
                      </RoleIconBox>
                      <RoleText>
                        <RoleTitle>{t("roleClient")}</RoleTitle>
                        <RoleDesc>{t("roleClientDesc")}</RoleDesc>
                      </RoleText>
                    </RoleCard>

                    <RoleCard
                      active={field.value === "WORKER"}
                      hasError={hasError}
                    >
                      <HiddenRadio
                        type="radio"
                        value="WORKER"
                        checked={field.value === "WORKER"}
                        onChange={() => field.onChange("WORKER")}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <RoleIconBox>
                        <FaUserTie />
                      </RoleIconBox>
                      <RoleText>
                        <RoleTitle>{t("roleWorker")}</RoleTitle>
                        <RoleDesc>{t("roleWorkerDesc")}</RoleDesc>
                      </RoleText>
                    </RoleCard>
                  </RoleGrid>
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

          {/* соглашение с кликабельными ссылками */}
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
