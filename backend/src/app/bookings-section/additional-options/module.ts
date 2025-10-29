import { Module } from '@nestjs/common';
import { AdditionalOptionsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [AdditionalOptionsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class AdditionalOptionsModule {}
