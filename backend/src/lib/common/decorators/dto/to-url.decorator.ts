import { Transform } from 'class-transformer';
import { IsUrl, IsOptional, ValidationOptions } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface ToUrlOptions {
  required?: boolean;
  description?: string;
  example?: string;
}

/**
 * @ToUrl ensures a valid URL string with optional protocol validation.
 */
export function ToUrl(options: ToUrlOptions = {}) {
  const { required = true, description, example } = options;

  return function (target: object, property_key: string | symbol) {
    ApiProperty({
      type: 'string',
      format: 'url',
      description,
      example,
      required,
    })(target, property_key);

    Transform(({ value }: { value: unknown }) => String(value).trim())(
      target,
      property_key,
    );

    if (!required) IsOptional()(target, property_key);

    Transform(({ value }: { value: unknown }) => {
      if (typeof value === 'string' && value.trim().length > 1) {
        IsUrl()(target, property_key);
      }
      return value;
    })(target, property_key);
  };
}
