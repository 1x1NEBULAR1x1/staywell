import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { CruddableTypes, ExtendedAmenity } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

type FormData = CruddableTypes<'AMENITY'>['create'] & { image_type: 'file' | 'url', files: File[], url: string };

interface AmenityModalProps {
  onClose: () => void,
  refetch: () => void,
  editing_amenity?: ExtendedAmenity
}

export const AmenityModal = ({ onClose, refetch, editing_amenity }: AmenityModalProps) => {
  const toast = useToast();
  const mutation = editing_amenity ? useModel('AMENITY').update(editing_amenity.id) : useModel('AMENITY').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: editing_amenity?.name ?? '',
      image: editing_amenity?.image ?? '',
      description: editing_amenity?.description ?? '',
      image_type: !!editing_amenity?.image ? 'url' : 'file',
      files: [],
      url: editing_amenity?.image ?? '',
    },
  });

  const handleCreate = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        image: data.image_type === 'url' ? data.url : undefined,
        file: data.image_type === 'file' ? data.files[0] : undefined,
        description: data.description,
      });
      toast.success(`Amenity ${!editing_amenity ? 'created' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${!editing_amenity ? 'creating' : 'updating'}: ${error.message}`);
      console.error(error);
    } finally {
      refetch();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title='Add Amenity'
      form={form}
      onSubmit={handleCreate}
      model='AMENITY'
      is_loading={mutation.isPending}
      id={editing_amenity?.id}
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
