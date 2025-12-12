// src/shared/auth/roles.ts
export type UserRole = "CLIENT" | "WORKER" | "LEGAL" | "ADMIN" | "INVESTOR";
export const ALL_ROLES: UserRole[] = ["CLIENT", "WORKER", "LEGAL", "ADMIN", "INVESTOR"] as const;
