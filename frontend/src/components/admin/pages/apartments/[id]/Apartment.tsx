'use client';

import { useState } from 'react';
import { ExtendedApartment } from '@shared/src/types';
import { useModel } from '@/hooks/admin/queries/useModel';
import { AdminPage } from '@/components/admin/common/AdminPage';
import { ApartmentSidebar, GeneralTab, GalleryTab, BedsTab, AmenitiesTab, BookingVariantsTab, ReviewsTab } from './components';
import classes from './Apartment.module.scss';
import { usePId } from '@/hooks/common/useId';

export type ApartmentTab = 'general' | 'gallery' | 'beds' | 'amenities' | 'booking_variants' | 'reviews';

export const Apartment = () => {
  const { data: apartment } = useModel('APARTMENT').find(usePId());
  const [activeTab, setActiveTab] = useState<ApartmentTab>('general');

  const renderTabContent = (apartment: ExtendedApartment) => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab apartment={apartment} />;
      case 'gallery':
        return <GalleryTab apartment={apartment} />;
      case 'beds':
        return <BedsTab apartment={apartment} />;
      case 'amenities':
        return <AmenitiesTab apartment={apartment} />;
      case 'booking_variants':
        return <BookingVariantsTab apartment={apartment} />;
      case 'reviews':
        return <ReviewsTab apartment={apartment} />;
      default:
        return null;
    }
  };

  return !!apartment && (
    <AdminPage title={`Room ${apartment.number} - ${apartment.name || 'Apartment'}`}>
      <div className={classes.apartment_page}>
        <ApartmentSidebar
          apartment={apartment}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={classes.content}>
          {renderTabContent(apartment)}
        </div>
      </div>
    </AdminPage>
  );
}