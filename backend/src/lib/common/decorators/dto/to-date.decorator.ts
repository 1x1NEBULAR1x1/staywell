import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  MinDate,
  MaxDate,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface ToDateOptions {
  required?: boolean;
  min_date?: Date;
  max_date?: Date;
  description?: string;
  example?: string;
}

/**
 * @ToDate ensures a valid Date object with optional minimum date validation.
 */
export function ToDate(
  options: ToDateOptions = {},
  validationOptions?: ValidationOptions,
) {
  const { required = true, min_date, max_date, description, example } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: 'string',
      format: 'date-time',
      description,
      example,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => {
      if (value === null || value === undefined || value === '')
        return undefined;
      if (value instanceof Date) return value;
      const date = new Date(JSON.stringify(value).trim());
      return isNaN(date.getTime()) ? undefined : date;
    })(target, propertyKey);

    if (!required) IsOptional()(target, propertyKey);

    IsDate(validationOptions)(target, propertyKey);
    Type(() => Date)(target, propertyKey);

    if (min_date) MinDate(min_date)(target, propertyKey);
    if (max_date) MaxDate(max_date)(target, propertyKey);
  };
}
