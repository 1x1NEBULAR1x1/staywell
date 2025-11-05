'use client';

import classes from './EventsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { EventsFilters } from '@shared/src';
import { InputField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface EventsFiltersMenuProps {
  filters: EventsFilters;
  setFilters: (filters: Partial<EventsFilters>) => void;
  user_id: string;
}

export const EventsFiltersMenu = ({ filters, setFilters, user_id }: EventsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<EventsFilters>({ defaultValues: filters });

  const handleSubmit = (data: EventsFilters) => {
    setFilters(data);
    setIsOpen(false);
  };

  return (
    <div className={classes.container}>
      <SlidersHorizontal className={classes.icon} onClick={() => setIsOpen(!is_open)} />
      {is_open && (
        <div className={classes.dropdown}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={classes.form}>
            <InputField
              label="Event Name"
              name="name"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Description"
              name="description"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Min Capacity"
              name="min_capacity"
              register={form.register}
              errors={form.formState.errors}
              type="number"
            />

            <InputField
              label="Max Capacity"
              name="max_capacity"
              register={form.register}
              errors={form.formState.errors}
              type="number"
            />

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
              label="Min Price"
              name="min_price"
              register={form.register}
              errors={form.formState.errors}
              type="number"
            />

            <InputField
              label="Max Price"
              name="max_price"
              register={form.register}
              errors={form.formState.errors}
              type="number"
            />

            <div className={classes.buttons}>
              <button type="submit" className={classes.apply_btn}>Apply</button>
              <button
                type="button"
                className={classes.reset_btn}
                onClick={() => {
                  form.reset({ guide_id: user_id });
                  setFilters({ guide_id: user_id });
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
