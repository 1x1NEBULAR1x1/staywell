import classes from './MetaData.module.scss';
import clsx from 'clsx';
import { ToolTip } from '@/components/styles/ui';
import { Cigarette, CigaretteOff, PawPrint, FishOff } from 'lucide-react';
import { ExtendedApartment } from '@shared/src';


export const MetaData = ({ apartment }: { apartment: ExtendedApartment }) => (
  <div className={classes.meta}>
    <div className={classes.meta_row}>
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
    <div className={classes.meta_row}>
      <span className={classes.floor}>Floor {apartment.floor}, Room {apartment.number}</span>
      <span className={classes.capacity}>up to {apartment.capacity} guests</span>
    </div>
  </div>
);