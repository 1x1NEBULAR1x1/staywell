'use client';

import { ExtendedApartment, CruddableTypes, ApartmentType } from '@shared/src';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { ImageUploader, InputField, SelectField, TextareaField } from '@/components/admin/common/Form';
import { formatToTitle } from '@/lib/api';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

interface EditApartmentModalProps {
  apartment: ExtendedApartment;
  onClose: () => void;
  refetch: () => void;
}

type FormData = CruddableTypes<'APARTMENT'>['update'] & {
  image_type: 'file' | 'url';
}

export const EditApartmentModal = ({ apartment, onClose, refetch }: EditApartmentModalProps) => {
  const update_mutation = useModel('APARTMENT').update(apartment.id);
  const toast = useToast();
  const form = useForm<FormData>({
    defaultValues: { ...apartment, image: apartment.image || undefined, image_type: 'url' },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await update_mutation.mutateAsync(data);
      onClose();
      toast.success('Apartment has been updated successfully');
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`);
      console.error('Failed to update apartment:', error);
    } finally {
      refetch();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Edit Apartment"
      form={form}
      onSubmit={handleSubmit}
      model="APARTMENT"
      id={apartment.id}
    >
      <ImageUploader
        is_loading={update_mutation.isPending}
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
      <TextareaField
        label="Rules"
        name="rules"
        placeholder="Rules"
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Number"
        name="number"
        step='1'
        required
        placeholder="Number"
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Floor"
        name="floor"
        step='1'
        required
        placeholder="Floor"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Rooms Count"
        name="rooms_count"
        step='1'
        required
        placeholder="Rooms Count"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Max Capacity"
        name="max_capacity"
        step='1'
        required
        placeholder="Max Capacity"
        register={form.register}
        errors={form.formState.errors}
      />

      <SelectField
        label="Type"
        name="type"
        placeholder="Type"
        register={form.register}
        options={Object.values(ApartmentType).map((type) => ({ label: formatToTitle(type), value: type }))}
        errors={form.formState.errors}
      />

      <InputField
        label="Deposit"
        name="deposit"
        type='number'
        step='0.01'
        required
        placeholder="Deposit"
        register={form.register}
        errors={form.formState.errors}
      />

      <SelectField
        label="Is Available"
        name="is_available"
        placeholder="Is Available"
        register={form.register}
        options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
        errors={form.formState.errors}
      />
      <SelectField
        label="Is Smoking"
        name="is_smoking"
        placeholder="Is Smoking"
        register={form.register}
        options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
        errors={form.formState.errors}
      />
      <SelectField
        label="Is Pet Friendly"
        name="is_pet_friendly"
        placeholder="Is Pet Friendly"
        register={form.register}
        options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  );
};
