import { useAccount as useAccountContext, type AccountContextType } from "@/components/common/providers/AccountContext";
import { type UseAuthReturn, useAuth } from "./useAuth";

export const useAccount = (): AccountContextType & UseAuthReturn => {
  const account = useAccountContext();
  const auth = useAuth();
  return { ...account, ...auth };
}