// src/components/ActivationGate.tsx
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";

import { useMe, USER_QUERY_KEY } from "../shared/modules/user";
import { useAuthStore } from "../shared/stores/auth";
import {
  requestActivation,
  processCard,
  verifyCard,
  processActivation,
} from "../shared/endpoints/activation";
import { useNavigate } from "react-router-dom";
import { pickMessage } from "../lib/pickMessage";

export default function ActivationGate() {
  const { data: meApi, isLoading } = useMe();
  const setMe = useAuthStore((s) => s.setMe);
  const me = useAuthStore((s) => s.me);
  const qc = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (meApi) setMe(meApi as any);
  }, [meApi, setMe]);

  const token = useAuthStore((s) => s.token);
  // Лоадер, пока не знаем статус (чтобы не мигало приложение)
  if (!token) {
    navigate("/login", { replace: true });
    return null;
  }

  // Если вдруг активен — ничего не рендерим (гейт не нужен)
  if (me?.active) return null;

  return (
    <Page role="document" aria-labelledby="activation-title">
      <Center>
        <Hero>
          <Badge>
            <BadgeCheck size={16} />
            Аккаунт не активирован
          </Badge>
          <Title id="activation-title">Оплатите доступ, чтобы продолжить</Title>
          <Sub>
            Разовая оплата <b>5&nbsp;000 сум</b>. После оплаты доступ откроется
            автоматически. Если доступ не появился — нажмите «Проверить статус».
          </Sub>
        </Hero>

        <Plan>
          <PlanHead>
            <span className="name">Старт</span>
            <span className="price">5&nbsp;000 сум</span>
          </PlanHead>

          <PayBox
            onSuccess={async () => {
              // перезагрузим /me, чтобы active стал true
              await qc.invalidateQueries({ queryKey: USER_QUERY_KEY });
            }}
          />

          <Actions>
            <Ghost
              onClick={() => qc.invalidateQueries({ queryKey: USER_QUERY_KEY })}
              title="Проверить статус"
            >
              Я оплатил(а) — проверить
            </Ghost>
          </Actions>

          <Ribbon>Разовая оплата</Ribbon>
        </Plan>

        <Hint>
          После оплаты статус обновится автоматически. Если нет — «Проверить
          статус».
        </Hint>
      </Center>
    </Page>
  );
}

/* ==================== PayBox: весь flow с OTP ==================== */

type Stage =
  | "idle"
  | "requesting"
  | "card"
  | "otp"
  | "verifying"
  | "done"
  | "error";

function PayBox({ onSuccess }: { onSuccess: () => void }) {
  const [stage, setStage] = useState<Stage>("card");
  const [error, setError] = useState<string | null>(null);

  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [otp, setOtp] = useState("");

  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);

  const qc = useQueryClient(); // 👈 возьми тут тоже
  const navigate = useNavigate(); // 👈 навигация
  const setActive = useAuthStore((s) => s.setActive); // 👈 экшен из стора
  const setMe = useAuthStore((s) => s.setMe);

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const onCardInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCard(formatCard(e.target.value));
  const onExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setExpiry(formatExpiry(e.target.value));
  const onOtpInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));

  const cleanCard = card.replace(/\s/g, "");
  const expiryMMYY = expiry.replace("/", ""); // MMYY для API
  const validCard = cleanCard.length === 16 && /^\d{4}$/.test(expiryMMYY);

  // Шаг 1 + 2: запросить activation → отправить карту, получить token
  const handlePay = async () => {
    if (!validCard || stage === "requesting") return;
    setError(null);
    try {
      setStage("requesting");
      // 1) request-activation
      const { transactionId } = await requestActivation();
      setTransactionId(transactionId);

      // 2) process-card (отправляем карту, придёт OTP на телефон и token в ответе)
      const { token } = await processCard({
        invoice: transactionId,
        card: cleanCard,
        expire: expiryMMYY,
      });
      setCardToken(token);

      // показываем поле OTP
      setStage("otp");
    } catch (e: any) {
      setError(e?.message || "Ошибка при инициализации платежа");
      setStage("error");
    }
  };

  // Шаг 3 + 4: verify-card → process-activation
  const handleVerify = async () => {
    if (!transactionId || !cardToken || otp.length < 3) return;
    setError(null);
    try {
      setStage("verifying");
      await verifyCard({ invoice: transactionId, token: cardToken, code: otp });
      await processActivation();

      // ✅ 1. Берём текущее me из стора
      const currentMe = useAuthStore.getState().me;

      // ✅ 2. Обновляем active и сохраняем
      if (currentMe) {
        setMe({ ...currentMe, active: true });
      }
      setActive(true);

      // ✅ 3. Обновляем /me и переходим в профиль
      await qc.invalidateQueries({ queryKey: USER_QUERY_KEY });
      setStage("done");
      onSuccess?.();

      setTimeout(() => navigate("/app/profile"), 300);
    } catch (e: any) {
      const msg =
        pickMessage(e?.response?.data?.message) || // если axios-ошибка
        pickMessage(e?.message) ||
        "Не удалось подтвердить код";
      setError(msg); // <- всегда строка
      setStage("otp");
    }
  };

  return (
    <Box>
      <Fields aria-live="polite">
        <Field>
          <Label>Номер карты</Label>
          <Input
            id="card"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={card}
            onChange={onCardInput}
            maxLength={19}
            autoComplete="off"
            disabled={
              stage === "requesting" || stage === "verifying" || stage === "otp"
            }
          />
          <LogoRow>
            <img src="/uzcard2.png" height={22} alt="Uzcard" />
            <img src="/humo.png" height={22} alt="Humo" />
          </LogoRow>
        </Field>

        <Row2>
          <Field>
            <Label>Срок действия</Label>
            <Input
              id="exp"
              inputMode="numeric"
              placeholder="MM/YY"
              value={expiry}
              onChange={onExpiryInput}
              maxLength={5}
              autoComplete="off"
              disabled={
                stage === "requesting" ||
                stage === "verifying" ||
                stage === "otp"
              }
            />
          </Field>
        </Row2>

        {stage === "otp" || stage === "verifying" || stage === "done" ? (
          <Field>
            <Label>Код из SMS</Label>
            <Input
              id="otp"
              inputMode="numeric"
              placeholder="Введите код"
              value={otp}
              onChange={onOtpInput}
              maxLength={6}
              autoComplete="one-time-code"
              disabled={stage === "verifying" || stage === "done"}
            />
            <SmallHint>
              Мы отправили код подтверждения на номер телефона, привязанный к
              карте.
            </SmallHint>
          </Field>
        ) : null}

        {error ? <ErrorText role="alert">{String(error)}</ErrorText> : null}
      </Fields>

      <FooterRow>
        <Amount>
          К оплате: <b>5&nbsp;000 сум</b>
        </Amount>

        {stage === "otp" || stage === "verifying" || stage === "done" ? (
          <PayBtn
            type="button"
            onClick={handleVerify}
            disabled={
              otp.length < 3 || stage === "verifying" || stage === "done"
            }
          >
            {stage === "verifying"
              ? "Проверяем…"
              : stage === "done"
              ? "Готово"
              : "Подтвердить"}
          </PayBtn>
        ) : (
          <PayBtn
            type="button"
            onClick={handlePay}
            disabled={!validCard || stage === "requesting"}
          >
            {stage === "requesting" ? "Отправляем…" : "Оплатить"}
          </PayBtn>
        )}
      </FooterRow>
    </Box>
  );
}

