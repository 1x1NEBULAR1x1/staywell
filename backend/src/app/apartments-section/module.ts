import { Module } from "@nestjs/common";
import { ApartmentsModule } from "./apartments/module";
import { ApartmentBedsModule } from "./apartment-beds/module";
import { AmenitiesModule } from "./amenities/module";
import { BedTypesModule } from "./bed-types/module";
import { BookingVariantsModule } from "../bookings-section/booking-variants/module";
import { ApartmentImagesModule } from "./apartment-images/module";
import { ApartmentAmenitiesModule } from "./apartment-amenities/module";
import { ReviewsModule } from "./reviews/module";

@Module({
  imports: [
    ApartmentsModule,
    ApartmentBedsModule,
    AmenitiesModule,
    BedTypesModule,
    BookingVariantsModule,
    ApartmentImagesModule,
    ApartmentAmenitiesModule,
    ReviewsModule,
  ],
  exports: [
    ApartmentsModule,
    ApartmentBedsModule,
    AmenitiesModule,
    BedTypesModule,
    BookingVariantsModule,
    ApartmentImagesModule,
    ApartmentAmenitiesModule,
    ReviewsModule,
  ],
})
export class ApartmentsSectionModule { }
