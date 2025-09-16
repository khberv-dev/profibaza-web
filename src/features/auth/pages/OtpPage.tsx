import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { isAxiosError } from "axios";

import { CustomInput } from "../../../components/custom-input";
import { CustomButton } from "../../../components/custom-button";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import { useRegister } from "../../../shared/modules/auth"; // ✅ хук регистрации

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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type FormValues = {
  name: string;
  surname: string;
  middleName?: string;
  phone: string; // ожидаем маску, в onSubmit отправим только цифры
  password: string;
  confirmPassword: string;
};

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
    },
    mode: "onChange",
  });

  const pwd = watch("password");

  const onSubmit = async (values: FormValues) => {
    // телефон: берём только цифры
    const rawPhone = values.phone.replace(/\D/g, "");

    // простая локальная проверка телефона
    if (rawPhone.length !== 12) {
      setError("phone", { message: t("phoneInvalid") });
      return;
    }

    // проверка паролей (на всякий случай, у нас есть ещё и rule)
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", { message: t("passwordsNotMatch") });
      return;
    }

    try {
      await register({
        name: values.name.trim(),
        surname: values.surname.trim(),
        middleName: values.middleName?.trim() || "",
        phone: rawPhone,
        password: values.password,
      });

      // После успешной регистрации: на страницу подтверждения кода
      navigate("/login", { state: { phone: rawPhone } });
    } catch (e: any) {
      // показываем текст с сервера (например {"uz":"Raqam yoki parol xato"})
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
      // дублируем под релевантные поля, чаще всего — телефон/пароль
      setError("phone", { message: serverMsg });
      setError("password", { message: serverMsg });
    }
  };

  return (
    <PageWrap>
      {/* Левая часть */}
      <LeftSide>
        <Brand>{t("brand")}</Brand>
        {/* <Illustration
          src="/illustrations/laptop-peace.png"
          alt={t("welcome")}
          loading="lazy"
        /> */}
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
            rules={{ required: t("middleNameRequired") as string }}
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
