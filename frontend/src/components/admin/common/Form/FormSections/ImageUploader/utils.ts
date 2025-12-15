import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";

// Check image URL validity
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);

    const pathname = urlObj.pathname.toLowerCase();
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname);

    const searchParams = urlObj.searchParams;
    const hasImageFormat =
      searchParams.has("format") || searchParams.has("auto");

    const imageHosts = [
      "imgur.com",
      "i.imgur.com",
      "media.giphy.com",
      "i.giphy.com",
      "images.unsplash.com",
      "picsum.photos",
      "via.placeholder.com",
      "dummyimage.com",
      "flagcdn.com",
      "www.countryflags.io",
    ];
    const isImageHost = imageHosts.some((host) =>
      urlObj.hostname.includes(host),
    );

    return hasImageExtension || hasImageFormat || isImageHost;
  } catch {
    return false;
  }
};

// Generate validation rules
export const getValidationRules = <T extends FieldValues>(
  acceptedTypes: string[],
  maxSizeInMB: number,
): RegisterOptions<T, Path<T>> => {
  return {
    validate: {
      fileSize: (value: unknown) => {
        const files = value as FileList | undefined;
        if (!files?.[0]) return true;
        const file = files[0];
        if (file.size > maxSizeInMB * 1024 * 1024) {
          return `File size must not exceed ${maxSizeInMB} MB`;
        }
        return true;
      },
      fileType: (value: unknown) => {
        const files = value as FileList | undefined;
        if (!files?.[0]) return true;
        const file = files[0];
        if (!acceptedTypes.includes(file.type)) {
          const typeNames = acceptedTypes
            .map((type) => type.split("/")[1].toUpperCase())
            .join(", ");
          return `Only ${typeNames} files are allowed`;
        }
        return true;
      },
    },
  };
};

// Type guards
export const isImageType = (value: unknown): value is "file" | "url" => {
  return value === "file" || value === "url";
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

// Type-safe setValue wrapper that handles react-hook-form complexity
interface SetValueOptions {
  shouldValidate?: boolean;
  shouldDirty?: boolean;
}

export const createSetValueWrapper = <T extends FieldValues>(
  setValue: UseFormSetValue<T>,
) => {
  return {
    setStringValue: (
      name: Path<T>,
      value: string,
      options?: SetValueOptions,
    ) => {
      // Internal type assertion is encapsulated here
      const typedSetValue = setValue as (
        name: string,
        value: string,
        options?: SetValueOptions,
      ) => void;
      typedSetValue(name, value, options);
    },
    setImageTypeValue: (
      name: Path<T>,
      value: "file" | "url",
      options?: SetValueOptions,
    ) => {
      const typedSetValue = setValue as (
        name: string,
        value: "file" | "url",
        options?: SetValueOptions,
      ) => void;
      typedSetValue(name, value, options);
    },
    setUndefinedValue: (name: Path<T>, options?: SetValueOptions) => {
      const typedSetValue = setValue as (
        name: string,
        value: undefined,
        options?: SetValueOptions,
      ) => void;
      typedSetValue(name, undefined, options);
    },
  };
};
