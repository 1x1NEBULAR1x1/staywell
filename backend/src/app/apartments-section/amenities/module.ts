import { Module } from '@nestjs/common';
import { AmenitiesController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [AmenitiesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class AmenitiesModule {}
