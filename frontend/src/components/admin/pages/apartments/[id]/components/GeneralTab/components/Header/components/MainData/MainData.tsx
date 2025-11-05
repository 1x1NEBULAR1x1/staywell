'use client';

import classes from './MainData.module.scss';
import { usePId } from '@/hooks/common/useId';
import { useModel } from '@/hooks/admin/queries/useModel';



export const MainData = ({ setIsModalOpen }: { setIsModalOpen: (is_modal_open: boolean) => void }) => {
  const id = usePId();
  const { data: apartment } = useModel('APARTMENT').find(id);
  return !!apartment && (
    <>
      <h1 className={classes.title_container}>
        <span className={classes.title}>{apartment.name}</span>
        <button
          className={classes.edit_btn}
          onClick={() => setIsModalOpen(true)}
        >
          Edit Apartment
        </button>
      </h1>
      <div className={classes.price}>
        From ${apartment.price} per night
      </div>
    </>
  );
}