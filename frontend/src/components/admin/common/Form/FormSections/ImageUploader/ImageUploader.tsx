'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch, Path, FieldValues } from 'react-hook-form';
import { Camera, X } from 'lucide-react';
import classes from './ImageUploader.module.scss';
import { isValidImageUrl, getValidationRules } from './utils';
import { useImageUploader } from './useImageUploader';
import { Switch } from './components/Switch';
import { isImageType } from './utils';

interface ImageUploaderProps<T extends FieldValues> {
  is_loading: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  label: string;
  placeholder?: string;
  image_file_field_name: Path<T>;
  image_url_field_name: Path<T>;
  image_type_field_name: Path<T>;
  accepted_types?: string[];
  max_size_in_mb?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const ImageUploader = <T extends FieldValues>({
  is_loading,
  register,
  errors,
  setValue,
  watch,
  label,
  placeholder = "https://example.com/image.jpg",
  image_file_field_name,
  image_url_field_name,
  image_type_field_name,
  accepted_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'svg'],
  max_size_in_mb = 5,
  width = 150,
  height = 150,
  className = ''
}: ImageUploaderProps<T>) => {

  const {
    handleTypeChange,
    handleImageChange,
    handleUrlChange,
    handleRemoveImage,
    preview_image,
    image_type
  } = useImageUploader<T>({
    image_type_field_name,
    image_url_field_name,
    image_file_field_name,
    watch,
    setValue
  });

  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`
  };

  return (
    <div className={`${classes.image_uploader} ${className}`}>
      {/* Превью изображения слева */}
      <div className={classes.image_uploader_preview_container}>
        {image_type === 'file' ? (
          <div className={classes.image_uploader_container} style={containerStyle}>
            {preview_image ? (
              <>
                <input
                  type="file"
                  accept={accepted_types.join(',')}
                  className={classes.image_uploader_hidden_input}
                  disabled={is_loading}
                  {...register(image_file_field_name, getValidationRules<T>(accepted_types, max_size_in_mb))}
                  onChange={(e) => {
                    // Сначала вызываем стандартный onChange из register
                    const registerOnChange = register(image_file_field_name).onChange;
                    if (registerOnChange) {
                      registerOnChange(e);
                    }
                    // Затем наш кастомный обработчик для превью
                    handleImageChange(e);
                  }}
                  style={{ display: 'none' }}
                />
                <div className={classes.image_uploader_preview}>
                  <img
                    src={preview_image}
                    alt={'Image preview'}
                    width={width}
                    height={height}
                    className={classes.image_uploader_preview_image}
                  />
                </div>
                <button
                  type="button"
                  className={classes.image_uploader_remove_button}
                  onClick={handleRemoveImage}
                  disabled={is_loading}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept={accepted_types.join(',')}
                  className={classes.image_uploader_hidden_input}
                  disabled={is_loading}
                  {...register(image_file_field_name, getValidationRules<T>(accepted_types, max_size_in_mb))}
                  onChange={(e) => {
                    // Сначала вызываем стандартный onChange из register
                    const registerOnChange = register(image_file_field_name).onChange;
                    if (registerOnChange) {
                      registerOnChange(e);
                    }
                    // Затем наш кастомный обработчик для превью
                    handleImageChange(e);
                  }}
                />
                <div className={classes.image_uploader_placeholder}>
                  <Camera size={24} />
                  <span>Add image</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={classes.image_uploader_container} style={containerStyle}>
            {preview_image ? (
              <div className={classes.image_uploader_preview}>
                <img
                  src={preview_image}
                  alt={'Image preview'}
                  width={width}
                  height={height}
                  className={classes.image_uploader_preview_image}
                />
                <button
                  type="button"
                  className={classes.image_uploader_remove_button}
                  onClick={handleRemoveImage}
                  disabled={is_loading}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={classes.image_uploader_preview_placeholder} style={containerStyle}>
                <Camera size={24} />
                <span>Image preview</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Контролы справа */}
      <div className={classes.image_uploader_content}>
        <label className={classes.image_uploader_label}>
          {label}
        </label>

        {/* Переключатель типа изображения */}
        <Switch image_type={isImageType(image_type) ? image_type : 'file'} handleTypeChange={handleTypeChange} is_loading={is_loading} />

        {image_type === 'url' && (
          <div className={classes.image_uploader_url_input}>
            <input
              type="url"
              className={`${classes.image_uploader_input} ${errors[image_url_field_name] ? classes.image_uploader_input_error : ''}`}
              placeholder={placeholder}
              disabled={is_loading}
              {...register(image_url_field_name, {
                validate: {
                  validUrl: (value: unknown): string | true => {
                    const url = String(value);
                    if (!url) return true;
                    return isValidImageUrl(url) ? true : 'Invalid image URL';
                  }
                }
              })}
              onChange={handleUrlChange}
            />
          </div>
        )}

        {errors[image_file_field_name] && (
          <span className={classes.image_uploader_error}>
            {String((errors[image_file_field_name])?.message || '')}
          </span>
        )}
        {errors[image_url_field_name] && (
          <span className={classes.image_uploader_error}>
            {String((errors[image_url_field_name])?.message || '')}
          </span>
        )}
      </div>
    </div>
  );
}; 