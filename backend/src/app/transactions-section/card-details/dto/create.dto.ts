import { ToInt, ToString, ToUUID } from "src/lib/common";
import { CreateCardDetail } from "@shared/src/types/transactions-section/dto.types";

export class CreateCardDetailDto implements CreateCardDetail {
  @ToUUID({ required: true, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id!: string;

  @ToString({ required: true, description: "Card number", example: "4111111111111111", matches: /^[0-9]{16}$/, min: 16, max: 16 })
  number!: string;

  @ToInt({ required: true, min: 1, max: 12, description: "Expiration month (1-12)", example: new Date().getMonth() })
  expiry_month!: number;

  @ToInt({ required: true, min: new Date().getFullYear(), max: new Date().getFullYear() + 100, description: "Expiration year", example: new Date().getFullYear() })
  expiry_year!: number;

  @ToString({ required: true, description: "Card holder name", example: "John Doe", min: 3, max: 255 })
  holder!: string;

  @ToString({ required: true, description: "Card token (for payment gateway)", example: "tok_1J8A9L2eZvKYlo2CYVx2rFxH", min: 3, max: 255 })
  token!: string;
}
