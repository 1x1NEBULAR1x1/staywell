import { IsBoolean, IsOptional, ValidationOptions } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

interface ToBooleanOptions {
  required?: boolean;
  default?: boolean;
  description?: string;
  example?: boolean;
}

/**
 * @ToBoolean ensures a valid boolean value with flexible input transformation.
 */
export function ToBoolean(
  options: ToBooleanOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    required = true,
    description,
    example,
    default: default_value,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: "boolean",
      default: default_value,
      description,
      example,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => value == "true")(
      target,
      propertyKey,
    );

    if (!required) IsOptional()(target, propertyKey);

    IsBoolean({
      message: 'Value must be "true" or "false"',
      ...validationOptions,
    })(target, propertyKey);
  };
}
