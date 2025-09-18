import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalFooter } from "../../../../components/modal/Modal";
import { useUpdateUser } from "../../../../shared/modules/useUpdateUser";
import { Me } from "../../../../shared/endpoints/user";
import { CustomInput } from "../../../../components/custom-input";
import { GhostBtn, PrimaryBtn } from "../../profile-style";

type Props = {
  open: boolean;
  onClose: () => void;
  me?: Me | null;
};

type FormValues = {
  name: string;
  surname: string;
  middleName: string | null;
  phone: string; // digits
};

export default function EditProfileModal({ open, onClose, me }: Props) {
  const { mutate, isPending, error } = useUpdateUser();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: me?.name || "",
      surname: me?.surname || "",
      middleName: me?.middleName || null,
      phone: me?.phone || "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: me?.name || "",
      surname: me?.surname || "",
      middleName: me?.middleName || null,
      phone: (me?.phone || "").replace(/\D/g, ""),
    });
  }, [open, me, reset]);

  const onSubmit = (v: FormValues) => {
    mutate(
      {
        name: v.name?.trim(),
        surname: v.surname?.trim(),
        middleName: v.middleName?.trim?.() || null,
        phone: (v.phone || "").replace(/\D/g, ""),
      },
      {
        onSuccess: () => {
          // кэш инвалидируется в хуке; модалку закрываем
          onClose();
        },
      }
    );
  };

  // опционально: вытаскивать сообщение с сервера при ошибке
  const errorText =
    (error as any)?.response?.data?.message?.ru ||
    (error as any)?.response?.data?.message?.uz ||
    (error as any)?.message ||
    null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Основная информация"
      width={760}
      closeOnOverlay
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gap: 12 }}>
          <CustomInput
            control={control}
            name="surname"
            label="Фамилия"
            placeholder="Иванов"
            rules={{ required: "Заполните поле" }}
          />
          <CustomInput
            control={control}
            name="name"
            label="Имя"
            placeholder="Иван"
            rules={{ required: "Заполните поле" }}
          />
          <CustomInput
            control={control}
            name="middleName"
            label="Отчество"
            placeholder="(необязательно)"
          />
          <CustomInput
            control={control}
            name="phone"
            label="Телефон"
            type="phone"
            placeholder="+998 (__) ___-__-__"
            rules={{
              required: "Укажите телефон",
              validate: (v: string) =>
                /^\d{12}$/.test((v || "").replace(/\D/g, "")) ||
                "Введите полный номер",
            }}
          />
        </div>

        <ModalFooter>
          <GhostBtn
            type="button"
            onClick={onClose}
            disabled={isPending}
            style={{ height: 40 }}
          >
            Отмена
          </GhostBtn>
          <PrimaryBtn
            as="button"
            type="submit"
            disabled={isPending}
            style={{ height: 40 }}
          >
            {isPending ? "Сохранение..." : "Сохранить"}
          </PrimaryBtn>
        </ModalFooter>

        {errorText ? (
          <div style={{ color: "#b91c1c", marginTop: 8 }}>{errorText}</div>
        ) : null}
      </form>
    </Modal>
  );
}
