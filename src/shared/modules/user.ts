// src/shared/hooks/useMe.ts (как у тебя)
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../endpoints/user";
export const USER_QUERY_KEY = ["user", "me"];
export const useMe = () =>
  useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: userApi.me,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
