import { ToDate, BaseFiltersDto, ToString, ToUUID } from "src/lib/common";
import { CardDetail } from "@shared/src/database";
import { CardDetailsFilters } from "@shared/src/types/transactions-section/dto.types";


export class CardDetailsFiltersDto extends BaseFiltersDto<CardDetail> implements CardDetailsFilters {
  @ToUUID({ required: false, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id?: string;

  @ToString({ required: false, description: "Card holder name (partial match)", example: "John Doe", min: 3, max: 255 })
  holder?: string;

  @ToString({ required: false, description: "Card number", example: "4111111111111111", matches: /^[0-9]{16}$/, min: 16, max: 16 })
  number?: string;

  @ToDate({ required: false, description: "Creation date start", example: "2023-12-15T18:00:00.000Z" })
  start?: Date;

  @ToDate({ required: false, description: "Creation date end", example: "2023-12-15T21:00:00.000Z" })
  end?: Date;

  @ToString({ required: false, description: "Card token (for payment gateway)", example: "tok_1J8A9L2eZvKYlo2CYVx2rFxH", min: 3, max: 255 })
  token?: string;
}
