import classes from './EventData.module.scss';

import { useState } from 'react';
import { useModel } from '@/hooks/admin/queries/useModel';
import { MetaData, MainData, Gallery, EditEventModal } from './components';

export const EventData = ({ event_id }: { event_id: string }) => {
  const { data: event, refetch } = useModel('EVENT').find(event_id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return event && (
    <>
      <div className={classes.header}>
        <div className={classes.main_info}>
          <Gallery event={event} />
          <div className={classes.info}>
            <MainData event={event} setIsEditModalOpen={setIsEditModalOpen} />
            <MetaData event={event} />
          </div>
        </div>
        <p className={classes.description}>{event.description}</p>
      </div>
      {isEditModalOpen && (
        <EditEventModal
          event={event}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  )
};