"use client";

import { Camera, X } from "lucide-react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Switch } from "./components/Switch";
import classes from "./ImageUploader.module.scss";
import { useImageUploader } from "./useImageUploader";
import { getValidationRules, isImageType, isValidImageUrl } from "./utils";

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
  accepted_types = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "svg",
  ],
  max_size_in_mb = 5,
  width = 150,
  height = 150,
  className = "",
}: ImageUploaderProps<T>) => {
  const {
    handleTypeChange,
    handleImageChange,
    handleUrlChange,
    handleRemoveImage,
    preview_image,
    image_type,
  } = useImageUploader<T>({
    image_type_field_name,
    image_url_field_name,
    image_file_field_name,
    watch,
    setValue,
  });

  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  const onInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // First call the standard onChange from register
    const registerOnChange = register(image_file_field_name).onChange;
    if (registerOnChange) registerOnChange(e);
    // Then our custom handler for preview
    handleImageChange(e);
  };

  return (
    <div className={`${classes.image_uploader} ${className}`}>
      {/* Left image preview */}
      <div className={classes.image_uploader_preview_container}>
        {image_type === "file" ? (
          <div
            className={classes.image_uploader_container}
            style={containerStyle}
          >
            {preview_image ? (
              <>
                <input
                  type="file"
                  accept={accepted_types.join(",")}
                  className={classes.image_uploader_hidden_input}
                  disabled={is_loading}
                  {...register(
                    image_file_field_name,
                    getValidationRules<T>(accepted_types, max_size_in_mb),
                  )}
                  onChange={onInputFile}
                  style={{ display: "none" }}
                />
                <div className={classes.image_uploader_preview}>
                  <img
                    src={preview_image}
                    alt={"Image preview"}
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
                  accept={accepted_types.join(",")}
                  className={classes.image_uploader_hidden_input}
                  disabled={is_loading}
                  {...register(
                    image_file_field_name,
                    getValidationRules<T>(accepted_types, max_size_in_mb),
                  )}
                  onChange={onInputFile}
                />
                <div className={classes.image_uploader_placeholder}>
                  <Camera size={24} />
                  <span>Add image</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            className={classes.image_uploader_container}
            style={containerStyle}
          >
            {preview_image ? (
              <div className={classes.image_uploader_preview}>
                <img
                  src={preview_image}
                  alt={"Image preview"}
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
              <div
                className={classes.image_uploader_preview_placeholder}
                style={containerStyle}
              >
                <Camera size={24} />
                <span>Image preview</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className={classes.image_uploader_content}>
        <p className={classes.image_uploader_label}>{label}</p>

        {/* Image type switcher */}
        <Switch
          image_type={isImageType(image_type) ? image_type : "file"}
          handleTypeChange={handleTypeChange}
          is_loading={is_loading}
        />

        {image_type === "url" && (
          <div className={classes.image_uploader_url_input}>
            <input
              type="url"
              className={`${classes.image_uploader_input} ${errors[image_url_field_name] ? classes.image_uploader_input_error : ""}`}
              placeholder={placeholder}
              disabled={is_loading}
              {...register(image_url_field_name, {
                validate: {
                  validUrl: (value: unknown): string | true => {
                    const url = String(value);
                    if (!url) return true;
                    return isValidImageUrl(url) ? true : "Invalid image URL";
                  },
                },
              })}
              onChange={handleUrlChange}
            />
          </div>
        )}

        {errors[image_file_field_name] && (
          <span className={classes.image_uploader_error}>
            {String(errors[image_file_field_name]?.message || "")}
          </span>
        )}
        {errors[image_url_field_name] && (
          <span className={classes.image_uploader_error}>
            {String(errors[image_url_field_name]?.message || "")}
          </span>
        )}
      </div>
    </div>
  );
};
