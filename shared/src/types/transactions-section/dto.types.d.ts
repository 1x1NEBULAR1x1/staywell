import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { CardDetail, PaymentMethod, Transaction, TransactionStatus, TransactionType, TransferDetail } from "../../database";
export type TransferDetailsFilters = BaseFiltersOptions<TransferDetail> & {
    user_id?: string;
    bank_name?: string;
    account_number?: string;
    swift?: string;
    payer_name?: string;
    min_amount?: number;
    max_amount?: number;
};
export type CreateTransferDetail = CreativeOmit<TransferDetail>;
export type UpdateTransferDetail = Partial<CreateTransferDetail>;
export type TransactionsFilters = BaseFiltersOptions<Transaction> & {
    user_id?: string;
    payment_method?: PaymentMethod;
    transaction_status?: TransactionStatus;
    transaction_type?: TransactionType;
    card_details_id?: string;
    transfer_details_id?: string;
    min_amount?: number;
    max_amount?: number;
};
export type CreateTransaction = Omit<CreativeOmit<Transaction>, 'transaction_status' | 'card_details_id' | 'transfer_details_id'> & {
    card_details_id?: string;
    transfer_details_id?: string;
};
export type UpdateTransaction = Partial<CreateTransaction> & {
    transaction_status?: TransactionStatus;
};
export type CardDetailsFilters = BaseFiltersOptions<CardDetail> & {
    user_id?: string;
    number?: string;
    holder?: string;
    token?: string;
    start_date?: Date;
    end_date?: Date;
};
export type CreateCardDetail = CreativeOmit<CardDetail>;
export type UpdateCardDetail = Partial<CreateCardDetail>;
