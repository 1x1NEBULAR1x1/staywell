import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  Max,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

interface ToDecimalOptions {
  required?: boolean;
  positive?: boolean;
  precision?: number;
  description?: string;
  example?: number;
  min?: number;
  max?: number;
  decimal?: boolean;
}

/**
 * @ToDecimal ensures a valid decimal number with optional precision and positivity validation.
 */
export function ToDecimal(
  options: ToDecimalOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    required = true,
    positive = false,
    precision = 2,
    description,
    example,
    min,
    max,
    decimal = false,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: 'number',
      format: 'decimal',
      minimum: positive ? 0 : undefined,
      description,
      example,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => {
      if (typeof value === 'number')
        return parseFloat(value.toFixed(precision));
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? value : parseFloat(parsed.toFixed(precision));
      }
      throw new Error(
        `Invalid value when transforming to decimal: ${JSON.stringify(value)}`,
      );
    })(target, propertyKey);

    if (decimal) Type(() => Decimal)(target, propertyKey);
    if (!required) IsOptional()(target, propertyKey);

    IsNumber({}, validationOptions)(target, propertyKey);

    if (positive) IsPositive()(target, propertyKey);
    if (typeof min === 'number') Min(min)(target, propertyKey);
    if (typeof max === 'number') Max(max)(target, propertyKey);
  };
}
