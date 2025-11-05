'use client';

import { useForm } from 'react-hook-form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { InputField } from '@/components/admin/common/Form';
import { ExtendedReservation, CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

type FormData = CruddableTypes<'RESERVATION'>['update'];

export const EditReservationModal = ({
  reservation,
  onClose,
  refetch
}: {
  reservation: ExtendedReservation;
  onClose: () => void;
  refetch: () => void;
}) => {
  const update_mutation = useModel('RESERVATION').update(reservation.id);
  const toast = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      start: new Date(reservation.start),
      end: new Date(reservation.end),
    },
  });

  const handleSubmit = async (data: FormData) => {
    // Validate dates
    if (data.end && data.start && new Date(data.end) <= new Date(data.start)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      await update_mutation.mutateAsync(data);
      onClose();
      refetch();
      toast.success('Reservation has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`);
      console.error('Failed to update reservation:', error);
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Edit Reservation"
      form={form}
      onSubmit={handleSubmit}
      model="RESERVATION"
      id={reservation.id}
      is_loading={update_mutation.isPending}
    >
      <InputField
        label="Check-in Date"
        name="start"
        type="datetime-local"
        register={form.register}
        errors={form.formState.errors}
        required
      />

      <InputField
        label="Check-out Date"
        name="end"
        type="datetime-local"
        register={form.register}
        errors={form.formState.errors}
        required
      />
    </BaseFormModal>
  );
};
