import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export type Experience = {
  id: string;
  startedAt: number;
  endedAt: number;
  jobPlace: string;
  jobDescription: string;
};

export type WorkerUser = {
  name: string;
  surname: string;
  middleName?: string;
  avatar?: string;
};

export type Profession = {
  nameUz: string;
  nameRu: string;
};

export type WorkerProfession = {
  id: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  hasTeam: boolean;
  teamMemberCount: number;
  readyForHugeProject: boolean;
  inventory: string;
  competitions: string;
  jobType: string;
  experience: Experience[];
  profession: Profession;
  worker: { user: WorkerUser };
};

export type Vacancy = {
  title: string;
  description: string;
  salary: number;
  legal: { name: string };
};

export type LegalOffer = {
  id: string;
  status: "NEW" | "VIEWED" | "ACCEPTED" | "REJECTED";
  message: string | null;
  vacancy: Vacancy;
  workerProfession: WorkerProfession;
  createdAt: string;
};

type ListResponse<T> = { ok: boolean; data: T };

export const LEGAL_OFFERS_QK = ["legal", "offers"] as const;

export async function getLegalOffers(
  signal?: AbortSignal
): Promise<LegalOffer[]> {
  const { data } = await api.get<ListResponse<LegalOffer[]>>("/legal/offers", {
    signal,
  });
  return data?.ok ? data.data : [];
}

export function useLegalOffers() {
  return useQuery({
    queryKey: LEGAL_OFFERS_QK,
    queryFn: ({ signal }) => getLegalOffers(signal),
    staleTime: 60_000,
  });
}

export async function acceptLegalOffer(offerId: string, message: string) {
  const { data } = await api.post(`/legal/accept-offer/${offerId}`, {
    message,
  });
  return data;
}

export async function declineLegalOffer(offerId: string, message: string) {
  const { data } = await api.post(`/legal/decline-offer/${offerId}`, {
    message,
  });
  return data;
}
