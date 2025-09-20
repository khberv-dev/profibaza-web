// src/shared/modules/user/avatar.ts
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvatarBlobApi, uploadAvatarApi } from "../endpoints/user";

export const AVATAR_QUERY_KEY = ["user", "avatar"];

// получение текущей аватарки
export const useAvatar = () => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const q = useQuery({
    queryKey: AVATAR_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getAvatarBlobApi();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // нет аватарки — просто null
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!q.data) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(q.data);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [q.data]);

  return { ...q, url: objectUrl };
};

// загрузка новой аватарки
export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatarApi,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: AVATAR_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
