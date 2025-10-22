'use client';

import classes from './ReservationsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ReservationsFilters } from '@shared/src';
import { InputField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface ReservationsFiltersMenuProps {
  filters: ReservationsFilters;
  updateFilters: (filters: Partial<ReservationsFilters>) => void;
}

export const ReservationsFiltersMenu = ({ filters, updateFilters }: ReservationsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<ReservationsFilters>({ defaultValues: filters });

  const handleSubmit = (data: ReservationsFilters) => {
    updateFilters(data);
    setIsOpen(false);
  };

  return (
    <div className={classes.container}>
      <SlidersHorizontal className={classes.icon} onClick={() => setIsOpen(!is_open)} />
      {is_open && (
        <div className={classes.dropdown}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={classes.form}>
            <InputField
              label="Start Date From"
              name="min_start"
              register={form.register}
              errors={form.formState.errors}
              type="date"
            />

            <InputField
              label="Start Date To"
              name="max_start"
              register={form.register}
              errors={form.formState.errors}
              type="date"
            />

            <InputField
              label="End Date From"
              name="min_end"
              register={form.register}
              errors={form.formState.errors}
              type="date"
            />

            <InputField
              label="End Date To"
              name="max_end"
              register={form.register}
              errors={form.formState.errors}
              type="date"
            />

            <div className={classes.buttons}>
              <button type="submit" className={classes.apply_btn}>Apply</button>
              <button
                type="button"
                className={classes.reset_btn}
                onClick={() => {
                  form.reset({ user_id: filters.user_id });
                  updateFilters({ user_id: filters.user_id });
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
