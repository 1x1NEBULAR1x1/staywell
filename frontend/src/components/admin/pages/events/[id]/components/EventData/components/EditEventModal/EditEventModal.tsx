'use client';

import { ExtendedEvent, CruddableTypes } from '@shared/src';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { ImageUploader, InputField, TextareaField } from '@/components/admin/common/Form';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

interface EditEventModalProps {
  event: ExtendedEvent;
  onClose: () => void;
  refetch: () => void;
}

type FormData = CruddableTypes<'EVENT'>['update'] & {
  image_type: 'file' | 'url';
}

export const EditEventModal = ({ event, onClose, refetch }: EditEventModalProps) => {
  const update_mutation = useModel('EVENT').update(event.id);
  const toast = useToast();
  const form = useForm<FormData>({
    defaultValues: { ...event, image: event.image || undefined, image_type: 'url' },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await update_mutation.mutateAsync(data);
      onClose();
      toast.success('Event has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`);
      console.error('Failed to update event:', error);
    } finally {
      refetch();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Edit Event"
      form={form}
      onSubmit={handleSubmit}
      model="EVENT"
      id={event.id}
    >
      <ImageUploader
        is_loading={update_mutation.isPending}
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
        label="Event Image"
        placeholder="https://example.com/event-image.jpg"
        image_file_field_name="image"
        image_url_field_name="image"
        image_type_field_name="image_type"
      />

      <InputField
        label="Name"
        name="name"
        placeholder="Event Name"
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <TextareaField
        label="Description"
        name="description"
        placeholder="Event Description"
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Price per person"
        name="price"
        type="number"
        step="0.01"
        required
        placeholder="Price"
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Capacity"
        name="capacity"
        type="number"
        step="1"
        required
        placeholder="Maximum participants"
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Start Date & Time"
        name="start"
        type="datetime-local"
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="End Date & Time"
        name="end"
        type="datetime-local"
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Guide ID"
        name="guide_id"
        placeholder="Tour guide ID (optional)"
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  );
};
