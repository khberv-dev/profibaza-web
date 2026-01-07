import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

// ===== Types (те же, что и для LEGAL) =====
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

export type InvestorOffer = {
  id: string;
  status: "NEW" | "VIEWED" | "ACCEPTED" | "REJECTED";
  message: string | null;
  vacancy: Vacancy;
  workerProfession: WorkerProfession;
  createdAt: string;
};

type ListResponse<T> = { ok: boolean; data: T };

// ===== API paths (если у тебя другие — поменяй тут) =====
const INVESTOR_OFFERS_BASE = "/investor"; // <- если будет иначе, меняешь одну строку

export const INVESTOR_OFFERS_QK = ["investor", "offers"] as const;

export async function getInvestorOffers(signal?: AbortSignal): Promise<InvestorOffer[]> {
  const { data } = await api.get<ListResponse<InvestorOffer[]>>(
    `${INVESTOR_OFFERS_BASE}/offers`,
    { signal }
  );
  return data?.ok ? data.data : [];
}

export function useInvestorOffers() {
  return useQuery({
    queryKey: INVESTOR_OFFERS_QK,
    queryFn: ({ signal }) => getInvestorOffers(signal),
    staleTime: 60_000,
  });
}

export async function acceptInvestorOffer(offerId: string, message: string) {
  const { data } = await api.post(`${INVESTOR_OFFERS_BASE}/accept-offer/${offerId}`, {
    message,
  });
  return data;
}

export async function declineInvestorOffer(offerId: string, message: string) {
  const { data } = await api.post(`${INVESTOR_OFFERS_BASE}/decline-offer/${offerId}`, {
    message,
  });
  return data;
}
