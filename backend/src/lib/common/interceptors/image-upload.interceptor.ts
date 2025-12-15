import { BadRequestException, Type, NestInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Configuration for image upload interceptor
 */
export interface ImageUploadConfig {
  max_file_size?: number; // size in bytes
  allowed_mime_types?: string[];
}

/**
 * Creates interceptor for image upload with validation
 */
export function createImageUploadInterceptor(
  fieldName: string = 'file',
  config: ImageUploadConfig = {},
): Type<NestInterceptor> {
  const {
    max_file_size = 5 * 1024 * 1024, // 5MB by default
    allowed_mime_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
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
          .map((type) => type.replace('image/', '').toUpperCase())
          .join(', ');
        callback(
          new BadRequestException(
            `Invalid file format. Only allowed: ${allowed_formats}`,
          ),
          false,
        );
      }
    },
  });
}

/**
 * Ready-to-use interceptor for image upload with default settings
 */
export const ImageUploadInterceptor: Type<NestInterceptor> =
  createImageUploadInterceptor();
