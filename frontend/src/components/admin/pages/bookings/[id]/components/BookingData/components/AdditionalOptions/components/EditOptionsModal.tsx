'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { InputField, SelectField } from '@/components/admin/common/Form';
import { ExtendedBookingAdditionalOption, CruddableTypes } from '@shared/src';
import { useModel } from '@/hooks/admin/queries/useModel';

interface EditOptionsModalProps {
  booking_id: string;
  current_options: ExtendedBookingAdditionalOption[];
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  options: {
    option_id: string;
    amount: number;
    existing_id?: string;
  }[];
};

export const EditOptionsModal = ({
  booking_id,
  current_options,
  onClose,
  onSuccess
}: EditOptionsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Получаем все доступные опции
  const { data: allOptions } = useModel('ADDITIONAL_OPTION').get({});

  const form = useForm<FormData>({
    defaultValues: {
      options: current_options.map(opt => ({
        option_id: opt.option_id,
        amount: opt.amount,
        existing_id: opt.id
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options"
  });

  const handleSubmit = async (data: FormData) => {
    if (!allOptions?.items) return;

    setIsLoading(true);

    try {
      // Удаляем существующие опции
      for (const currentOption of current_options) {
        await fetch(`/api/booking-additional-options/${currentOption.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      // Добавляем новые опции
      for (const option of data.options) {
        if (option.option_id && option.amount > 0) {
          await fetch('/api/booking-additional-options', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              booking_id,
              option_id: option.option_id,
              amount: option.amount
            })
          });
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewOption = () => {
    append({ option_id: '', amount: 1 });
  };

  const availableOptions = allOptions?.items || [];

  return (
    <BaseFormModal
      is_open={true}
      onClose={onClose}
      title="Edit Additional Services"
      form={form}
      onSubmit={handleSubmit}
      is_loading={isLoading}
      model="BOOKING_ADDITIONAL_OPTION"
      size="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((field, index) => (
          <div key={field.id} style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'end',
            padding: '16px',
            border: '1px solid #e5e5e5',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 2 }}>
              <SelectField
                label="Service"
                name={`options.${index}.option_id`}
                placeholder="Select service"
                register={form.register}
                options={availableOptions.map(option => ({
                  label: `${option.name} ($${option.price})`,
                  value: option.id
                }))}
                errors={form.formState.errors}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputField
                label="Quantity"
                name={`options.${index}.amount`}
                type="number"
                min="1"
                max="10"
                placeholder="1"
                register={form.register}
                errors={form.formState.errors}
                required
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                padding: '8px 12px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                height: '40px'
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addNewOption}
          style={{
            padding: '12px 20px',
            background: '#3252df',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          + Add Service
        </button>

        {availableOptions.length > 0 && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Available Services:</h4>
            {availableOptions.map(option => (
              <div key={option.id} style={{ marginBottom: '4px' }}>
                <strong>{option.name}</strong> - ${option.price} - {option.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseFormModal>
  );
};

