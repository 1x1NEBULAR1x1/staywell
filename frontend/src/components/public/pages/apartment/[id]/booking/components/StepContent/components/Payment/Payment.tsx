'use client';

import React, { useState } from 'react';
import classes from './Payment.module.scss';
import { useParams } from 'next/navigation';
import { useBookingDates, useBookingEvents } from '@/hooks/public';
import { CreditCard, Banknote, Building2, Check, Shield, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type PaymentMethod = 'card' | 'cash' | 'transfer';

export const Payment = () => {
  const { id } = useParams() as { id: string };
  const { selectedRange } = useBookingDates({ apartmentId: id });
  const { totalEventsPrice } = useBookingEvents({
    bookingDates: selectedRange,
    enabled: !!selectedRange.start && !!selectedRange.end,
  });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Здесь должна быть логика расчета стоимости апартаментов
  // Пока используем заглушку
  const apartmentPrice = 15000; // Пример цены за сутки
  const nights = selectedRange.start && selectedRange.end
    ? Math.ceil((selectedRange.end.getTime() - selectedRange.start.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const apartmentTotal = apartmentPrice * nights;
  const eventsTotal = totalEventsPrice;
  const totalAmount = apartmentTotal + eventsTotal;

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Банковская карта',
      description: 'Visa, Mastercard, Мир',
      icon: CreditCard,
      details: 'Оплата онлайн через защищенное соединение',
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Наличными',
      description: 'Оплата при заселении',
      icon: Banknote,
      details: 'Оплата производится на ресепшене при заселении',
    },
    {
      id: 'transfer' as PaymentMethod,
      name: 'Банковский перевод',
      description: 'Перевод на расчетный счет',
      icon: Building2,
      details: 'Реквизиты будут предоставлены после подтверждения',
    },
  ];

  if (!selectedRange.start || !selectedRange.end) {
    return (
      <div className={classes.container}>
        <div className={classes.empty}>
          <CreditCard size={48} />
          <h3>Сначала выберите даты</h3>
          <p>Выберите даты пребывания для расчета стоимости и выбора оплаты</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.title}>
          <Shield size={24} />
          <h2>Выберите способ оплаты</h2>
        </div>
        <p className={classes.subtitle}>
          Безопасная оплата с гарантией возврата средств
        </p>
      </div>

      <div className={classes.content}>
        {/* Сумма к оплате */}
        <div className={classes.summary}>
          <div className={classes.bookingDetails}>
            <div className={classes.detailRow}>
              <span className={classes.label}>Период бронирования:</span>
              <span className={classes.value}>
                {format(selectedRange.start, 'dd MMM', { locale: ru })} - {format(selectedRange.end, 'dd MMM yyyy', { locale: ru })}
              </span>
            </div>
            <div className={classes.detailRow}>
              <span className={classes.label}>Количество ночей:</span>
              <span className={classes.value}>{nights}</span>
            </div>
          </div>

          <div className={classes.priceBreakdown}>
            <div className={classes.priceRow}>
              <span className={classes.priceLabel}>Апартаменты:</span>
              <span className={classes.priceValue}>
                {apartmentPrice.toLocaleString('ru-RU')} ₽ × {nights} = {apartmentTotal.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {eventsTotal > 0 && (
              <div className={classes.priceRow}>
                <span className={classes.priceLabel}>Мероприятия:</span>
                <span className={classes.priceValue}>{eventsTotal.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}

            <div className={`${classes.priceRow} ${classes.total}`}>
              <span className={classes.priceLabel}>Итого к оплате:</span>
              <span className={classes.priceValue}>{totalAmount.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>

        {/* Способы оплаты */}
        <div className={classes.paymentMethods}>
          <h3>Выберите способ оплаты</h3>

          <div className={classes.methodsGrid}>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <div
                  key={method.id}
                  className={`${classes.methodCard} ${isSelected ? classes.selected : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className={classes.methodHeader}>
                    <div className={classes.methodIcon}>
                      <Icon size={24} />
                    </div>
                    {isSelected && (
                      <div className={classes.selectedIndicator}>
                        <Check size={16} />
                      </div>
                    )}
                  </div>

                  <div className={classes.methodContent}>
                    <h4 className={classes.methodName}>{method.name}</h4>
                    <p className={classes.methodDescription}>{method.description}</p>
                    <p className={classes.methodDetails}>{method.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Безопасность оплаты */}
        <div className={classes.security}>
          <div className={classes.securityHeader}>
            <Lock size={20} />
            <h4>Безопасность оплаты</h4>
          </div>

          <div className={classes.securityFeatures}>
            <div className={classes.securityFeature}>
              <Shield size={16} />
              <span>SSL-защита данных</span>
            </div>
            <div className={classes.securityFeature}>
              <Check size={16} />
              <span>Гарантия возврата</span>
            </div>
            <div className={classes.securityFeature}>
              <CreditCard size={16} />
              <span>Поддержка всех карт</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.footer}>
        {selectedMethod && (
          <div className={classes.selectedMethod}>
            <span>Выбранный способ: {paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
          </div>
        )}

        <div className={classes.nextStep}>
          <span>Готово к подтверждению</span>
        </div>
      </div>
    </div>
  );
};