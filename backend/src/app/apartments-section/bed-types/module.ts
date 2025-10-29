import { Module } from '@nestjs/common';
import { BedTypesController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [BedTypesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class BedTypesModule {}
