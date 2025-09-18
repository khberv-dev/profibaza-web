import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UpdateUserDto } from "../endpoints/user";
import { USER_QUERY_KEY } from "./user";

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateUserDto) => userApi.update(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};
