'use client';

import { useState } from 'react';
import { ExtendedEvent } from '@shared/src/types';
import { useModel } from '@/hooks/admin/queries/useModel';
import { AdminPage } from '@/components/admin/common/AdminPage';
import { EventSidebar, GeneralTab, GalleryTab, BookingsTab } from './components';
import classes from './Event.module.scss';
import { usePId } from '@/hooks/common/useId';

export type EventTab = 'general' | 'gallery' | 'bookings';

export const Event = () => {
  const { data: event } = useModel('EVENT').find(usePId());
  const [activeTab, setActiveTab] = useState<EventTab>('general');

  const renderTabContent = (event: ExtendedEvent) => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab event={event} />;
      case 'gallery':
        return <GalleryTab event={event} />;
      case 'bookings':
        return <BookingsTab event={event} />;
      default:
        return null;
    }
  };

  return !!event && (
    <AdminPage title={`${event.name} - Event`}>
      <div className={classes.event_page}>
        <EventSidebar
          event={event}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={classes.content}>
          {renderTabContent(event)}
        </div>
      </div>
    </AdminPage>
  );
}