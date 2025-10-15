import classes from './MainData.module.scss';
import { ExtendedEvent } from '@shared/src';

export const MainData = ({ event, setIsEditModalOpen }: { event: ExtendedEvent, setIsEditModalOpen: (isEditModalOpen: boolean) => void }) => (
  <>
    <h1 className={classes.title_container}>
      <span className={classes.title}>{event.name}</span>
      <button
        className={classes.edit_btn}
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit Event
      </button>
    </h1>
    <div className={classes.price}>
      ${event.price} per person
    </div>
  </>
);