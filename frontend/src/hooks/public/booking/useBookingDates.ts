import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apartmentsApi } from '@/lib/api/services';

export interface BookingDateRange {
  start: Date | null;
  end: Date | null;
}

export const useBookingDates = ({ apartment_id }: { apartment_id: string }) => {
  const [current_month, setCurrentMonth] = useState(new Date());

  // Request occupied dates for the current month
  const {
    data: dates_config,
    isLoading,
    error
  } = useQuery({
    queryKey: ['apartment-dates-config', apartment_id, current_month.getFullYear(), current_month.getMonth()],
    queryFn: () => apartmentsApi.getDatesConfig(apartment_id, {
      year: current_month.getFullYear(),
      month: current_month.getMonth() + 1, // API expects 1-12, we use 0-11 as array index
    }),
    select: (response) => response.data,
  });

  const occupied_dates = dates_config?.occupied_dates || [];

  // Check if the date is occupied
  const isDateOccupied = useCallback((date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return occupied_dates.includes(dateString);
  }, [occupied_dates]);

  // Проверка, является ли дата доступной для выбора
  const isDateAvailable = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Дата должна быть в будущем и не занята
    return date >= today && !isDateOccupied(date);
  }, [isDateOccupied]);

  // Переход к следующему/предыдущему месяцу
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'next') {
        newMonth.setMonth(newMonth.getMonth() + 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() - 1);
      }
      return newMonth;
    });
  }, []);

  return {
    current_month,
    occupied_dates,
    isLoading,
    error,
    isDateAvailable,
    isDateOccupied,
    navigateMonth,
    setCurrentMonth,
  };
};
