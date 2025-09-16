export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

export type ApiListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type Pagination = {
  page?: number;
  pageSize?: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type User = {
  id: string;
  role: "client_person" | "client_company" | "worker_grad" | "worker_pro";
  name: string;
  surname?: string;
  middleName?: string;
  phone: string;
  avatarUrl?: string;
};
