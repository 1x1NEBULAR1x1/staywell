'use client';
import classes from './FiltersModal.module.scss';
import { classes as commonClasses, InputField, SelectField } from '@/components/admin/common/Form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/admin/common/Modal/Modal';
import { ApartmentsFilters, ApartmentType } from '@shared/src';
import { formatToTitle } from '@/lib/api';

interface FiltersModalProps {
  onClose: () => void;
  currentFilters: Partial<ApartmentsFilters>;
  onApplyFilters: (filters: Partial<ApartmentsFilters>) => void;
}

type FiltersFormData = {
  number?: number;
  name?: string;
  description?: string;
  deposit?: number;
  floor?: number;
  rooms_count?: number;
  max_capacity?: number;
  is_available?: boolean;
  is_smoking?: boolean;
  is_pet_friendly?: boolean;
  type?: ApartmentType;
  search?: string;
};

export const FiltersModal = ({
  onClose,
  currentFilters,
  onApplyFilters
}: FiltersModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FiltersFormData>({
    defaultValues: {
      number: currentFilters.number,
      name: currentFilters.name || '',
      description: currentFilters.description || '',
      deposit: currentFilters.deposit,
      floor: currentFilters.floor,
      rooms_count: currentFilters.rooms_count,
      max_capacity: currentFilters.max_capacity,
      is_available: currentFilters.is_available,
      is_smoking: currentFilters.is_smoking,
      is_pet_friendly: currentFilters.is_pet_friendly,
      type: currentFilters.type,
      search: currentFilters.search || '',
    }
  });

  const handleSubmit = async (data: FiltersFormData) => {
    setIsLoading(true);

    // Фильтруем пустые значения
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) =>
        value !== undefined && value !== '' && value !== null
      )
    ) as Partial<ApartmentsFilters>;

    onApplyFilters(filteredData);
    setIsLoading(false);
    onClose();
  };

  const handleReset = () => {
    form.reset({
      number: undefined,
      name: '',
      description: '',
      deposit: undefined,
      floor: undefined,
      rooms_count: undefined,
      max_capacity: undefined,
      is_available: undefined,
      is_smoking: undefined,
      is_pet_friendly: undefined,
      type: undefined,
      search: '',
    });
    onApplyFilters({});
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Filters for apartments"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className={commonClasses.admin_form}>
        <InputField
          name="search"
          label="Search"
          placeholder="Search by name or description"
          register={form.register}
          errors={form.formState.errors}
        />

        <InputField
          name="number"
          label="Apartment number"
          step='1'
          type='number'
          placeholder="Number"
          register={form.register}
          errors={form.formState.errors}
        />

        <InputField
          name="floor"
          label="Floor"
          step='1'
          type='number'
          placeholder="Floor"
          register={form.register}
          errors={form.formState.errors}
        />

        <InputField
          name="rooms_count"
          step='1'
          type='number'
          label="Number of rooms"
          placeholder="Rooms"
          register={form.register}
          errors={form.formState.errors}
        />

        <InputField
          name="max_capacity"
          step='1'
          type='number'
          label="Maximum capacity"
          placeholder="Guests"
          register={form.register}
          errors={form.formState.errors}
        />

        <SelectField
          name="type"
          label="Apartment type"
          options={Object.values(ApartmentType).map((type) => ({ label: formatToTitle(type), value: type }))}
          register={form.register}
          errors={form.formState.errors}
        />


        <InputField
          name="deposit"
          label="Deposit"
          step='0.01'
          type='number'
          placeholder="Deposit"
          register={form.register}
          errors={form.formState.errors}
        />


        <SelectField
          name="is_pet_friendly"
          label="With pets"
          options={[{ label: 'Allowed', value: 'true' }, { label: 'Not allowed', value: 'false' }]}
          register={form.register}
          errors={form.formState.errors}
        />

        <SelectField
          name="is_available"
          label="Availability"
          options={[{ label: 'Available', value: 'true' }, { label: 'Not available', value: 'false' }]}
          register={form.register}
          errors={form.formState.errors}
        />

        <SelectField
          name="is_smoking"
          label="Smoking"
          options={[{ label: 'Allowed', value: 'true' }, { label: 'Not allowed', value: 'false' }]}
          register={form.register}
          errors={form.formState.errors}
        />
        <SelectField
          name="is_pet_friendly"
          label="With pets"
          options={[{ label: 'Allowed', value: 'true' }, { label: 'Not allowed', value: 'false' }]}
          register={form.register}
          errors={form.formState.errors}
        />

        <div className={classes.actions}>
          <button
            type="button"
            className={classes.button}
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className={classes.button}
            disabled={isLoading}
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
