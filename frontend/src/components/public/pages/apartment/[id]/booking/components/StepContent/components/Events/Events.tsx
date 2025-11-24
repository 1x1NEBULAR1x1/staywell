'use client';

import React from 'react';
import classes from './Events.module.scss';
import { useParams } from 'next/navigation';
import { useBookingEvents } from '@/hooks/public';
import { EventCard } from './components/Content/components/EventCard';
import { AvailableEvent } from '@/lib/api/services';
import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { Event } from '@shared/src';
import { Header } from './components';

export const Events = () => {
  const { id } = useParams() as { id: string };
  const { events, isLoading } = useBookingEvents();


  const formatEventDateTime = (event: Event) => {
    if (event.start.toDateString() === event.end.toDateString()) {
      return `${format(event.start, 'dd MMMM yyyy')} at ${format(event.start, 'HH:mm')} to ${format(event.end, 'HH:mm')}`;
    } else {
      return `${format(event.start, 'dd MMM HH:mm')} - ${format(event.end, 'dd MMM HH:mm yyyy')}`;
    }
  };

  return (
    <div className={classes.container}>
      <Header />

      <div className={classes.content}>
        {isLoading && (
          <div className={classes.loading}>
            <div className={classes.spinner} />
            <p>Загружаем доступные мероприятия...</p>
          </div>
        )}

        {error && (
          <div className={classes.error}>
            <p>Не удалось загрузить мероприятия. Попробуйте позже.</p>
          </div>
        )}

        {!isLoading && !error && !hasAvailableEvents && (
          <div className={classes.noEvents}>
            <Calendar size={48} />
            <h3>Мероприятия не найдены</h3>
            <p>На выбранные даты мероприятий нет. Вы можете перейти к следующему шагу.</p>
          </div>
        )}

        {!isLoading && !error && hasAvailableEvents && (
          <>
            <div className={classes.eventsGrid}>
              {availableEvents.map((event: AvailableEvent) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSelected={isEventSelected(event.id)}
                  selectedEvent={getSelectedEvent(event.id)}
                  onAdd={addEvent}
                  onRemove={removeEvent}
                  onUpdatePeople={updateEventPeople}
                  formatDateTime={formatEventDateTime}
                />
              ))}
            </div>

            {selectedEvents.length > 0 && (
              <div className={classes.summary}>
                <div className={classes.summaryHeader}>
                  <Users size={20} />
                  <h3>Выбранные мероприятия</h3>
                </div>

                <div className={classes.selectedEvents}>
                  {selectedEvents.map(({ event, numberOfPeople }: { event: AvailableEvent; numberOfPeople: number }) => (
                    <div key={event.id} className={classes.selectedEvent}>
                      <div className={classes.eventInfo}>
                        <span className={classes.eventName}>{event.name}</span>
                        <span className={classes.eventDetails}>
                          {numberOfPeople} чел. × {event.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <span className={classes.eventTotal}>
                        {(event.price * numberOfPeople).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className={classes.total}>
                  <span className={classes.totalLabel}>Итого за мероприятия:</span>
                  <span className={classes.totalAmount}>
                    {totalEventsPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={classes.footer}>
        {selectedEvents.length > 0 && (
          <div className={classes.eventsCount}>
            <span>Выбрано мероприятий: {selectedEvents.length}</span>
          </div>
        )}

        <div className={classes.nextStep}>
          <span>Готово к следующему шагу</span>
        </div>
      </div>
    </div>
  );
};