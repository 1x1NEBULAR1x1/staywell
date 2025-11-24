'use client';

import classes from './Calendar.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { MONTH_NAMES, DAY_NAMES } from './config';
import { getDaysInMonth, isDateInRange, isDateRangeStart, isDateRangeEnd } from './utils';


export interface CalendarProps {
  current_month: Date;
  selected_range: { start?: Date; end?: Date };
  onRangeSelect: (range: { start?: Date; end?: Date }) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  isDateAvailable: (date: Date) => boolean;
  is_loading?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  current_month,
  selected_range,
  onRangeSelect,
  onNavigateMonth,
  isDateAvailable,
  is_loading = false,
}) => {

  const days = getDaysInMonth({ date: current_month });

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;

    // Если нет начальной даты или выбираем новую начальную дату
    if (!selected_range.start || (selected_range.start && selected_range.end)) {
      onRangeSelect({ start: date });
      return;
    }

    // Если начальная дата есть, но нет конечной
    if (selected_range.start && !selected_range.end) {
      // Если выбранная дата раньше начальной, делаем её начальной
      if (date < selected_range.start) {
        onRangeSelect({ start: date });
        return;
      }

      // Проверяем, что все даты между start и date доступны
      const dates_between = [];
      const current = new Date(selected_range.start);
      current.setDate(current.getDate() + 1);

      while (current < date) {
        dates_between.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      const has_unavailable_dates = dates_between.some(d => !isDateAvailable(d));

      if (has_unavailable_dates) {
        // Если есть недоступные даты между, сбрасываем и начинаем заново
        onRangeSelect({ start: date });
        return;
      }

      // Устанавливаем конечную дату
      onRangeSelect({ start: selected_range.start, end: date });
    }
  };

  return (
    <div className={classes.calendar}>
      {/* Calendar header */}
      <div className={classes.header}>
        <button
          type="button"
          className={classes.navButton}
          onClick={() => onNavigateMonth('prev')}
          disabled={is_loading}
        >
          <ChevronLeft size={20} />
        </button>

        <h3 className={classes.monthTitle}>
          {MONTH_NAMES[current_month.getMonth()]} {current_month.getFullYear()}
        </h3>

        <button
          type="button"
          className={classes.navButton}
          onClick={() => onNavigateMonth('next')}
          disabled={is_loading}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className={classes.weekDays}>
        {DAY_NAMES.map(day => (
          <div key={day} className={classes.weekDay}>
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className={classes.daysGrid}>
        {days.map((date, index) => (
          <div
            key={index}
            className={clsx(classes.day, {
              [classes.empty]: !date,
              [classes.occupied]: date && !isDateAvailable(date),
              [classes.available]: date && isDateAvailable(date),
              [classes.selected]: date && isDateInRange({ date, selected_range: selected_range }),
              [classes.rangeStart]: date && isDateRangeStart({ date, selected_range: selected_range }),
              [classes.rangeEnd]: date && isDateRangeEnd({ date, selected_range: selected_range }),
              [classes.today]: date && date.toDateString() === new Date().toDateString(),
              [classes.loading]: is_loading,
            })}
            onClick={date ? () => handleDateClick(date) : undefined}
          >
            {date && date.getDate()}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div className={clsx(classes.legendColor, classes.available)} />
          <span>Available</span>
        </div>
        <div className={classes.legendItem}>
          <div className={clsx(classes.legendColor, classes.occupied)} />
          <span>Occupied</span>
        </div>
        <div className={classes.legendItem}>
          <div className={clsx(classes.legendColor, classes.selected)} />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};
