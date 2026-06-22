import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  PageWrap,
  LeftSide,
  LeftContent,
  BrandLink,
  Brand,
  MobileHeader,
  MobileBrand,
  MobileHero,
  MobileHeroInner,
  MobileLottieStage,
  MobileWelcome,
  MobileSubtitle,
  LottieWrap,
  Welcome,
  Subtitle,
  FeatureList,
  FeatureItem,
  RightSide,
  AuthFormScroll,
  Card,
  CardTopRow,
  CardEyebrow,
  CardLangWrap,
  CardTitle,
  TopHint,
  LinksRow,
  LinkA,
  SubmitWrap,
} from "../login-style";
import { CustomInput } from "../../../components/custom-input";
import { CustomButton } from "../../../components/custom-button";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import { useLogin } from "../../../shared/modules/auth";
import { useNavigate } from "react-router-dom";

type FormValues = {
  phone: string;
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

      if (user?.role === "ADMIN") {
        navigate("/admin/stats");
      } else {
        navigate("/app/profile");
      }
    } catch (e: unknown) {
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
      <BrandLink to="/">
        <Brand>{t("brand")}</Brand>
      </BrandLink>

      <LeftSide>
        <LeftContent>
          <LottieWrap>
            <DotLottieReact
              src="https://lottie.host/b0146f16-302a-43d9-a258-561c491a1d02/bVM3MMUUOe.lottie"
              loop
              autoplay
            />
          </LottieWrap>
          <Welcome>{t("welcome")}</Welcome>
          <Subtitle>{t("auth.loginSubtitle")}</Subtitle>
          <FeatureList>
            <FeatureItem>{t("auth.feature1")}</FeatureItem>
            <FeatureItem>{t("auth.feature2")}</FeatureItem>
            <FeatureItem>{t("auth.feature3")}</FeatureItem>
          </FeatureList>
        </LeftContent>
      </LeftSide>

      <RightSide>
        <MobileHero>
          <MobileHeader>
            <MobileBrand to="/">{t("brand")}</MobileBrand>
          </MobileHeader>

          <MobileHeroInner>
            <MobileLottieStage>
              <DotLottieReact
                src="https://lottie.host/b0146f16-302a-43d9-a258-561c491a1d02/bVM3MMUUOe.lottie"
                loop
                autoplay
              />
            </MobileLottieStage>
            <MobileWelcome>{t("welcome")}</MobileWelcome>
            <MobileSubtitle>{t("auth.loginSubtitle")}</MobileSubtitle>
          </MobileHeroInner>
        </MobileHero>

        <AuthFormScroll>
        <Card onSubmit={handleSubmit(onSubmit)}>
          <CardTopRow>
            <CardEyebrow>{t("auth.loginEyebrow")}</CardEyebrow>
            <CardLangWrap>
              <LangSwitcher />
            </CardLangWrap>
          </CardTopRow>
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
                const digits = value.replace(/\D/g, "");
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

          <SubmitWrap>
            <CustomButton
              type="submit"
              fullWidth
              disabled={isPending}
              loading={isPending}
            >
              {t("loginCta")}
            </CustomButton>
          </SubmitWrap>

          <LinksRow>
            <LinkA href="/forgot">{t("forgot")}</LinkA>
          </LinksRow>
        </Card>
        </AuthFormScroll>
      </RightSide>
    </PageWrap>
  );
};

export default LoginPage;
