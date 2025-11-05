'use client';

import { ExtendedApartment } from '@shared/src';
import { ApartmentTab } from '../../Apartment';
import classes from './ApartmentSidebar.module.scss';
import { Home, Star, Bed, Calendar, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ApartmentSidebarProps {
  apartment: ExtendedApartment;
  activeTab: ApartmentTab;
  setActiveTab: (tab: ApartmentTab) => void;
}

const navItems = [
  { id: 'general', label: 'General Info', icon: Home },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'beds', label: 'Beds', icon: Bed },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'booking_variants', label: 'Booking Variants', icon: Calendar },
  { id: 'reviews', label: 'Reviews', icon: Star },
] as const;


export const ApartmentSidebar = ({ apartment, activeTab, setActiveTab }: ApartmentSidebarProps) => {
  const mainImage = apartment.images?.[0]?.image || apartment.image || '/common/default-apartment.png';
  const reviewsCount = apartment.reviews?.length || 0;

  return (
    <div className={classes.sidebar}>
      <div className={classes.apartment_info}>
        <div className={classes.image_container}>
          <Image
            src={mainImage}
            alt={apartment.name || 'Apartment'}
            width={260}
            height={180}
            className={classes.main_image}
          />
          <div className={`${classes.status_badge} ${apartment.is_available ? classes.available : classes.unavailable}`}>
            {apartment.is_available ? 'Available' : 'Unavailable'}
          </div>
        </div>

        <div className={classes.info_content}>
          <h2 className={classes.apartment_name}>{apartment.name || `Room ${apartment.number}`}</h2>
          <p className={classes.apartment_location}>
            Floor {apartment.floor}, Room {apartment.number}
          </p>

          <div className={classes.stats_grid}>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{apartment.capacity}</span>
              <span className={classes.stat_label}>Guests</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{apartment.rating.toFixed(1)}</span>
              <span className={classes.stat_label}>Rating</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>{reviewsCount}</span>
              <span className={classes.stat_label}>Reviews</span>
            </div>
            <div className={classes.stat_item}>
              <span className={classes.stat_value}>${apartment.price}</span>
              <span className={classes.stat_label}>From</span>
            </div>
          </div>
        </div>
      </div>

      <nav className={classes.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${classes.nav_button} ${activeTab === item.id ? classes.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className={classes.nav_icon} />
              <span className={classes.nav_label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

