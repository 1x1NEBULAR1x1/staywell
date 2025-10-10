'use client';

import { Path, UseFormRegister, RegisterOptions, FieldErrors, FieldValues } from 'react-hook-form';
import { classes } from '@/components/admin/common/Form';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  options?: { value: string, label: string }[];
  rows?: number;
}

export const FormField = <T extends FieldValues>({
  name,
  label,
  register,
  errors,
  rules,
  type = 'text',
  placeholder = '',
  disabled = false,
  hint,
  options,
  rows = 4
}: FormFieldProps<T>) => {
  const error_message = String(errors[name]?.message || '');
  const is_required = rules?.required ? true : false;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            className={`${classes.admin_form_textarea} ${errors[name] ? classes.admin_form_textarea_error : ''}`}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            {...register(name, rules)}
          />
        );
      case 'select':
        return (
          <select
            className={`${classes.admin_form_select} ${errors[name] ? classes.admin_form_select_error : ''}`}
            disabled={disabled}
            {...register(name, rules)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            className={`${classes.admin_form_input} ${errors[name] ? classes.admin_form_input_error : ''}`}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name, rules)}
          />
        );
    }
  };

  return (
    <div className={classes.admin_form_field}>
      <label className={classes.admin_form_label}>
        {label} {is_required && '*'}
      </label>

      {renderInput()}

      {hint && (
        <div className={classes.admin_form_hint}>{hint}</div>
      )}

      {errors[name] && (
        <span className={classes.admin_form_error}>
          {error_message}
        </span>
      )}
    </div>
  );
}; 