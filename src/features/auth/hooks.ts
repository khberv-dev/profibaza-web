import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { sendOtp, verifyOtp } from "./api";
import { authApi, LoginDto, RegisterDto } from "../../shared/endpoints/auth";

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




export const useLogin = () =>
  useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
  });