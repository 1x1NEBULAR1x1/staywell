import { UseFormRegister, FieldErrors, RegisterOptions, Path, FieldValues } from 'react-hook-form';
import classes from '../FormStyles.module.scss';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  is_loading?: boolean;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  hint?: string;
}

export const SelectField = <T extends FieldValues>({
  register,
  errors,
  is_loading = false,
  name,
  label,
  options,
  placeholder,
  required = false,
  rules,
  hint
}: SelectFieldProps<T>) => {
  return (
    <div className={classes.admin_form_section}>
      <div className={classes.admin_form_field}>
        <label className={classes.admin_form_label}>
          {label} {required && '*'}
        </label>
        <select
          className={`${classes.admin_form_select} ${errors[name] ? classes.admin_form_select_error : ''}`}
          disabled={is_loading}
          {...register(name, {
            required: required,
            ...rules
          })}
        >
          <option value="">{placeholder}</option>
          {options.map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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