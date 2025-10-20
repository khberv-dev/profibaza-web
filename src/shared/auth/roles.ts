// src/shared/auth/roles.ts
export type UserRole = "CLIENT" | "WORKER" | "LEGAL" | "ADMIN";
export const ALL_ROLES: UserRole[] = ["CLIENT", "WORKER", "LEGAL", "ADMIN"] as const;
