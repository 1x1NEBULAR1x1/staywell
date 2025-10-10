import classes from './MainData.module.scss';
import { ExtendedApartment } from '@shared/src';

export const MainData = ({ apartment, setIsEditModalOpen }: { apartment: ExtendedApartment, setIsEditModalOpen: (isEditModalOpen: boolean) => void }) => (
  <>
    <h1 className={classes.title_container}>
      <span className={classes.title}>{apartment.name}</span>
      <button
        className={classes.edit_btn}
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit Apartment
      </button>
    </h1>
    <div className={classes.price}>
      From ${apartment.price} per night
    </div>
  </>
);