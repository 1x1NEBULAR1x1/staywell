import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries';
import { useToast } from '@/hooks/common';
import { isAxiosError } from 'axios';
import { InputField } from '@/components/admin/common/Form/FormSections/InputField';
import { SelectField } from '@/components/admin/common/Form';

type BookingVariantFornModalProps = {
  onClose: () => void;
  apartment_id: string;
  refetch: () => void;
}

export const BookingVariantFornModal = ({ onClose, apartment_id, refetch }: BookingVariantFornModalProps) => {
  const create_mutation = useModel("BOOKING_VARIANT").create()
  const toast = useToast()
  const { data: apartments, isLoading: is_apartments_loading } = useModel("APARTMENT").get({ take: 1000, skip: 0 })

  const form = useForm<CruddableTypes<'BOOKING_VARIANT'>['create']>({
    defaultValues: {
      price: 0,
      capacity: 0,
      is_available: true,
      apartment_id,
    },
  });

  const handleCreate = async (data: CruddableTypes<'BOOKING_VARIANT'>['create']) => {
    try {
      await create_mutation.mutateAsync(data)
      onClose()
      refetch()
    } catch (e) {
      isAxiosError(e) && toast.error(`Error during creation: ${e.message}`)
      console.error(e)
    }
  }

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title='Add Variant'
      form={form}
      onSubmit={handleCreate}
      is_loading={create_mutation.isPending}
      size='md'
      reset_on_close
      model='BOOKING_VARIANT'
    >
      <InputField
        label='Price'
        name='price'
        type='number'
        step='0.01'
        required
        placeholder='Price'
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label='Capacity'
        name='capacity'
        placeholder='Capacity'
        required
        type='number'
        step='1'
        register={form.register}
        errors={form.formState.errors}
      />
      <SelectField
        label='Is Available'
        name='is_available'
        placeholder='Is Available'
        register={form.register}
        errors={form.formState.errors}
        options={[
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ]}
      />
      {!apartment_id && <SelectField
        label='Apartment'
        name='apartment_id'
        placeholder='Select Apartment'
        required
        register={form.register}
        errors={form.formState.errors}
        is_loading={is_apartments_loading}
        options={apartments?.items.map((apartment) => ({ label: apartment.name || `Apartment #${apartment.number}`, value: apartment.id })) || []}
      />}
    </BaseFormModal>
  )
};