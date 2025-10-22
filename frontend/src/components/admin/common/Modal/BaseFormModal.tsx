'use client';

import { ReactNode } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { Modal } from '@/components/admin/common/Modal/Modal';
import { ActionsSection, classes } from '@/components/admin/common/Form';
import { GETTABLE_NAMES } from '@shared/src';

interface BaseFormModalProps<T extends FieldValues, M extends GETTABLE_NAMES> {
  is_open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  is_loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  reset_on_close?: boolean;
  model: M;
  id?: string;
}

export const BaseFormModal = <T extends FieldValues, M extends GETTABLE_NAMES>({
  is_open,
  onClose,
  title,
  children,
  form,
  onSubmit,
  is_loading = false,
  size = 'md',
  reset_on_close = true,
  model,
  id
}: BaseFormModalProps<T, M>) => {
  const { handleSubmit, reset, formState: { isValid: is_valid } } = form;

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    if (reset_on_close) reset();
    onClose();
  };

  return (
    <Modal
      isOpen={is_open}
      onClose={handleClose}
      title={title}
      size={size}
    >
      <form
        className={classes.admin_form}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {children}

        <ActionsSection
          is_loading={is_loading}
          is_valid={is_valid}
          handleClose={handleClose}
          model={model}
          action={!id ? 'create' : 'update'}
          id={id}
        />
      </form>
    </Modal>
  );
}; 