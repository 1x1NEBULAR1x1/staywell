import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { Amenity, CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';
import { query_client } from '@/lib/api';

type FormData = CruddableTypes<'AMENITY'>['create'] & { image_type: 'file' | 'url', files: File[], url: string };

interface AmenityModalProps {
  onClose: () => void,
  initial_data?: Amenity
}

export const AmenityModal = ({ onClose, initial_data }: AmenityModalProps) => {
  const toast = useToast();
  const mutation = initial_data ? useModel('AMENITY').update(initial_data.id) : useModel('AMENITY').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: initial_data?.name ?? '',
      image: initial_data?.image ?? '',
      description: initial_data?.description ?? '',
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
        description: data.description,
      });
      toast.success(`Amenity ${!initial_data ? 'created' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${!initial_data ? 'creation' : 'update'}: ${error.message}`);
      console.error(error);
    } finally {
      query_client.invalidateQueries({ queryKey: ['amenities'], exact: false });
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title={!initial_data ? 'Add Amenity' : 'Edit Amenity'}
      form={form}
      onSubmit={handleSubmit}
      model='AMENITY'
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
      <InputField
        label='Description'
        name='description'
        placeholder='Description'
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  )
};
