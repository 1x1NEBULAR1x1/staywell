import { AdditionalOptionsFilters } from "@shared/src/types/bookings-section";
import { ToDecimal, BaseFiltersDto, ToString } from "src/lib/common";
import { AdditionalOption } from "@shared/src/database";


export class AdditionalOptionsFiltersDto extends BaseFiltersDto<AdditionalOption> implements AdditionalOptionsFilters {
  @ToString({ required: false, description: "Name", example: "Breakfast", min: 3, max: 1024 })
  name?: string;

  @ToDecimal({ required: false, description: "Minimum price", example: 100, precision: 2, positive: true })
  min_price?: number;

  @ToDecimal({ required: false, description: "Maximum price", example: 100, precision: 2, positive: true })
  max_price?: number;
}
