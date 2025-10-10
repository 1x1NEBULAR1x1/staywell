import { ImageUploader, InputField } from '@/components/admin/common/Form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { CruddableTypes, AdditionalOption } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';
import { query_client } from '@/lib/api';

type FormData = CruddableTypes<'ADDITIONAL_OPTION'>['create'] & { image_type: 'file' | 'url', files: File[], url: string };

interface AdditionalOptionModalProps {
  onClose: () => void,
  initial_data?: AdditionalOption
}

export const AdditionalOptionModal = ({ onClose, initial_data }: AdditionalOptionModalProps) => {
  const toast = useToast();
  const mutation = initial_data ? useModel('ADDITIONAL_OPTION').update(initial_data.id) : useModel('ADDITIONAL_OPTION').create();

  const form = useForm<FormData>({
    defaultValues: {
      name: initial_data?.name ?? '',
      description: initial_data?.description ?? '',
      image: initial_data?.image ?? '',
      price: initial_data?.price ?? 0,
      image_type: initial_data?.image ? 'url' : 'file',
      files: [],
      url: initial_data?.image ?? '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        description: data.description,
        image: data.image_type === 'url' ? data.url : undefined,
        file: data.image_type === 'file' ? data.files[0] : undefined,
        price: data.price,
      });
      toast.success(`Additional option ${!initial_data ? 'created' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during ${!initial_data ? 'creation' : 'update'}: ${error.message}`);
      console.error(error);
    } finally {
      query_client.invalidateQueries({ queryKey: ['additional_options'], exact: false });
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title={!initial_data ? 'Add Additional Option' : 'Edit Additional Option'}
      form={form}
      onSubmit={handleSubmit}
      model='ADDITIONAL_OPTION'
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
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label='Price'
        name='price'
        placeholder='Price'
        type='number'
        required
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  )
};
