import { useQuery } from '@tanstack/react-query';
import { cidService } from '../services/cid';


export const CID_KEYS = {
  all: ["cids"] as const,
};

export function useCidAll() {
  return useQuery({
    queryKey: CID_KEYS.all,
    queryFn: cidService.getAll,
    staleTime: Infinity,
  });
}