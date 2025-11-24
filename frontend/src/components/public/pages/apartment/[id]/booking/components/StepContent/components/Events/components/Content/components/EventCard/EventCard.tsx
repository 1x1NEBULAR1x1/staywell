'use client';

import React, { useState } from 'react';
import classes from './EventCard.module.scss';
import { AvailableEvent, SelectedEvent } from '@/lib/api/services';
import { User, Calendar, Users, Plus, Minus, X } from 'lucide-react';
import { getImageUrl } from '@/lib/api/utils/image-url';

export interface EventCardProps {
  event: AvailableEvent;
  isSelected: boolean;
  selectedEvent?: SelectedEvent;
  onAdd: (event: AvailableEvent, numberOfPeople: number) => void;
  onRemove: (eventId: string) => void;
  onUpdatePeople: (eventId: string, numberOfPeople: number) => void;
  formatDateTime: (start: string, end: string) => string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected,
  selectedEvent,
  onAdd,
  onRemove,
  onUpdatePeople,
  formatDateTime,
}) => {
  const [peopleCount, setPeopleCount] = useState(selectedEvent?.numberOfPeople || 1);

  const handleAdd = () => {
    if (peopleCount <= event.available_spots) {
      onAdd(event, peopleCount);
    }
  };

  const handleRemove = () => {
    onRemove(event.id);
  };

  const handlePeopleChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(event.available_spots, peopleCount + delta));
    setPeopleCount(newCount);

    if (isSelected) {
      onUpdatePeople(event.id, newCount);
    }
  };

  const handlePeopleInputChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= event.available_spots) {
      setPeopleCount(numValue);
      if (isSelected) {
        onUpdatePeople(event.id, numValue);
      }
    }
  };

  return (
    <div className={`${classes.card} ${isSelected ? classes.selected : ''}`}>
      {/* Изображение */}
      <div className={classes.imageContainer}>
        <img
          src={getImageUrl(event.image)}
          alt={event.name}
          className={classes.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-event.jpg'; // Fallback image
          }}
        />
        <div className={classes.priceBadge}>
          {event.price.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      {/* Содержимое */}
      <div className={classes.content}>
        <h3 className={classes.title}>{event.name}</h3>

        <div className={classes.datetime}>
          <Calendar size={16} />
          <span>{formatDateTime(event.start, event.end)}</span>
        </div>

        {event.guide && (
          <div className={classes.guide}>
            <User size={16} />
            <span>{event.guide.first_name} {event.guide.last_name}</span>
          </div>
        )}

        <p className={classes.description}>
          {event.description.length > 120
            ? `${event.description.substring(0, 120)}...`
            : event.description
          }
        </p>

        <div className={classes.capacity}>
          <Users size={16} />
          <span>Доступно: {event.available_spots} из {event.capacity}</span>
        </div>
      </div>

      {/* Элемент управления */}
      <div className={classes.controls}>
        {isSelected ? (
          <div className={classes.selectedControls}>
            <div className={classes.peopleSelector}>
              <button
                type="button"
                className={classes.peopleButton}
                onClick={() => handlePeopleChange(-1)}
                disabled={peopleCount <= 1}
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                className={classes.peopleInput}
                value={peopleCount}
                onChange={(e) => handlePeopleInputChange(e.target.value)}
                min={1}
                max={event.available_spots}
              />

              <button
                type="button"
                className={classes.peopleButton}
                onClick={() => handlePeopleChange(1)}
                disabled={peopleCount >= event.available_spots}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className={classes.removeButton}
              onClick={handleRemove}
            >
              <X size={16} />
              Убрать
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={classes.addButton}
            onClick={handleAdd}
            disabled={event.available_spots === 0}
          >
            <Plus size={16} />
            Добавить
          </button>
        )}
      </div>
    </div>
  );
};



