import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
  Transaction,
} from '@shared/src/database';
import { ToDecimal, BaseFiltersDto, ToUUID, ToString } from 'src/lib/common';
import { TransactionsFilters } from '@shared/src/types/transactions-section/dto.types';
import { ToEnum } from 'src/lib/common';

export class TransactionsFiltersDto
  extends BaseFiltersDto<Transaction>
  implements TransactionsFilters {
  @ToUUID({
    required: false,
    description: 'User ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  user_id?: string;

  @ToString({
    required: false,
    description: 'Transaction description',
    example: 'Payment for booking',
    min: 1,
    max: 4096,
  })
  description?: string;

  @ToDecimal({
    required: false,
    description: 'Minimum transaction amount',
    example: 100,
    precision: 2,
  })
  min_amount?: number;

  @ToDecimal({
    required: false,
    description: 'Maximum transaction amount',
    example: 100,
    precision: 2,
  })
  max_amount?: number;

  @ToEnum({
    required: false,
    description: 'Payment method',
    example: PaymentMethod.CARD,
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
  })
  payment_method?: PaymentMethod;

  @ToEnum({
    required: false,
    description: 'Transaction status',
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
    enumName: 'TransactionStatus',
  })
  transaction_status?: TransactionStatus = TransactionStatus.PENDING;

  @ToEnum({
    required: false,
    description: 'Transaction type',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
    enumName: 'TransactionType',
  })
  transaction_type?: TransactionType = TransactionType.PAYMENT;

  @ToUUID({
    required: false,
    description: 'Card details ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  card_details_id?: string;

  @ToUUID({
    required: false,
    description: 'Transfer details ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  transfer_details_id?: string;
}
