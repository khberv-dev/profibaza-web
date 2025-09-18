// pages/auth/forgot/ForgotPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { FiLock, FiSmartphone, FiCheckCircle } from "react-icons/fi";

import { Card, CardTitle, TopHint, LinkA, LinksRow } from "../login-style";
import { CustomInput } from "../../../components/custom-input";
import { CustomButton } from "../../../components/custom-button";
import LangSwitcher from "../../../components/lang-switcher/LangSwitcher";
import { userApi } from "../../../shared/endpoints/user";
import OTPCode from "./components/OTPCode";

/* ---------- оформление страницы ---------- */
const CenterWrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: radial-gradient(
      1200px 600px at 10% -10%,
      #e8efff 0%,
      transparent 60%
    ),
    radial-gradient(900px 400px at 100% 0%, #f7f9ff 0%, transparent 70%),
    #ffffff;
`;

const BrandTop = styled.div`
  position: fixed;
  left: 20px;
  top: 18px;
  font-weight: 900;
  letter-spacing: 0.3px;
  color: #0f172a;
`;

const AuthCard = styled(Card)`
  max-width: 460px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e7ecf3;
  background: #ffffff;
  box-shadow: 0 20px 40px rgba(2, 32, 71, 0.06);
`;

const Header = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
`;

const LockBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #eef3ff;
  color: #1e5cfb;
  font-size: 22px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.div`
  color: #6b7280;
  font-size: 14px;
`;

const Stepper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin: 8px 0 14px;
`;

const StepItem = styled.div<{ active?: boolean; done?: boolean }>`
  height: 6px;
  border-radius: 999px;
  background: ${({ active, done }) =>
    done ? "#1e5cfb" : active ? "rgba(30,92,251,.45)" : "#e9eef6"};
  transition: background 0.2s ease;
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  font-size: 13px;
  margin-top: 6px;
  text-align: center;
`;

/* ---------- типы ---------- */
type Step = "phone" | "code" | "password";
type PhoneForm = { phone: string };
type CodeForm = { code: string };
type PwdForm = { password: string; confirm: string };

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("phone");
  const [sending, setSending] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [codeValue, setCodeValue] = useState<string>("");

  // шаг 1 — телефон
  const {
    control: phoneControl,
    handleSubmit: submitPhone,
    setError: setPhoneError,
    reset: resetPhone,
  } = useForm<PhoneForm>({ defaultValues: { phone: "" }, mode: "onChange" });

  // шаг 2 — код (эмуляция)
  const {
    control: codeControl,
    handleSubmit: submitCode,
    setError: setCodeError,
    reset: resetCode,
  } = useForm<CodeForm>({ defaultValues: { code: "" }, mode: "onChange" });

  // шаг 3 — новый пароль
  const {
    control: pwdControl,
    handleSubmit: submitPwd,
    setError: setPwdError,
    watch: watchPwd,
    reset: resetPwd,
  } = useForm<PwdForm>({
    defaultValues: { password: "", confirm: "" },
    mode: "onChange",
  });
  const pwd = watchPwd("password");

  /* ====== Шаг 1: телефон ====== */
  const onSendPhone = async (v: PhoneForm) => {
    const digits = v.phone.replace(/\D/g, "");
    if (digits.length !== 12) {
      setPhoneError("phone", { message: t("phoneInvalid") as string });
      return;
    }
    try {
      setSending(true);
      const reqId = await userApi.requestResetPassword(digits);
      setRequestId(reqId);
      setPhoneDigits(digits);
      setStep("code");
      resetCode({ code: "" });
    } catch (e: any) {
      let msg = t("loginFailed");
      if (isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") msg = data;
        else if (typeof data === "object") {
          const firstVal = Object.values(data)[0];
          if (typeof firstVal === "string") msg = firstVal;
        }
      }
      setPhoneError("phone", { message: msg as string });
    } finally {
      setSending(false);
    }
  };

  /* ====== Шаг 2: код ====== */
  const onCheckCode = (v: CodeForm) => {
    if (!/^\d{5}$/.test(v.code)) {
      setCodeError("code", { message: t("otpHelper") as string });
      return;
    }
    if (v.code !== "00000") {
      setCodeError("code", { message: t("wrongCode") as string });
      return;
    }
    setCodeValue(v.code);
    setStep("password");
    resetPwd({ password: "", confirm: "" });
  };

  /* ====== Шаг 3: пароль ====== */
  const onSetPassword = async (v: PwdForm) => {
    if (v.password.length < 8) {
      setPwdError("password", { message: t("passwordHelper") as string });
      return;
    }
    if (v.password !== v.confirm) {
      setPwdError("confirm", { message: t("passwordsNotMatch") as string });
      return;
    }
    try {
      setSending(true);
      await userApi.resetPassword({
        requestId,
        code: codeValue,
        password: v.password,
      });
      navigate("/login", { state: { phone: phoneDigits } });
    } catch (e: any) {
      let msg = t("loginFailed");
      if (isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") msg = data;
        else if (typeof data === "object") {
          const firstVal = Object.values(data)[0];
          if (typeof firstVal === "string") msg = firstVal;
        }
      }
      setPwdError("password", { message: msg as string });
    } finally {
      setSending(false);
    }
  };

  return (
    <CenterWrap>
      <BrandTop>PROFIBAZA</BrandTop>

      {/* PHONE */}
      {step === "phone" && (
        <AuthCard onSubmit={submitPhone(onSendPhone)}>
          <Header>
            <TitleRow>
              <LockBadge>
                <FiLock />
              </LockBadge>
              <div>
                <CardTitle style={{ margin: 0 }}>{t("forgotTitle")}</CardTitle>
                <Subtitle>{t("loginSubtitle")}</Subtitle>
              </div>
            </TitleRow>
            <Stepper>
              <StepItem active />
              <StepItem />
              <StepItem />
            </Stepper>
          </Header>

          <TopHint>
            {t("remembered")} <LinkA href="/login">{t("goLogin")}</LinkA>
          </TopHint>

          <CustomInput
            control={phoneControl}
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

          <CustomButton fullWidth type="submit" loading={sending}>
            {t("forgotSend")}
          </CustomButton>
        </AuthCard>
      )}

      {/* CODE */}
      {step === "code" && (
        <AuthCard onSubmit={submitCode(onCheckCode)}>
          <Header>
            <TitleRow>
              <LockBadge>
                <FiSmartphone />
              </LockBadge>
              <div>
                <CardTitle style={{ margin: 0 }}>{t("otpTitle")}</CardTitle>
                <Subtitle>
                  {t("otpSub")} <strong>+{phoneDigits}</strong>
                </Subtitle>
              </div>
            </TitleRow>
            <Stepper>
              <StepItem done />
              <StepItem active />
              <StepItem />
            </Stepper>
          </Header>

          <OTPCode control={codeControl} name="code" length={5} />

          <CustomButton fullWidth type="submit">
            {t("continue")}
          </CustomButton>

          <LinksRow>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                resetPhone({ phone: "" });
              }}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("changePhone")}
            </button>
          </LinksRow>

          <ErrorMsg style={{ color: "#6b7280" }}>{t("demoCodeHint")}</ErrorMsg>
        </AuthCard>
      )}

      {/* PASSWORD */}
      {step === "password" && (
        <AuthCard onSubmit={submitPwd(onSetPassword)}>
          <Header>
            <TitleRow>
              <LockBadge>
                <FiCheckCircle />
              </LockBadge>
              <div>
                <CardTitle style={{ margin: 0 }}>
                  {t("newPasswordTitle")}
                </CardTitle>
                <Subtitle>
                  {t("otpSub")} <strong>+{phoneDigits}</strong> · {t("codeOk")}
                </Subtitle>
              </div>
            </TitleRow>
            <Stepper>
              <StepItem done />
              <StepItem done />
              <StepItem active />
            </Stepper>
          </Header>

          <CustomInput
            control={pwdControl}
            name="password"
            type="password"
            placeholder={t("newPassword")}
            rules={{
              required: t("passwordRequired") as string,
              minLength: { value: 8, message: t("passwordHelper") as string },
            }}
          />
          <CustomInput
            control={pwdControl}
            name="confirm"
            type="password"
            placeholder={t("confirmPassword")}
            rules={{
              required: t("passwordRequired") as string,
              validate: (v: string) =>
                v === pwd || (t("passwordsNotMatch") as string),
            }}
          />

          <CustomButton fullWidth type="submit" loading={sending}>
            {t("resetCta")}
          </CustomButton>

          <LinksRow>
            <button
              type="button"
              onClick={() => setStep("code")}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("backToCode")}
            </button>
          </LinksRow>
        </AuthCard>
      )}

      <div style={{ position: "fixed", top: 16, right: 16 }}>
        <LangSwitcher />
      </div>
    </CenterWrap>
  );
}
