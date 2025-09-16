import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { sendOtp, verifyOtp } from "./api";

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtp,
    onSuccess: () => notifications.show({ message: "Код отправлен" }),
    onError: (e: any) =>
      notifications.show({ color: "red", message: e?.response?.data?.message || "Ошибка" }),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: ({ data }) => {
      localStorage.setItem("pb_token", data.token);
      localStorage.setItem("pb_user", JSON.stringify(data.user));
      notifications.show({ message: "Вход выполнен" });
    },
    onError: (e: any) =>
      notifications.show({ color: "red", message: e?.response?.data?.message || "Неверный код" }),
  });
}
