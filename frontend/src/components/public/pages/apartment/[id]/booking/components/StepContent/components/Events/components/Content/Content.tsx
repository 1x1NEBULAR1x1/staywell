'use client'

import classes from './Content.module.scss';

export const Content = () => {


  return (
    <div className={classes.content}>
      

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
  )
}