import type { SessionsFilters } from "@shared/src";
import {
  type UseFiltersOptions,
  useFilters,
} from "@/hooks/admin/actions/useModelFilters/lib";

const DEFAULT_FILTERS: SessionsFilters = {
  user_id: "",
  is_active: undefined,
  ip_address: "",
  user_agent: "",
  skip: 0,
  take: 10,
};

/**
 * Хук для управления фильтрами сессий с дебонсом
 */
export const useSessionsFilters = (
  options?: Partial<UseFiltersOptions<SessionsFilters>>,
) => {
  return useFilters<SessionsFilters>({
    default_filters: options?.default_filters || DEFAULT_FILTERS,
    debounce_settings: {
      fields: ["ip_address", "user_agent"],
      delay: 1000,
    },
    permanent_fields: options?.permanent_fields,
  });
};
