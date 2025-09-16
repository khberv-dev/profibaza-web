import { useMutation } from "@tanstack/react-query";
import {
  authApi,
  RegisterDto,
  type LoginDto,
} from "../../shared/endpoints/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });

export const useRegister = () =>
  useMutation({ mutationFn: (dto: RegisterDto) => authApi.register(dto) });
