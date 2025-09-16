import { api } from "../../lib/axios";
import { SendOtpDto, VerifyOtpDto, VerifyOtpResp } from "./types";

export const sendOtp = (dto: SendOtpDto) => api.post("/auth/send-otp", dto);
export const verifyOtp = (dto: VerifyOtpDto) =>
  api.post<VerifyOtpResp>("/auth/verify-otp", dto);
