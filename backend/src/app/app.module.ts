import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersSectionModule } from './users-section/module';
import { PrismaModule } from 'src/lib/prisma';
import { BookingsSectionModule } from './bookings-section/module';
import { ApartmentsSectionModule } from './apartments-section/module';
import { EventsSectionModule } from './events-section/module';
import { TransactionsSectionModule } from './transactions-section/module';
import { FilesModule } from 'src/lib/files';

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
})
export class AppModule { }
