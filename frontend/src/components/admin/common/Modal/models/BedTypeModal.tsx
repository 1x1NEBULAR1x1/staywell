import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { CruddableTypes, BedType } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';
import { query_client } from '@/lib/api';

type FormData = CruddableTypes<'BED_TYPE'>['create'] & { image_type: 'file' | 'url', files: File[], url: string };

interface BedTypeModalProps {
  onClose: () => void,
  initial_data?: BedType
}

export const BedTypeModal = ({ onClose, initial_data }: BedTypeModalProps) => {
  const toast = useToast();
  const mutation = initial_data ? useModel('BED_TYPE').update(initial_data.id) : useModel('BED_TYPE').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: initial_data?.name ?? '',
      image: initial_data?.image ?? '',
      image_type: initial_data?.image ? 'url' : 'file',
      files: [],
      url: initial_data?.image ?? '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        image: data.image_type === 'url' ? data.url : undefined,
        file: data.image_type === 'file' ? data.files[0] : undefined,
      });
      toast.success(`Bed type ${!initial_data ? 'created' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${!initial_data ? 'creation' : 'update'}: ${error.message}`);
      console.error(error);
    } finally {
      query_client.invalidateQueries({ queryKey: ['bed_types'], exact: false });
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title={!initial_data ? 'Add Bed Type' : 'Edit Bed Type'}
      form={form}
      onSubmit={handleSubmit}
      model='BED_TYPE'
      is_loading={mutation.isPending}
      id={initial_data?.id}
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