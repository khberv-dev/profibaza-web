export type Role =
  | "client_person"
  | "client_company"
  | "exec_graduate"
  | "exec_master";

export interface User {
  id: number;
  name: string;
  phone: string;
  role: Role;
}

export interface SendOtpDto { phone: string; }
export interface VerifyOtpDto { phone: string; code: string; }
export interface VerifyOtpResp { token: string; user: User; }
