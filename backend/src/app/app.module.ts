import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersSectionModule } from './users-section/module';
import { PrismaModule } from 'src/lib/prisma';
import { BookingsSectionModule } from './bookings-section/module';
import { ApartmentsSectionModule } from './apartments-section/module';
import { EventsSectionModule } from './events-section/module';
import { TransactionsSectionModule } from './transactions-section/module';
import { FilesModule } from 'src/lib/files';
import { UserActivityInterceptor, UserActivityService } from 'src/lib/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FilesModule,
    PrismaModule,
    UsersSectionModule,
    ApartmentsSectionModule,
    BookingsSectionModule,
    EventsSectionModule,
    TransactionsSectionModule,
  ],
  providers: [
    UserActivityService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserActivityInterceptor,
    },
  ],
})
export class AppModule { }
