'use client';
import classes from './Apartment.module.scss';
import { ExtendedApartment } from "@shared/src";
import { Header, Images, ApartmentInfo, ImageModal } from './components';
import { useState } from 'react';

export const Apartment = ({ id, initial_data }: { id: string, initial_data: ExtendedApartment }) => {
  const [is_modal_open, setIsModalOpen] = useState(false);
  return (
    <div className={classes.page}>
      <Header title={initial_data.name || 'Superior Room'} />
      <Images apartment={initial_data} />
      <ApartmentInfo apartment={initial_data} />
    </div>
  )
}