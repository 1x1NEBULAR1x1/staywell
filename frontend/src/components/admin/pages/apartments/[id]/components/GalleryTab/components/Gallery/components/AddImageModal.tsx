'use client';

import { CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries';
import { useForm } from 'react-hook-form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { usePId } from '@/hooks/common/useId';

type AddImageModalProps = {
  apartment_id: string;
  onClose: () => void;
}

type FormData = CruddableTypes<'APARTMENT_IMAGE'>['create'] & {
  image_type: 'file' | 'url';
  file: FileList | undefined;
}

export const AddImageModal = ({ onClose }: AddImageModalProps) => {
  const id = usePId();
  const { refetch: refetch_apartment } = useModel('APARTMENT').find(id);
  const create_mutation = useModel('APARTMENT_IMAGE').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: undefined,
      description: null,
      image: undefined,
      file: undefined,
      image_type: 'file',
      apartment_id: id
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    try {
      await create_mutation.mutateAsync({
        name: data.name,
        description: data.description,
        image: data.image_type === 'url' ? data.image : undefined,
        file: data.image_type === 'file' ? data.file?.[0] : undefined,
        apartment_id: id
      });
      refetch_apartment();
      onClose();
    } catch (error) {
      console.error('Failed to create image:', error);
    }
  }

  return (
    <BaseFormModal
      is_open
      model="APARTMENT_IMAGE"
      title='Add Image'
      onClose={onClose}
      form={form}
      onSubmit={onSubmit}
      is_loading={create_mutation.isPending}
      size='md'
      reset_on_close
    >
      <ImageUploader
        is_loading={create_mutation.isPending}
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
        label='Image'
        placeholder='https://example.com/image.jpg'
        image_file_field_name='file'
        image_url_field_name='image'
        image_type_field_name='image_type'
      />
      <InputField
        label='Name'
        name='name'
        placeholder='Name'
        rules={{ maxLength: 2048 }}
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label='Description'
        name='description'
        placeholder='Description'
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  );
};