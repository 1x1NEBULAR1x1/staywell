import { Transform } from 'class-transformer';
import { IsOptional, ValidationOptions, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface ToEnumOptions<
  T extends Record<string, string> = Record<string, string>,
> {
  required?: boolean;
  description?: string;
  example?: keyof T;
  default?: keyof T;
  enum: T;
  enumName?: string;
}

/**
 * @ToEnum ensures a valid enum value with optional default value.
 */
export function ToEnum<
  T extends Record<string, string> = Record<string, string>,
>(options: ToEnumOptions<T>, validationOptions?: ValidationOptions) {
  const {
    required = true,
    description,
    example,
    default: default_value,
    enum: enum_value,
    enumName,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    // Преобразуем enum в массив строковых значений для Swagger
    const enumValues = Object.values(enum_value);

    ApiProperty({
      type: 'string',
      enum: enumValues,
      enumName: enumName || undefined,
      description,
      example,
      default: default_value,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => {
      if (typeof value === 'string' && value in enum_value) return value;
      throw new Error(
        `Invalid value when transforming to enum: ${JSON.stringify(value)}`,
      );
    })(target, propertyKey);

    if (!required) IsOptional()(target, propertyKey);

    IsEnum(enum_value, validationOptions)(target, propertyKey);
  };
}
