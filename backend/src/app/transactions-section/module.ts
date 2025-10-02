import { Module } from "@nestjs/common";
import { TransactionsModule } from "./transactions/module";
import { CardDetailsModule } from "./card-details/module";
import { TransferDetailsModule } from "./transfer-details/module";

@Module({
  imports: [TransactionsModule, CardDetailsModule, TransferDetailsModule],
  exports: [TransactionsModule, CardDetailsModule, TransferDetailsModule],
})
export class TransactionsSectionModule { }
