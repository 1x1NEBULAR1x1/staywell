import { useForm } from 'react-hook-form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { SelectField, TextareaField, InputField } from '@/components/admin/common/Form';
import { ExtendedBooking, BookingStatus, CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending Confirmation' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

type FormData = CruddableTypes<'BOOKING'>['update'];

export const EditBookingModal = ({
  booking,
  onClose,
  refetch
}: {
  booking: ExtendedBooking;
  onClose: () => void;
  refetch: () => void;
}) => {
  const update_mutation = useModel('BOOKING').update(booking.id);
  const toast = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      status: booking.status,
      message: booking.message || '',
      start: new Date(booking.start),
      end: new Date(booking.end),
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
      toast.success('Booking has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`);
      console.error('Failed to update booking:', error);
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Edit Booking"
      form={form}
      onSubmit={handleSubmit}
      model="BOOKING"
      id={booking.id}
      is_loading={update_mutation.isPending}
    >
      <SelectField
        label="Booking Status"
        name="status"
        placeholder="Select status"
        register={form.register}
        options={STATUS_OPTIONS.map(option => ({
          label: option.label,
          value: option.value
        }))}
        errors={form.formState.errors}
        required
      />

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

      <TextareaField
        label="Client Message"
        name="message"
        placeholder="Additional requests or comments..."
        register={form.register}
        errors={form.formState.errors}
      />

      <div style={{
        padding: '16px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#856404'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
          ⚠️ Important:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Cannot change user, booking variant, or transaction</li>
          <li>When changing dates, ensure apartment availability</li>
          <li>Status changes may affect payment process</li>
        </ul>
      </div>
    </BaseFormModal>
  );
};
