// src/components/billing/PaymentModal.tsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import { Modal } from "../modal/Modal";
import { CustomInput } from "../custom-input";

type FormValues = {
  card: string; // "0000 0000 0000 0000"
  expiry: string; // "MM/YY"
};

export default function PaymentModal({
  open,
  onClose,
  amount = 5000,
  onPay,
}: {
  open: boolean;
  onClose: () => void;
  amount?: number; // сум
  onPay?: (payload: { card: string; expiry: string }) => Promise<void> | void;
}) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { card: "", expiry: "" },
  });

  const card = watch("card");
  const expiry = watch("expiry");

  const canSubmit = useMemo(() => {
    const clean = (card || "").replace(/\s/g, "");
    const expOk = /^(\d{2})\/(\d{2})$/.test(expiry || "");
    return clean.length === 16 && expOk && !formState.isSubmitting;
  }, [card, expiry, formState.isSubmitting]);

  const submit = async (values: FormValues) => {
    await onPay?.(values);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={null}
      width={520}
      maxWidth="92vw"
      closeOnOverlay={true}
      ariaLabel="Оплата Uzcard/Humo"
      footer={
        <FooterRow>
          <Amount>
            К оплате: <b>{amount.toLocaleString("ru-RU")} сум</b>
          </Amount>
          <PayBtn
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit(submit)}
            aria-disabled={!canSubmit}
          >
            Оплатить
          </PayBtn>
        </FooterRow>
      }
    >
      <Wrap>
        <BrandRow aria-label="Поддерживаемые карты">
          <LogoPill>
            <UzcardLogo /> Uzcard
          </LogoPill>
          <LogoPill>
            <HumoLogo /> Humo
          </LogoPill>
        </BrandRow>

        <Form>
          <CustomInput
            control={control}
            name="card"
            type="card"
            label="Номер карты"
            placeholder="0000 0000 0000 0000"
            rules={{
              required: "Введите номер карты",
              validate: (v: string) =>
                v.replace(/\s/g, "").length === 16 ||
                "Номер должен содержать 16 цифр",
            }}
          />

          <Row2>
            <CustomInput
              control={control}
              name="expiry"
              type="expiry"
              label="Срок действия"
              placeholder="MM/YY"
              rules={{
                required: "Укажите срок действия",
                validate: (v: string) =>
                  /^(\d{2})\/(\d{2})$/.test(v) || "Введите в формате MM/YY",
              }}
            />
          </Row2>
        </Form>

        <Note>
          Данные карты передаются безопасно. Мы не сохраняем реквизиты на
          стороне клиента.
        </Note>
      </Wrap>
    </Modal>
  );
}

/* ===== Styles ===== */
const Wrap = styled.div`
  display: grid;
  gap: 14px;
  color: #0f172a;
`;

const BrandRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const LogoPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #e7ecf3;
  background: #fff;
  font-weight: 800;
  color: #0f172a;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Form = styled.div`
  display: grid;
  gap: 10px;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Amount = styled.div`
  font-size: 14px;
  color: #475569;
  b {
    color: #0f172a;
  }
`;

const PayBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 800;
  border: 1px solid #2f6bff;
  background: #2f6bff;
  color: #fff;
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.15s ease;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Note = styled.div`
  font-size: 12px;
  color: #6b7a90;
`;

/* ===== Inline Logos (минималистичные) ===== */
function UzcardLogo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="12" width="56" height="40" rx="8" fill="#1e40af" />
      <rect x="9" y="17" width="46" height="30" rx="6" fill="#eff6ff" />
      <circle cx="22" cy="32" r="7" fill="#1e40af" />
      <rect x="34" y="27" width="15" height="10" rx="3" fill="#1e40af" />
    </svg>
  );
}

function HumoLogo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="12" width="56" height="40" rx="8" fill="#16a34a" />
      <rect x="9" y="17" width="46" height="30" rx="6" fill="#ecfdf5" />
      <path d="M18 40 L26 24 L34 40 Z" fill="#16a34a" />
      <circle cx="44" cy="32" r="6" fill="#16a34a" />
    </svg>
  );
}
