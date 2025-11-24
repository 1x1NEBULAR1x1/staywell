'use client';

import React, { useState, useRef, useCallback } from 'react';
import classes from './Confirmation.module.scss';
import { useParams } from 'next/navigation';
import { useBookingDates, useBookingEvents } from '@/hooks/public';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, ArrowRight, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Confirmation = () => {
  const { id } = useParams() as { id: string };
  const { selectedRange } = useBookingDates({ apartmentId: id });
  const { selectedEvents, totalEventsPrice } = useBookingEvents({
    bookingDates: selectedRange,
    enabled: !!selectedRange.start && !!selectedRange.end,
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Здесь должна быть логика расчета стоимости апартаментов
  // Пока используем заглушку
  const apartmentPrice = 15000; // Пример цены за сутки
  const nights = selectedRange.start && selectedRange.end
    ? Math.ceil((selectedRange.end.getTime() - selectedRange.start.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const apartmentTotal = apartmentPrice * nights;
  const eventsTotal = totalEventsPrice;
  const totalAmount = apartmentTotal + eventsTotal;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const maxX = rect.width - 60; // 60px - ширина ползунка
    const newX = Math.max(0, Math.min(e.clientX - rect.left - 30, maxX));
    setSliderPosition(newX);

    // Если ползунок перетащен более чем на 80%, подтверждаем
    if (newX > maxX * 0.8) {
      setIsConfirmed(true);
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && !isConfirmed) {
      // Возвращаем ползунок на место, если не подтверждено
      setSliderPosition(0);
    }
    setIsDragging(false);
  }, [isDragging, isConfirmed]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConfirmClick = () => {
    setIsConfirmed(true);
  };

  if (!selectedRange.start || !selectedRange.end) {
    return (
      <div className={classes.container}>
        <div className={classes.empty}>
          <CheckCircle size={48} />
          <h3>Бронирование не завершено</h3>
          <p>Необходимо выбрать даты пребывания для подтверждения бронирования</p>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className={classes.container}>
        <div className={classes.success}>
          <div className={classes.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h2>Бронирование подтверждено!</h2>
          <p>Спасибо за выбор наших апартаментов. Детали бронирования отправлены на вашу почту.</p>

          <div className={classes.bookingSummary}>
            <div className={classes.summaryItem}>
              <Calendar size={20} />
              <span>
                {format(selectedRange.start, 'dd MMMM yyyy', { locale: ru })} - {format(selectedRange.end, 'dd MMMM yyyy', { locale: ru })}
              </span>
            </div>
            <div className={classes.summaryItem}>
              <MapPin size={20} />
              <span>Апартаменты #{id}</span>
            </div>
            <div className={classes.summaryItem}>
              <CreditCard size={20} />
              <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className={classes.nextSteps}>
            <h3>Что дальше?</h3>
            <ul>
              <li>Проверьте почту для получения деталей бронирования</li>
              <li>Подготовьте документы для заселения</li>
              <li>Свяжитесь с нами при возникновении вопросов</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.title}>
          <Lock size={24} />
          <h2>Подтверждение бронирования</h2>
        </div>
        <p className={classes.subtitle}>
          Проверьте детали и подтвердите бронирование
        </p>
      </div>

      <div className={classes.content}>
        {/* Детали бронирования */}
        <div className={classes.bookingDetails}>
          <h3>Детали бронирования</h3>

          <div className={classes.detailCards}>
            <div className={classes.detailCard}>
              <div className={classes.cardIcon}>
                <Calendar size={24} />
              </div>
              <div className={classes.cardContent}>
                <h4>Даты пребывания</h4>
                <p>
                  {format(selectedRange.start, 'dd MMMM yyyy', { locale: ru })} - {format(selectedRange.end, 'dd MMMM yyyy', { locale: ru })}
                </p>
                <span className={classes.nights}>{nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
              </div>
            </div>

            <div className={classes.detailCard}>
              <div className={classes.cardIcon}>
                <MapPin size={24} />
              </div>
              <div className={classes.cardContent}>
                <h4>Апартаменты</h4>
                <p>Апартаменты #{id}</p>
                <span className={classes.price}>
                  {apartmentPrice.toLocaleString('ru-RU')} ₽ × {nights} = {apartmentTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            {selectedEvents.length > 0 && (
              <div className={classes.detailCard}>
                <div className={classes.cardIcon}>
                  <Users size={24} />
                </div>
                <div className={classes.cardContent}>
                  <h4>Мероприятия</h4>
                  <p>{selectedEvents.length} {selectedEvents.length === 1 ? 'мероприятие' : selectedEvents.length < 5 ? 'мероприятия' : 'мероприятий'}</p>
                  <span className={classes.price}>{eventsTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Итоговая стоимость */}
        <div className={classes.totalSummary}>
          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Итого к оплате:</span>
            <span className={classes.totalAmount}>{totalAmount.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        {/* Условия бронирования */}
        <div className={classes.terms}>
          <h4>Условия бронирования</h4>
          <div className={classes.termItems}>
            <div className={classes.termItem}>
              <CheckCircle size={16} />
              <span>Бесплатная отмена за 24 часа до заезда</span>
            </div>
            <div className={classes.termItem}>
              <CheckCircle size={16} />
              <span>Гарантия возврата средств</span>
            </div>
            <div className={classes.termItem}>
              <CheckCircle size={16} />
              <span>Поддержка 24/7</span>
            </div>
          </div>
        </div>

        {/* Слайдер подтверждения */}
        <div className={classes.confirmation}>
          <h3>Подтвердить и произвести оплату</h3>
          <p>Перетащите ползунок вправо для подтверждения бронирования</p>

          <div
            className={`${classes.slider} ${isDragging ? classes.dragging : ''}`}
            ref={sliderRef}
            onMouseDown={handleMouseDown}
          >
            <div
              className={classes.sliderTrack}
              style={{ width: `${(sliderPosition / ((sliderRef.current?.clientWidth || 300) - 60)) * 100}%` }}
            />
            <div
              className={classes.sliderThumb}
              style={{ transform: `translateX(${sliderPosition}px)` }}
            >
              <ArrowRight size={20} />
            </div>
            <div className={classes.sliderText}>
              <span>Подтвердить бронирование</span>
            </div>
          </div>

          <button
            type="button"
            className={classes.confirmButton}
            onClick={handleConfirmClick}
          >
            Или нажмите для быстрого подтверждения
          </button>
        </div>
      </div>
    </div>
  );
};