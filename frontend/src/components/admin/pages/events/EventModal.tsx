'use client';

import { ExtendedEvent, CruddableTypes } from '@shared/src';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { ImageUploader, InputField, SelectField, TextareaField } from '@/components/admin/common/Form';
import { formatToTitle } from '@/lib/api';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

interface EventModalProps {
  initial_data?: ExtendedEvent;
  onClose?: () => void;
}

type FormData = CruddableTypes<'EVENT'>['create'] & {
  image_type: 'file' | 'url';
}

export const EventModal = ({ initial_data, onClose = () => { } }: EventModalProps) => {
  const mutation = initial_data ? useModel('EVENT').update(initial_data.id) : useModel('EVENT').create();
  const { data, isLoading: is_guides_loading } = useModel('USER').get({ role: 'GUIDE', skip: 0, take: 1000 });
  const query = initial_data ? useModel('EVENT').find(initial_data.id) : { refetch: () => { } };
  const toast = useToast();
  const form = useForm<FormData>({
    defaultValues: { ...initial_data, image: initial_data?.image, image_type: 'file', guide_id: initial_data?.guide?.id },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
      onClose();
      toast.success(`Event ${initial_data ? 'updated' : 'created'} successfully`);
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${initial_data ? 'update' : 'creation'}: ${error.message}`);
      console.error('Failed to update event:', error);
    } finally {
      query.refetch();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title={initial_data ? 'Edit Event' : 'Create Event'}
      form={form}
      onSubmit={handleSubmit}
      model="EVENT"
      id={initial_data?.id ?? undefined}
      size='lg'
    >
      <ImageUploader
        is_loading={mutation.isPending}
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
        label="Image"
        placeholder="https://example.com/image.jpg"
        image_file_field_name="image"
        image_url_field_name="image"
        image_type_field_name="image_type"
      />

      <InputField
        label="Name"
        name="name"
        placeholder="Name"
        required
        register={form.register}
        errors={form.formState.errors}
      />

      <TextareaField
        label="Description"
        name="description"
        placeholder="Description"
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
        step='1'
        required
        placeholder="Capacity"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Start"
        name="start"
        type="datetime-local"
        required
        placeholder="Start"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="End"
        name="end"
        type="datetime-local"
        required
        placeholder="End"
        register={form.register}
        errors={form.formState.errors}
      />

      <SelectField
        label="Guide"
        name="guide_id"
        placeholder={!is_guides_loading && data?.items.length === 0 ? "No guides found" : "Select a guide"}
        is_loading={is_guides_loading}
        disabled={is_guides_loading || data?.items.length === 0}
        register={form.register}
        options={data?.items.map((guide) => ({ label: formatToTitle(guide.first_name) + ' ' + formatToTitle(guide.last_name), value: guide.id })) || []}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  );
};
