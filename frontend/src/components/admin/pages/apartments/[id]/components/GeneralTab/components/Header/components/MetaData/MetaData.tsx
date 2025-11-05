'use client';

import classes from './MetaData.module.scss';
import clsx from 'clsx';
import { ToolTip } from '@/components/styles/ui';
import { Cigarette, CigaretteOff, PawPrint, FishOff, Home, Users, Bed, DollarSign, Star } from 'lucide-react';
import { useModel } from '@/hooks/admin/queries/useModel';
import { usePId } from '@/hooks/common/useId';


export const MetaData = () => {
  const id = usePId();
  const { data: apartment } = useModel('APARTMENT').find(id);

  return !!apartment && (
    <div className={classes.meta}>
      <div className={classes.badges_row}>
        <span className={`${classes.status} ${apartment.is_available ? classes.available : classes.unavailable}`}>
          {apartment.is_available ? 'Available' : 'Unavailable'}
        </span>
        <span className={classes.type}>{apartment.type}</span>
        {apartment.is_smoking
          ? <ToolTip label="Smoking allowed" variant="green" position="bottom">
            <Cigarette className={clsx(classes.icon, classes.icon_allowed)} />
          </ToolTip>
          : <ToolTip label="Smoking not allowed" variant="red" position="bottom">
            <CigaretteOff className={clsx(classes.icon, classes.icon_not_allowed)} />
          </ToolTip>}
        {apartment.is_pet_friendly
          ? <ToolTip label="Pet friendly" variant="green" position="bottom">
            <PawPrint className={clsx(classes.icon, classes.icon_allowed)} />
          </ToolTip>
          : <ToolTip label="Pet not friendly" variant="red" position="bottom">
            <FishOff className={clsx(classes.icon, classes.icon_not_allowed)} />
          </ToolTip>}
      </div>

      <div className={classes.info_grid}>
        <div className={classes.info_item}>
          <Home className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Location</span>
            <span className={classes.info_value}>Floor {apartment.floor}, Room {apartment.number}</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <Users className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Capacity</span>
            <span className={classes.info_value}>Up to {apartment.max_capacity || apartment.capacity} guests</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <Home className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Rooms</span>
            <span className={classes.info_value}>{apartment.rooms_count} rooms</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <DollarSign className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Deposit</span>
            <span className={classes.info_value}>${apartment.deposit}</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <Star className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Rating</span>
            <span className={classes.info_value}>{apartment.rating.toFixed(1)} ({apartment.reviews.length} reviews)</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <Bed className={classes.info_icon} size={18} />
          <div className={classes.info_content}>
            <span className={classes.info_label}>Beds & Amenities</span>
            <span className={classes.info_value}>{apartment.apartment_beds.length} beds, {apartment.apartment_amenities.length} amenities</span>
          </div>
        </div>
      </div>
    </div>
  )
};