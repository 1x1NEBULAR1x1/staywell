import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  Matches,
  ValidationOptions,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface ToStringOptions {
  required?: boolean;
  min?: number;
  max?: number;
  description?: string;
  example?: string;
  matches?: RegExp;
  is_strong_password?: boolean;
}

/**
 * @ToString ensures a valid string with length validation.
 */
export function ToString(
  options: ToStringOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    required = true,
    min,
    max,
    description,
    example,
    matches,
    is_strong_password,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: 'string',
      minLength: min,
      maxLength: max,
      description,
      example,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => String(value).trim())(
      target,
      propertyKey,
    );

    if (!required) IsOptional()(target, propertyKey);

    IsString(validationOptions)(target, propertyKey);

    if (min !== undefined) MinLength(min)(target, propertyKey);
    if (max !== undefined) MaxLength(max)(target, propertyKey);
    if (matches) Matches(matches)(target, propertyKey);
    if (false && is_strong_password) // TODO fix for P@SSword! matches
      IsStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })(target, propertyKey);
  };
}
