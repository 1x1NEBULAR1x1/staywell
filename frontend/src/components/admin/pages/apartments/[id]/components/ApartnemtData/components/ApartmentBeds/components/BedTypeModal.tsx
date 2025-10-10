import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { CruddableTypes, BedType } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

type FormData = CruddableTypes<'BED_TYPE'>['create'] & { image_type: 'file' | 'url', files: File[], url: string };

interface BedTypeModalProps {
  onClose: () => void,
  refetch_bed_types: () => void,
  editing_bed_type?: BedType
}

export const BedTypeModal = ({ onClose, refetch_bed_types, editing_bed_type }: BedTypeModalProps) => {
  const toast = useToast();
  const mutation = editing_bed_type ? useModel('BED_TYPE').update(editing_bed_type.id) : useModel('BED_TYPE').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: editing_bed_type?.name ?? '',
      image: editing_bed_type?.image ?? '',
      image_type: editing_bed_type?.image ? 'url' : 'file',
      files: [],
      url: editing_bed_type?.image ?? '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {

      await mutation.mutateAsync({
        name: data.name,
        image: data.image_type === 'url' ? data.url : undefined,
        file: data.image_type === 'file' ? data.files[0] : undefined,
      });
      toast.success(`Bed type ${!editing_bed_type ? 'created' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${!editing_bed_type ? 'creation' : 'update'}: ${error.message}`);
      console.error(error);
    } finally {
      refetch_bed_types();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title={!editing_bed_type ? 'Add Bed Type' : 'Edit Bed Type'}
      form={form}
      onSubmit={handleSubmit}
      model='BED_TYPE'
      is_loading={mutation.isPending}
      id={editing_bed_type?.id}
    >
      <ImageUploader
        is_loading={mutation.isPending}
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
        label="Image"
        placeholder="https://example.com/image.jpg"
        image_file_field_name="files"
        image_url_field_name="url"
        image_type_field_name="image_type"
      />
      <InputField
        label='Name'
        name='name'
        placeholder='Name'
        required
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  )
};