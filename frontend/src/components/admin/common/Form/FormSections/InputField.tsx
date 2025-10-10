import { UseFormRegister, FieldErrors, RegisterOptions, Path, FieldValues } from 'react-hook-form';
import styles from '../FormStyles.module.scss';
import { HTMLInputTypeAttribute } from 'react';

interface InputFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  is_loading?: boolean;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  hint?: string;
}

export const InputField = <T extends FieldValues>({
  register,
  errors,
  is_loading = false,
  name,
  label,
  type = 'text',
  required = false,
  rules,
  hint,
  ...props
}: InputFieldProps<T>) => {

  return (
    <div className={styles.admin_form_section}>
      <div className={styles.admin_form_field}>
        <label className={styles.admin_form_label}>
          {label} {required && '*'}
        </label>
        <input
          type={type}
          className={`${styles.admin_form_input} ${errors[name] ? styles.admin_form_input_error : ''}`}
          disabled={is_loading}
          {...props}
          {...register(name, {
            required: required ? 'Field is required' : false,
            ...rules
          })}
        />
        {hint && (
          <div className={styles.admin_form_hint}>
            {hint}
          </div>
        )}
        {errors[name] && (
          <span className={styles.admin_form_error}>
            {String(errors[name]?.message || '')}
          </span>
        )}
      </div>
    </div>
  );
}; 