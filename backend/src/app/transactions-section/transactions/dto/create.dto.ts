import { TransactionType, PaymentMethod } from "@shared/src/database";
import { CreateTransaction } from "@shared/src/types/transactions-section/dto.types";
import { ToDecimal, ToEnum, ToString, ToUUID } from "src/lib/common";


export class CreateTransactionDto implements CreateTransaction {
  @ToDecimal({ required: true, description: "Transaction amount", example: 1500.5, min: 0, precision: 2 })
  amount!: number;

  @ToUUID({ required: true, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id!: string;

  @ToString({ required: true, description: "Transaction description", example: "Payment for booking", min: 1, max: 4096 })
  description!: string;

  @ToUUID({ required: false, description: "ID of card details (optional)", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  card_details_id?: string;

  @ToUUID({ required: false, description: "ID of transfer details (optional)", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  transfer_details_id?: string;

  @ToEnum({ required: true, description: "Transaction type", example: TransactionType.PAYMENT, enum: TransactionType })
  transaction_type!: TransactionType;

  @ToEnum({ required: true, description: "Payment method", example: PaymentMethod.CARD, enum: PaymentMethod })
  payment_method!: PaymentMethod;
}
