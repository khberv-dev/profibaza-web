// src/features/profile/components/InvestorContactsSection.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  EditBtn,
  PrimaryBtn,
  Field,
  Label,
} from "../../pro-profile-section.style";
import { CustomInput } from "../../../../components/custom-input/CustomInput";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import { useCreateInvestorContact } from "../../../../shared/modules/useInvestorContacts";

type ContactFormShape = {
  person: string;
  contact: string;
  type: "PHONE" | "EMAIL";
};

function ContactCard({ c }: { c: any }) {
  return (
    <div
      style={{
        border: "1px solid #e7ecf3",
        borderRadius: 14,
        padding: 14,
        background: "#fff",
        display: "grid",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 800, color: "#0f172a" }}>
          {c?.person || "—"}
        </span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
            color: "#374151",
          }}
        >
          {c?.type || "—"}
        </span>
      </div>
      <div style={{ color: "#475569", fontSize: 14 }}>
        {c?.contact || c?.value || "—"}
      </div>
    </div>
  );
}

export function InvestorContactsSection({ contacts }: { contacts: any[] }) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = React.useState(false);

  const { mutate: createContact, isPending } = useCreateInvestorContact();

  const { control, handleSubmit, reset, formState, watch } =
    useForm<ContactFormShape>({
      defaultValues: { person: "", contact: "", type: "PHONE" },
      mode: "onChange",
    });

  const typeVal = watch("type");

  const CONTACT_TYPE_OPTIONS = [
    { value: "PHONE", label: t("investor.contacts.typePhone") },
    { value: "EMAIL", label: t("investor.contacts.typeEmail") },
  ];

  const validateContact = (raw: string) => {
    const s = (raw || "").trim();
    if (!s) return t("investor.contacts.errors.contactRequired");
    if (typeVal === "EMAIL")
      return (
        /^\S+@\S+\.\S+$/.test(s) || t("investor.contacts.errors.emailInvalid")
      );
    return (
      /^[+0-9()\s-]{7,}$/.test(s) || t("investor.contacts.errors.phoneInvalid")
    );
  };

  const submit = (mode: "close" | "addMore") =>
    handleSubmit((v) => {
      createContact(
        { person: v.person.trim(), contact: v.contact.trim(), type: v.type },
        {
          onSuccess: () => {
            reset({ person: "", contact: "", type: "PHONE" });
            if (mode === "close") setIsAdding(false);
          },
          onError: (e: any) =>
            alert(e?.message || t("investor.contacts.errors.createFailed")),
        }
      );
    });

  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 2 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            {t("investor.contacts.title")}
          </h3>

          <div style={{ fontSize: 13, color: "#64748B" }}>
            {contacts?.length
              ? t("investor.contacts.count", { n: contacts.length })
              : t("investor.contacts.noData")}
            {contacts?.length ? (
              <span style={{ marginLeft: 8, color: "#94a3b8" }}>
                {t("investor.contacts.hint")}
              </span>
            ) : null}
          </div>
        </div>

        {!isAdding ? (
          <PrimaryBtn
            type="button"
            onClick={() => setIsAdding(true)}
            style={{ borderRadius: 10, padding: "10px 14px" }}
          >
            {t("investor.contacts.addBtn")}
          </PrimaryBtn>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <EditBtn
              type="button"
              onClick={() => {
                reset({ person: "", contact: "", type: "PHONE" });
                setIsAdding(false);
              }}
              style={{ borderRadius: 10, padding: "10px 14px" }}
              disabled={isPending}
            >
              {t("investor.contacts.cancelBtn")}
            </EditBtn>

            <PrimaryBtn
              type="button"
              onClick={submit("addMore")}
              style={{ borderRadius: 10, padding: "10px 14px" }}
              disabled={isPending || !formState.isValid}
            >
              {isPending
                ? t("investor.contacts.saving")
                : t("investor.contacts.saveMoreBtn")}
            </PrimaryBtn>

            <PrimaryBtn
              type="button"
              onClick={submit("close")}
              style={{ borderRadius: 10, padding: "10px 14px" }}
              disabled={isPending || !formState.isValid}
            >
              {isPending
                ? t("investor.contacts.saving")
                : t("investor.contacts.saveBtn")}
            </PrimaryBtn>
          </div>
        )}
      </div>

      {isAdding && (
        <div
          style={{
            border: "1px solid #e7ecf3",
            borderRadius: 14,
            padding: 14,
            background: "#fff",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              alignItems: "end",
            }}
          >
            <Field style={{ width: "100%" }}>
              <Label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                {t("investor.contacts.personLabel")}
              </Label>

              <CustomInput
                control={control}
                name="person"
                placeholder={t("investor.contacts.personPlaceholder")}
                required
                rules={{
                  required: t("investor.contacts.errors.personRequired"),
                  minLength: { value: 2, message: t("validation.required") },
                }}
              />
            </Field>

            <Field style={{ width: "100%" }}>
              <Label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                {t("investor.contacts.typeLabel")}
              </Label>

              <Controller
                control={control}
                name="type"
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomSelect
                    id="type"
                    options={CONTACT_TYPE_OPTIONS}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    placeholder={t("placeholders2.select")}
                    menuMaxHeight={240}
                  />
                )}
              />
            </Field>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field style={{ width: "100%" }}>
                <Label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  {typeVal === "EMAIL"
                    ? t("investor.contacts.contactLabelEmail")
                    : t("investor.contacts.contactLabelPhone")}
                </Label>

                <CustomInput
                  control={control}
                  name="contact"
                  placeholder={
                    typeVal === "EMAIL"
                      ? t("investor.contacts.contactPlaceholderEmail")
                      : t("investor.contacts.contactPlaceholderPhone")
                  }
                  required
                  rules={{
                    required: t("investor.contacts.errors.contactRequired"),
                    validate: validateContact,
                  }}
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      {!contacts?.length ? (
        <div
          style={{
            color: "#64748b",
            border: "1px dashed #e7ecf3",
            borderRadius: 12,
            padding: 16,
            background: "#fafafa",
          }}
        >
          {t("investor.contacts.empty")}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {contacts.map((c, idx) => (
            <ContactCard key={c?.id ?? `${c?.type ?? "c"}-${idx}`} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
