import { ValidateNested, ValidationOptions } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

interface ToNestedOptions {
  type: Function;
  required?: boolean;
  description?: string;
  example?: object[];
  each?: boolean;
}

/**
 * @ToNested validates nested objects/arrays with deep validation
 * Uses ValidateNested and Type decorators internally
 */
export function ToNested(
  options: ToNestedOptions,
  validationOptions?: ValidationOptions,
) {
  const { type, required = true, description, example, each = false } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      description,
      example,
      required,
    })(target, propertyKey);

    Type(() => type)(target, propertyKey);

    ValidateNested({ each, ...validationOptions })(target, propertyKey);
  };
}
