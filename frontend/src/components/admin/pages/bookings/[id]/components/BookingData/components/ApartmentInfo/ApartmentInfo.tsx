import classes from './ApartmentInfo.module.scss';
import { Apartment } from '@shared/src';
import { Home, MapPin, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

export const ApartmentInfo = ({ apartment }: { apartment: Apartment }) => (
  <div className={classes.apartment_info}>
    <div className={classes.header}>
      <Home className={classes.header_icon} />
      <h3 className={classes.title}>Apartment Information</h3>
      <Link href={`/admin/apartments/${apartment.id}`} className={classes.link_button}>
        <ExternalLink className={classes.link_icon} />
        View Apartment
      </Link>
    </div>

    <div className={classes.content}>
      <div className={classes.apartment_details}>
        <div className={classes.apartment_header}>
          {apartment.image && (
            <div className={classes.apartment_image}>
              <Image
                src={apartment.image}
                alt={apartment.name || `Apartment #${apartment.number}`}
                width={120}
                height={80}
                className={classes.image}
              />
            </div>
          )}
          <div className={classes.apartment_name}>
            {apartment.name || `Apartment #${apartment.number}`}
          </div>
        </div>

        <div className={classes.apartment_meta}>
          <div className={classes.meta_item}>
            <MapPin className={classes.meta_icon} />
            <span>Floor {apartment.floor}, Room {apartment.number}</span>
          </div>

          <div className={classes.meta_item}>
            <Users className={classes.meta_icon} />
            <span>up to {apartment.max_capacity} guests</span>
          </div>
        </div>

        <div className={classes.apartment_features}>
          <div className={classes.feature_item}>
            <span className={classes.feature_label}>Type:</span>
            <span className={classes.feature_value}>
              {getApartmentTypeText(apartment.type)}
            </span>
          </div>

          <div className={classes.feature_item}>
            <span className={classes.feature_label}>Rooms:</span>
            <span className={classes.feature_value}>{apartment.rooms_count}</span>
          </div>

          <div className={classes.feature_item}>
            <span className={classes.feature_label}>Deposit:</span>
            <span className={classes.feature_value}>${apartment.deposit}</span>
          </div>
        </div>

        <div className={classes.apartment_status}>
          <div className={classes.status_badges}>
            <span
              className={`${classes.status_badge} ${apartment.is_available ? classes.available : classes.unavailable}`}
            >
              {apartment.is_available ? 'Available' : 'Unavailable'}
            </span>

            {apartment.is_smoking && (
              <span className={`${classes.status_badge} ${classes.smoking}`}>
                Smoking Allowed
              </span>
            )}

            {apartment.is_pet_friendly && (
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
