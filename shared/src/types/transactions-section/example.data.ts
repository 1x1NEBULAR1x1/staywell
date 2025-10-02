import { CardDetail, TransferDetail, Transaction, TransactionType, TransactionStatus, PaymentMethod } from "../../database";
import { BaseListResult } from "../../common";

export const example_card_detail: CardDetail = {
  id: "1",
  number: "1234567890123456",
  expiry_month: 12,
  expiry_year: 2025,
  holder: "John Doe",
  token: "tok_1J8A9L2eZvKYlo2CYVx2rFxH",
  user_id: "1",
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_card_details_list_result: BaseListResult<CardDetail> = {
  items: [example_card_detail],
  total: 1,
  take: 10,
  skip: 0,
};

export const example_transaction: Transaction = {
  id: "UUID",
  amount: 100,
  user_id: "UUID",
  created: new Date(),
  updated: new Date(),
  description: "Payment for booking",
  card_details_id: "UUID",
  transfer_details_id: "UUID",
  transaction_type: TransactionType.PAYMENT,
  transaction_status: TransactionStatus.PENDING,
  payment_method: PaymentMethod.CARD,
};

export const example_transactions_list_result: BaseListResult<Transaction> = {
  items: [example_transaction],
  total: 1,
  skip: 0,
  take: 10,
};


export const example_transfer_detail: TransferDetail = {
  id: "UUID",
  bank_name: "PKO Bank",
  account_number: "1234567890",
  swift: "1234567890",
  payer_name: "John Doe",
  user_id: "UUID",
  created: new Date(),
  updated: new Date(),
};

export const example_transfer_details_list_result: BaseListResult<TransferDetail> = {
  items: [example_transfer_detail],
  total: 1,
  skip: 0,
  take: 10,
};
