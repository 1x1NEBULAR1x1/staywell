'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { ExtendedEvent } from '@shared/src';

import { EventData } from './components';
import { AdminPage } from '@/components/admin/common/AdminPage';

export const Event = ({ id, initial_data }: { id: string, initial_data: ExtendedEvent }) => {
  const { data: event, refetch } = useModel('EVENT').find(id, { initial_data: { data: initial_data } });
  if (!event) return null;

  return (
    <AdminPage title='Event'>
      <EventData event_id={id} />
    </AdminPage>
  );
}