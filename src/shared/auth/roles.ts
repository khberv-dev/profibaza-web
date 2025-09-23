// src/shared/auth/roles.ts
export type UserRole = "CLIENT" | "WORKER" | "LEGAL";
export const ALL_ROLES: UserRole[] = ["CLIENT", "WORKER", "LEGAL"] as const;
