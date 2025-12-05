import type { GETTABLE_NAMES } from "@shared/src";
import { usePId, useQPId } from "@/hooks/common/useId";
import { useModel } from "./useModel";

export const usePFind = <M extends GETTABLE_NAMES>(model: M) =>
  useModel(model).find(usePId());

export const useFindModelByParamId = usePFind;

export const useQPFind = <M extends GETTABLE_NAMES>(model: M) =>
  useModel(model).find(useQPId());

export const useFindModelByQueryParamId = useQPFind;
