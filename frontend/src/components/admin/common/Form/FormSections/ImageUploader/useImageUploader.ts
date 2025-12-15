import { useEffect, useState } from "react";
import type {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  createSetValueWrapper,
  isImageType,
  isString,
  isValidImageUrl,
} from "./utils";

interface UseImageUploaderProps<T extends FieldValues> {
  image_type_field_name: Path<T>;
  image_url_field_name: Path<T>;
  image_file_field_name: Path<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export const useImageUploader = <T extends FieldValues>({
  image_type_field_name,
  image_url_field_name,
  image_file_field_name,
  watch,
  setValue,
}: UseImageUploaderProps<T>) => {
  const [preview_image, setPreviewImage] = useState<string | null>(null);
  const set_value_wrapper = createSetValueWrapper(setValue);
  const watched_image_type = watch(image_type_field_name);
  const image_type = isImageType(watched_image_type)
    ? watched_image_type
    : "file";
  const image_url = watch(image_url_field_name);

  // Handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    set_value_wrapper.setStringValue(image_url_field_name, url, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (url && isValidImageUrl(url)) {
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  // Handle image removal
  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    set_value_wrapper.setUndefinedValue(image_file_field_name, {
      shouldValidate: false,
    });
    set_value_wrapper.setStringValue(image_url_field_name, "", {
      shouldValidate: false,
    });
    setPreviewImage(null);

    // Clear file input with type guard
    const fileInput = document.querySelector(`input[type="file"]`);
    if (fileInput instanceof HTMLInputElement) {
      fileInput.value = "";
    }
  };

  // Toggle image type
  const handleTypeChange = (type: "file" | "url") => {
    set_value_wrapper.setImageTypeValue(image_type_field_name, type, {
      shouldValidate: false,
    });
    set_value_wrapper.setUndefinedValue(image_file_field_name, {
      shouldValidate: false,
    });
    set_value_wrapper.setStringValue(image_url_field_name, "", {
      shouldValidate: false,
    });
    setPreviewImage(null);
  };

  // Watch URL changes for preview
  useEffect(() => {
    const typeString = String(image_type);
    if (typeString === "url" && image_url) {
      if (isString(image_url) && isValidImageUrl(image_url)) {
        setPreviewImage(image_url);
      } else {
        setPreviewImage(null);
      }
    }
  }, [image_type, image_url]);

  return {
    preview_image,
    image_type,
    handleImageChange,
    handleUrlChange,
    handleRemoveImage,
    handleTypeChange,
  };
};
