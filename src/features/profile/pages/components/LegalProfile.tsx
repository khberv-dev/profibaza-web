// src/features/profile/components/LegalProfile.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Row,
  Field,
  Label,
  Divider,
  PrimaryBtn,
  GhostBtn,
} from "../../pro-profile-section.style";
import CustomSelect, {
  SelectOption,
} from "../../../../components/custom-select/CustomSelect";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import { useUpdateLegalProfile } from "../../../../shared/modules/legal";
import { useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "../../../../shared/modules/user";
import { LEGAL_ME_QK as LEGAL_ME_QUERY_KEY } from "../../../../shared/modules/legal";

type FormShape = {
  companyName: string;
  companyType: string | number | null;
};

const COMPANY_TYPE_VALUES = [
  "MCHJ",
  "IP",
  "XK",
  "AJ",
  "FERX",
  "OTHER",
] as const;

export const LegalProfile: React.FC = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { mutate: updateProfile, isPending } = useUpdateLegalProfile();

  const { control, handleSubmit, watch, formState } = useForm<FormShape>({
    defaultValues: { companyName: "", companyType: "MCHJ" },
    mode: "onChange",
  });

  const COMPANY_TYPES: SelectOption[] = COMPANY_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`companyTypes.${v}`),
  }));

  const composeName = (name: string, type: string | number | null) => {
    const base = (name || "").trim();
    const suffix = String(type || "").toUpperCase();
    if (!base) return "";
    if (!suffix || suffix === "OTHER") return base;
    return `${base} ${suffix}`.trim(); // "Korzinka MCHJ"
  };

  const onSubmit = (data: FormShape) => {
    const name = composeName(data.companyName, data.companyType);
    if (!name) return; // защита от пустого

    updateProfile(
      { name },
      {
        onSuccess: async () => {
          await Promise.allSettled([
            qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
            qc.invalidateQueries({ queryKey: LEGAL_ME_QUERY_KEY }),
          ]);
        },
        onError: (e: any) => {
          alert(
            e?.message || t("profile.loadFailed") || "Не удалось сохранить"
          );
        },
      }
    );
  };

  const nameVal = watch("companyName");
  const typeVal = watch("companyType");

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row style={{ gap: 10 }}>
              <Field style={{ flex: 1, minWidth: 260 }}>
                <Label>{t("companyTypes.label")}</Label>
                <Controller
                  control={control}
                  name="companyType"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      id="companyType"
                      options={COMPANY_TYPES}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      placeholder={t("placeholders2.select")}
                      menuMaxHeight={300}
                    />
                  )}
                />
              </Field>

              <Field style={{ flex: 1.2, minWidth: 240 }}>
                <CustomInput
                  control={control}
                  name="companyName"
                  label={t("company.orgNameLabel")}
                  placeholder={t("company.orgNamePlaceholder") || ""}
                  required
                  rules={{
                    required: t("validation.required") || "Заполните поле",
                    minLength: {
                      value: 2,
                      message: t("validation.min6") || "Минимум 6 символов",
                    },
                  }}
                />
              </Field>
            </Row>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <PrimaryBtn
                type="submit"
                disabled={isPending || !formState.isValid}
              >
                {isPending ? t("common.saving") : t("common.save")}
              </PrimaryBtn>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
