import { BadRequestException, Type, NestInterceptor } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

/**
 * Конфигурация для интерсептора загрузки изображений
 */
export interface ImageUploadConfig {
  max_file_size?: number; // размер в байтах
  allowed_mime_types?: string[];
}

/**
 * Создает интерсептор для загрузки изображений с валидацией
 */
export function createImageUploadInterceptor(
  fieldName: string = "file",
  config: ImageUploadConfig = {},
): Type<NestInterceptor> {
  const {
    max_file_size = 5 * 1024 * 1024, // 5MB по умолчанию
    allowed_mime_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  } = config;

  return FileInterceptor(fieldName, {
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, callback) => {
      if (allowed_mime_types.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const allowed_formats = allowed_mime_types
          .map((type) => type.replace("image/", "").toUpperCase())
          .join(", ");
        callback(
          new BadRequestException(
            `Недопустимый формат файла. Разрешены только: ${allowed_formats}`,
          ),
          false,
        );
      }
    },
  });
}

/**
 * Готовый интерсептор для загрузки изображений с настройками по умолчанию
 */
export const ImageUploadInterceptor: Type<NestInterceptor> =
  createImageUploadInterceptor();
