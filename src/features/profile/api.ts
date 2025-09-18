import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../shared/endpoints/user";
import { USER_QUERY_KEY } from "../../shared/modules/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.update,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_QUERY_KEY, updatedUser);
    },
  });
};
