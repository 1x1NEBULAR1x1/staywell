import { Module } from '@nestjs/common';
import { ApartmentBedsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [ApartmentBedsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class ApartmentBedsModule {}
