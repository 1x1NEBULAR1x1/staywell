import { UseFormRegister, FieldErrors, RegisterOptions, Path, FieldValues } from 'react-hook-form';
import classes from '../FormStyles.module.scss';

interface TextareaFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  is_loading?: boolean;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  hint?: string;
  rows?: number;
}

export const TextareaField = <T extends FieldValues>({
  register,
  errors,
  is_loading = false,
  name,
  label,
  placeholder,
  required = false,
  rules,
  hint,
  rows = 4
}: TextareaFieldProps<T>) => {
  return (
    <div className={classes.admin_form_section}>
      <div className={classes.admin_form_field}>
        <label className={classes.admin_form_label}>
          {label} {required && '*'}
        </label>
        <textarea
          className={`${classes.admin_form_textarea} ${errors[name] ? classes.admin_form_textarea_error : ''}`}
          placeholder={placeholder}
          disabled={is_loading}
          rows={rows}
          {...register(name, {
            required: required,
            ...rules
          })}
        />
        {hint && (
          <div className={classes.admin_form_hint}>
            {hint}
          </div>
        )}
        {errors[name] && (
          <span className={classes.admin_form_error}>
            {String(errors[name]?.message || '')}
          </span>
        )}
      </div>
    </div>
  );
}; 