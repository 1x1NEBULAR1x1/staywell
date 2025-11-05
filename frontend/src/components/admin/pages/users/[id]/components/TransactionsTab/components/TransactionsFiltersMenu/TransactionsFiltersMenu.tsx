'use client';

import classes from './TransactionsFiltersMenu.module.scss';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TransactionsFilters, TransactionStatus, TransactionType, PaymentMethod } from '@shared/src';
import { SelectField, InputField } from '@/components/admin/common/Form';
import { useForm } from 'react-hook-form';

interface TransactionsFiltersMenuProps {
  filters: TransactionsFilters;
  setFilters: (filters: Partial<TransactionsFilters>) => void;
}

export const TransactionsFiltersMenu = ({ filters, setFilters }: TransactionsFiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);
  const form = useForm<TransactionsFilters>({ defaultValues: filters });

  const handleSubmit = (data: TransactionsFilters) => {
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
              label="Status"
              name="transaction_status"
              register={form.register}
              errors={form.formState.errors}
              options={[
                { value: '', label: 'All' },
                { value: TransactionStatus.PENDING, label: 'Pending' },
                { value: TransactionStatus.SUCCESS, label: 'Success' },
                { value: TransactionStatus.CANCELED, label: 'Canceled' },
                { value: TransactionStatus.FAILED, label: 'Failed' },
              ]}
            />

            <SelectField
              label="Type"
              name="transaction_type"
              register={form.register}
              errors={form.formState.errors}
              options={[
                { value: '', label: 'All' },
                { value: TransactionType.DEPOSIT, label: 'Deposit' },
                { value: TransactionType.PAYMENT, label: 'Payment' },
                { value: TransactionType.REFUND, label: 'Refund' },
                { value: TransactionType.FINE, label: 'Fine' },
              ]}
            />

            <SelectField
              label="Payment Method"
              name="payment_method"
              register={form.register}
              errors={form.formState.errors}
              options={[
                { value: '', label: 'All' },
                { value: PaymentMethod.CASH, label: 'Cash' },
                { value: PaymentMethod.CARD, label: 'Card' },
                { value: PaymentMethod.TRANSFER, label: 'Transfer' },
              ]}
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
