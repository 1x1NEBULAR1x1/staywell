'use client';
import Image from 'next/image';
import { ExtendedApartment } from '@shared/src';
import { getImageUrl } from '@/lib/api/utils/image-url';
import classes from './ApartmentInfo.module.scss';
import Link from 'next/link';

export const ApartmentInfo = ({ apartment }: { apartment: ExtendedApartment }) => {

  const price = apartment.booking_variants?.[0]?.price || 0;

  return (
    <div className={classes.apartment_info}>
      <div className={classes.main_section}>
        <div className={classes.info_content}>
          <h3 className={classes.section_title}>About the place</h3>
          {apartment.description && <p className={classes.description}>{apartment.description}</p>}
        </div>
        <div className={classes.booking_section}>
          <div className={classes.booking_card}>
            <h3 className={classes.booking_title}>Start Booking</h3>

            <div className={classes.price_section}>
              <span className={classes.price}>${price}</span>
              <span className={classes.price_period}>per Day</span>
            </div>

            <Link href={`/apartments/${apartment.id}/booking/dates`} className={classes.book_button}>
              Book Now
            </Link>
          </div>
        </div>
      </div>
      {apartment.apartment_amenities && apartment.apartment_amenities.length > 0 && (
        <div className={classes.amenities_section}>
          <div className={classes.amenities_grid}>
            {apartment.apartment_amenities.map((apartment_amenity) => {
              return (
                <div key={apartment_amenity.amenity.id} className={classes.amenity}>
                  <Image
                    src={getImageUrl(apartment_amenity.amenity.image) || ''}
                    alt={apartment_amenity.amenity.name}
                    width={24}
                    height={24}
                    className={classes.amenity_image}
                  />
                  <span className={classes.amenity_name}>{apartment_amenity.amenity.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