/* ================= Dark theme styles (как раньше) ================= */

const Page = styled.main`
  --bg: #0b0f19;
  --panel: #121826;
  --panel-2: #0f1523;
  --border: #1f2a3b;
  --muted: #8a93a6;
  --text: #e5e7eb;
  --accent: #3b82f6;
  --accent-2: #60a5fa;
  --ring: 59, 130, 246;

  min-height: 100vh;
  width: 100%;
  color: var(--text);
  background: radial-gradient(
      900px 360px at 15% -10%,
      rgba(59, 130, 246, 0.22),
      transparent 60%
    ),
    radial-gradient(
      900px 360px at 110% 0%,
      rgba(99, 102, 241, 0.18),
      transparent 55%
    ),
    linear-gradient(180deg, #0b0f19 0%, #0a0e18 100%);
  display: grid;
  place-items: center;
  padding: clamp(20px, 4vw, 48px);
  box-sizing: border-box;
`;

const Center = styled.div`
  width: min(760px, 96vw);
  display: grid;
  justify-items: center;
  gap: 18px;
  text-align: center;
`;

const Hero = styled.section`
  display: grid;
  gap: 12px;
  justify-items: center;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #cbd5ff;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(96, 165, 250, 0.25);
  svg {
    color: var(--accent-2);
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(24px, 4.6vw, 40px);
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #f3f4f6;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
`;

const Sub = styled.p`
  margin: 6px 0 0;
  max-width: 800px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
`;

const Plan = styled.article`
  width: min(560px, 100%);
  background: linear-gradient(180deg, var(--panel), var(--panel-2));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  gap: 12px;
  position: relative;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
`;

const PlanHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 12px;
  .name {
    font-weight: 900;
    font-size: 16px;
    color: #e8ecf7;
  }
  .price {
    font-weight: 800;
    color: #cbd5ff;
  }
`;

const Ribbon = styled.div`
  position: absolute;
  top: 12px;
  right: -30px;
  transform: rotate(12deg);
  background: var(--accent);
  color: #fff;
  padding: 2px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
  pointer-events: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const Ghost = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 700;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.15s ease, background 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: #2a3a52;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Hint = styled.div`
  margin-top: 2px;
  color: #94a3b8;
  font-size: 12px;
`;

/* --- PayBox styles --- */
const Box = styled.div`
  display: grid;
  gap: 12px;
  text-align: left;
`;

const Fields = styled.div`
  display: grid;
  gap: 10px;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #9fb0cb;
`;

const Input = styled.input`
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #0d1422;
  padding: 0 12px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: #5e6b81;
  }
  &:hover {
    border-color: #2a3a52;
  }
  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--ring), 0.25);
    background: #0c1321;
  }
`;

const SmallHint = styled.div`
  color: #7f8ca4;
  font-size: 12px;
`;

const ErrorText = styled.div`
  margin-top: 2px;
  color: #fca5a5;
  font-size: 13px;
`;

const LogoRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  opacity: 0.9;
  margin-top: 6px;
  img {
    filter: brightness(1) contrast(1.05) saturate(1.1);
  }
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
`;

const Amount = styled.div`
  font-size: 15px;
  color: #9fb0cb;
  b {
    color: #e8ecf7;
  }
`;

const PayBtn = styled.button`
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 800;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.15s ease, opacity 0.15s ease,
    filter 0.15s ease;
  &:hover {
    filter: saturate(1.05) brightness(1.05);
    box-shadow: 0 12px 26px rgba(59, 130, 246, 0.35);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
  &:active {
    transform: translateY(1px);
  }
`;
const Splash = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: #cbd5ff;
  background: #0b0f19;
`;
