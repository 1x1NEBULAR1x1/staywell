import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersSectionModule } from "./app/users-section/module";
import { PrismaModule } from "src/lib/prisma";
import { BookingsSectionModule } from "./app/bookings-section/module";
import { ApartmentsSectionModule } from "./app/apartments-section/module";
import { EventsSectionModule } from "./app/events-section/module";
import { TransactionsSectionModule } from "./app/transactions-section/module";
import { FilesModule } from "src/lib/files";

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
