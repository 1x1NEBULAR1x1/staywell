import { Module } from '@nestjs/common';
import { TransactionsController } from './controller';
import { ListService, CrudService } from './services';

@Module({
  controllers: [TransactionsController],
  providers: [ListService, CrudService],
  exports: [ListService, CrudService],
})
export class TransactionsModule {}
