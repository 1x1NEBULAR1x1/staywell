'use client';

import classes from './TransferDetailsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TransferDetailsFilters } from '@shared/src';
import { InputField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface TransferDetailsFiltersMenuProps {
  filters: TransferDetailsFilters;
  setFilters: (filters: Partial<TransferDetailsFilters>) => void;
}

export const TransferDetailsFiltersMenu = ({ filters, setFilters }: TransferDetailsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<TransferDetailsFilters>({ defaultValues: filters });

  const handleSubmit = (data: TransferDetailsFilters) => {
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
              label="Bank Name"
              name="bank_name"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Account Number"
              name="account_number"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Payer Name"
              name="payer_name"
              register={form.register}
              errors={form.formState.errors}
            />

            <InputField
              label="Min Amount"
              name="min_amount"
              register={form.register}
              errors={form.formState.errors}
              type="number"
            />

            <InputField
              label="Max Amount"
              name="max_amount"
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
