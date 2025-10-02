import { IsString, IsUUID } from "class-validator";
import { CreateTransferDetail } from "@shared/src/types/transactions-section/dto.types";
import { ToString, ToUUID } from "src/lib/common";


export class CreateTransferDetailDto implements CreateTransferDetail {
  @ToString({ required: true, description: "Bank name", example: "PKO Bank", min: 3, max: 2048 })
  bank_name!: string;

  @ToString({ required: true, description: "Account number", example: "40817810099910004312", min: 3, max: 128 })
  account_number!: string;

  @ToString({ required: true, description: "SWIFT code of the bank", example: "SABRRUMM", min: 8, max: 32 })
  swift!: string;

  @ToString({ required: true, description: "Payer name", example: "John Doe", min: 3, max: 1024 })
  payer_name!: string;

  @ToUUID({ required: true, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id!: string;
}
