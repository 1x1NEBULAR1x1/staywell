'use client';

import { useModel } from '@/hooks/admin/queries';
import classes from './Header.module.scss';
import Image from 'next/image';
import { usePId } from '@/hooks/common/useId';
import no_image from '@/../public/common/no-image.jpeg';
import { MainData, MetaData } from './components';
import { useState } from 'react';
import { ApartmentModal } from '@/components/admin/pages/apartments/ApartmentModal';


export const Header = () => {
  const { data: apartment } = useModel('APARTMENT').find(usePId());
  const [is_modal_open, setIsModalOpen] = useState(false);

  const mainImage = apartment?.images?.[0]?.image || apartment?.image || no_image.src;

  return !!apartment && (
    <>
      <div className={classes.header_section}>
        <div className={classes.preview_image_container}>
          <Image
            src={mainImage}
            alt={apartment.name || 'Apartment'}
            fill
            className={classes.preview_image}
          />
          <div className={classes.image_overlay}>
            <span className={classes.image_count}>
              {apartment.images.length + (apartment.image ? 1 : 0)} photos
            </span>
          </div>
        </div>

        <div className={classes.main_info_container}>
          <MainData setIsModalOpen={setIsModalOpen} />
          <MetaData />
        </div>
      </div>

      {is_modal_open && (
        <ApartmentModal
          initial_data={apartment}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
};