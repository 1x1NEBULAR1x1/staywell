'use client';

import classes from './ApartmentInfo.module.scss';
import { Home, MapPin, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useModel } from '@/hooks/admin/queries';
import { usePId } from '@/hooks/common/useId';

const getApartmentTypeText = (type: string) => {
  const typeMap = {
    BUDGET: 'Budget',
    STANDARD: 'Standard',
    EXCLUSIVE: 'Exclusive',
    SUPERIOR: 'Superior',
    LUXURY: 'Luxury'
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

export const ApartmentInfo = () => {
  const { data: reservation } = useModel('RESERVATION').find(usePId());

  return !!reservation && (
    <div className={classes.apartment_info}>
      <div className={classes.header}>
        <Home className={classes.header_icon} />
        <h3 className={classes.title}>Apartment Information</h3>
        <Link href={`/admin/apartments/${reservation.apartment.id}`} className={classes.link_button}>
          <ExternalLink className={classes.link_icon} />
          View Apartment
        </Link>
      </div>

      <div className={classes.content}>
        <div className={classes.apartment_details}>
          <div className={classes.apartment_header}>
            {reservation.apartment.image && (
              <div className={classes.apartment_image}>
                <Image
                  src={reservation.apartment.image}
                  alt={reservation.apartment.name || `Apartment #${reservation.apartment.number}`}
                  width={120}
                  height={80}
                  className={classes.image}
                />
              </div>
            )}
            <div className={classes.apartment_name}>
              {reservation.apartment.name || `Apartment #${reservation.apartment.number}`}
            </div>
          </div>

          <div className={classes.apartment_meta}>
            <div className={classes.meta_item}>
              <MapPin className={classes.meta_icon} />
              <span>Floor {reservation.apartment.floor}, Room {reservation.apartment.number}</span>
            </div>

            <div className={classes.meta_item}>
              <Users className={classes.meta_icon} />
              <span>up to {reservation.apartment.max_capacity} guests</span>
            </div>
          </div>

          <div className={classes.apartment_features}>
            <div className={classes.feature_item}>
              <span className={classes.feature_label}>Type:</span>
              <span className={classes.feature_value}>
                {getApartmentTypeText(reservation.apartment.type)}
              </span>
            </div>

            <div className={classes.feature_item}>
              <span className={classes.feature_label}>Rooms:</span>
              <span className={classes.feature_value}>{reservation.apartment.rooms_count}</span>
            </div>

            <div className={classes.feature_item}>
              <span className={classes.feature_label}>Deposit:</span>
              <span className={classes.feature_value}>${reservation.apartment.deposit}</span>
            </div>
          </div>

          <div className={classes.apartment_status}>
            <div className={classes.status_badges}>
              <span
                className={`${classes.status_badge} ${reservation.apartment.is_available ? classes.available : classes.unavailable}`}
              >
                {reservation.apartment.is_available ? 'Available' : 'Unavailable'}
              </span>

              {reservation.apartment.is_smoking && (
                <span className={`${classes.status_badge} ${classes.smoking}`}>
                  Smoking Allowed
                </span>
              )}

              {reservation.apartment.is_pet_friendly && (
                <span className={`${classes.status_badge} ${classes.pet_friendly}`}>
                  Pet Friendly
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
