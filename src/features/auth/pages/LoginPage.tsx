import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
} from "../login-style";
import { CustomInput } from "../../../components/custom-input";
import { CustomButton } from "../../../components/custom-button";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import { useLogin } from "../../../shared/modules/auth";
import { useNavigate } from "react-router-dom";

type FormValues = {
  phone: string; // ожидаем "998900012644" (без "+")
  password: string;
};

const LoginPage = () => {
  const { t } = useTranslation();
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: { phone: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    const raw = values.phone.replace(/\D/g, "");
  
    try {
      const user = await login({ phone: raw, password: values.password });
  
      // если API возвращает роль, например user.role === "ADMIN"
      if (user?.role === "ADMIN") {
        navigate("/admin/stats");
      } else {
        navigate("/app/profile");
      }
    } catch (e: any) {
      let serverMsg = t("loginFailed");
  
      if (isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") {
          serverMsg = data;
        } else if (typeof data === "object") {
          const firstVal = Object.values(data)[0];
          if (firstVal && typeof firstVal === "string") {
            serverMsg = firstVal;
          }
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
        {/* <Illustration src="/register.svg" alt={t("welcome")} loading="lazy" /> */}
        <DotLottieReact
          src="https://lottie.host/b0146f16-302a-43d9-a258-561c491a1d02/bVM3MMUUOe.lottie"
          loop
          autoplay
        />
        <Welcome>{t("welcome")}</Welcome>
        <Subtitle>
          {t("loginSubtitle", {
            defaultValue: "Войдите в аккаунт, чтобы продолжить",
          })}
        </Subtitle>
      </LeftSide>

      {/* Правая часть */}
      <RightSide>
        <Card onSubmit={handleSubmit(onSubmit)}>
          <CardTitle>{t("loginTitle")}</CardTitle>
          <TopHint>
            {t("firstTime")} <LinkA href="/register">{t("goRegister")}</LinkA>
          </TopHint>

          <CustomInput
            control={control}
            name="phone"
            type="phone"
            placeholder="+998 (__) ___-__-__"
            rules={{
              required: t("phoneRequired") as string,
              validate: (value: string) => {
                const digits = value.replace(/\D/g, ""); // только цифры
                if (digits.length !== 12) {
                  return t("phoneInvalid");
                }
                return true;
              },
            }}
          />

          <CustomInput
            control={control}
            name="password"
            type="password"
            placeholder={t("password")}
            rules={{
              required: t("passwordRequired") as string,
              minLength: {
                value: 8,
                message: t("passwordHelper"),
              },
            }}
          />

          <CustomButton
            type="submit"
            fullWidth
            disabled={isPending}
            loading={isPending}
          >
            {t("loginCta")}
          </CustomButton>

          <LinksRow>
            <LinkA href="/forgot">{t("forgot")}</LinkA>
          </LinksRow>
        </Card>
      </RightSide>

      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LangSwitcher />
      </div>
    </PageWrap>
  );
};

export default LoginPage;
