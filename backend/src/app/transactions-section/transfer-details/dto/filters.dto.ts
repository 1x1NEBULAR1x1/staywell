import { TransferDetail } from "@shared/src/database";
import { TransferDetailsFilters } from "@shared/src/types/transactions-section/dto.types";
import { ToDate, BaseFiltersDto, ToUUID, ToString } from "src/lib/common";


export class TransferDetailsFiltersDto extends BaseFiltersDto<TransferDetail> implements TransferDetailsFilters {
  @ToUUID({ required: false, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id?: string;

  @ToString({ required: false, description: "Bank name", example: "PKO Bank", min: 3, max: 2048 })
  bank_name?: string;

  @ToString({ required: false, description: "Account number (partial match)", example: "40817810099910004312", min: 3, max: 128 })
  account_number?: string;

  @ToString({ required: false, description: "Bank SWIFT code", example: "SABRRUMM", min: 8, max: 32 })
  swift?: string;

  @ToString({ required: false, description: "Payer name", example: "John Doe", min: 3, max: 1024 })
  payer_name?: string;

  @ToDate({ required: false, description: "Creation date start", example: "2023-12-15T18:00:00.000Z" })
  start?: Date;

  @ToDate({ required: false, description: "Creation date end", example: "2023-12-15T21:00:00.000Z" })
  end?: Date;
}
