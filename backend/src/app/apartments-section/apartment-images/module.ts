import { Module } from '@nestjs/common';
import { ApartmentImagesController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [ApartmentImagesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class ApartmentImagesModule {}
