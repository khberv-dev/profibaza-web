// src/shared/modules/worker-offers.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export type WorkerOffer = {
  id: string;
  status: "NEW" | "VIEWED" | "ACCEPTED" | "REJECTED";
  message: string | null;
  createdAt: string;
  updatedAt: string;
  vacancy: {
    title: string;
    description?: string;
    salary?: number;
    legal?: { name?: string };
  };
  workerProfession: {
    profession: {
      nameUz: string;
      nameRu: string;
    };
  };
};

type ListResponse<T> = { ok: boolean; data: T };

export const WORKER_OFFERS_QK = ["worker", "offers"] as const;

export async function getWorkerOffers(
  signal?: AbortSignal
): Promise<WorkerOffer[]> {
  const { data } = await api.get<ListResponse<WorkerOffer[]>>(
    "/worker/offers",
    { signal }
  );
  if (!data?.ok || !Array.isArray(data.data)) return [];
  return data.data;
}

export function useWorkerOffers() {
  return useQuery({
    queryKey: WORKER_OFFERS_QK,
    queryFn: ({ signal }) => getWorkerOffers(signal),
    staleTime: 60_000,
  });
}
