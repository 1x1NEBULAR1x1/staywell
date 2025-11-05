'use client';

import classes from './BookingsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { BookingsFilters, BookingStatus } from '@shared/src';
import { InputField, SelectField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface BookingsFiltersMenuProps {
  filters: BookingsFilters;
  setFilters: (filters: Partial<BookingsFilters>) => void;
}

export const BookingsFiltersMenu = ({ filters, setFilters }: BookingsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<BookingsFilters>({ defaultValues: filters });

  const handleSubmit = (data: BookingsFilters) => {
    setFilters(data);
    setIsOpen(false);
  };

  return (
    <div className={classes.container}>
      <SlidersHorizontal className={classes.icon} onClick={() => setIsOpen(!is_open)} />
      {is_open && (
        <div className={classes.dropdown}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={classes.form}>
            <SelectField
              register={form.register}
              errors={form.formState.errors}
              label="Status"
              name="status"
              options={[
                { value: '', label: 'All' },
                { value: BookingStatus.PENDING, label: 'Pending' },
                { value: BookingStatus.CONFIRMED, label: 'Confirmed' },
                { value: BookingStatus.COMPLETED, label: 'Completed' },
                { value: BookingStatus.CANCELLED, label: 'Cancelled' },
              ]}
            />

            <InputField
              label="Start Date From"
              name="min_start"
              type="date"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Start Date To"
              name="max_start"
              type="date"
              register={form.register}
              errors={form.formState.errors}
            />

            <div className={classes.buttons}>
              <button type="submit" className={classes.apply_btn}>Apply</button>
              <button
                type="button"
                className={classes.reset_btn}
                onClick={() => {
                  form.reset({ user_id: filters.user_id });
                  setFilters({ user_id: filters.user_id });
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
