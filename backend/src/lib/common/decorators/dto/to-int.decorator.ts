import { Transform } from "class-transformer";
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  ValidationOptions,
  IsPositive,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

interface ToIntOptions {
  required?: boolean;
  min?: number;
  max?: number;
  positive?: boolean;
  description?: string;
  example?: number;
  default?: number;
}

/**
 * @ToInt ensures a valid integer value with optional min/max and positive validation.
 */
export function ToInt(
  options: ToIntOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    required = true,
    max,
    min,
    positive = false,
    description,
    example,
    default: default_value,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: "integer",
      minimum: min,
      maximum: max,
      description,
      example,
      default: default_value,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => {
      if (typeof value === "number") return Math.floor(value);
      if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? value : parsed;
      }
      throw new Error(
        `Invalid value when transforming to integer: ${JSON.stringify(value)}`,
      );
    })(target, propertyKey);

    if (!required) IsOptional()(target, propertyKey);

    IsInt(validationOptions)(target, propertyKey);
    if (positive) IsPositive()(target, propertyKey);
    if (typeof min === "number") Min(min)(target, propertyKey);
    if (typeof max === "number") Max(max)(target, propertyKey);
  };
}
