"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_transfer_details_list_result = exports.example_transfer_detail = exports.example_transactions_list_result = exports.example_transaction = exports.example_card_details_list_result = exports.example_card_detail = void 0;
const database_1 = require("../../database");
exports.example_card_detail = {
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
exports.example_card_details_list_result = {
    items: [exports.example_card_detail],
    total: 1,
    take: 10,
    skip: 0,
};
exports.example_transaction = {
    id: "UUID",
    amount: 100,
    user_id: "UUID",
    created: new Date(),
    updated: new Date(),
    description: "Payment for booking",
    card_details_id: "UUID",
    transfer_details_id: "UUID",
    transaction_type: database_1.TransactionType.PAYMENT,
    transaction_status: database_1.TransactionStatus.PENDING,
    payment_method: database_1.PaymentMethod.CARD,
};
exports.example_transactions_list_result = {
    items: [exports.example_transaction],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_transfer_detail = {
    id: "UUID",
    bank_name: "PKO Bank",
    account_number: "1234567890",
    swift: "1234567890",
    payer_name: "John Doe",
    user_id: "UUID",
    created: new Date(),
    updated: new Date(),
};
exports.example_transfer_details_list_result = {
    items: [exports.example_transfer_detail],
    total: 1,
    skip: 0,
    take: 10,
};
