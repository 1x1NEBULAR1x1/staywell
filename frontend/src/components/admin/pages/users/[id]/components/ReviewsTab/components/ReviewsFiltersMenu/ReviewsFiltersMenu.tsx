'use client';

import classes from './ReviewsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ReviewsFilters } from '@shared/src';
import { InputField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface ReviewsFiltersMenuProps {
  filters: ReviewsFilters;
  updateFilters: (filters: Partial<ReviewsFilters>) => void;
}

export const ReviewsFiltersMenu = ({ filters, updateFilters }: ReviewsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<ReviewsFilters>({ defaultValues: filters });

  const handleSubmit = (data: ReviewsFilters) => {
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
              label="Rating"
              name="rating"
              register={form.register}
              errors={form.formState.errors}
              type="number"
              min={1}
              max={5}
            />

            <InputField
              label="Comment"
              name="comment"
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
