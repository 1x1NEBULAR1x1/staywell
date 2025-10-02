import { Transform } from "class-transformer";
import { IsUrl, IsOptional, ValidationOptions } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

interface ToUrlOptions {
  required?: boolean;
  protocols?: string[];
  require_protocol?: boolean;
  description?: string;
  example?: string;
}

/**
 * @ToUrl ensures a valid URL string with optional protocol validation.
 */
export function ToUrl(
  options: ToUrlOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    required = true,
    protocols,
    require_protocol = true,
    description,
    example,
  } = options;

  return function (target: object, propertyKey: string | symbol) {
    ApiProperty({
      type: "string",
      format: "url",
      description,
      example,
      required,
    })(target, propertyKey);

    Transform(({ value }: { value: unknown }) => JSON.stringify(value).trim())(
      target,
      propertyKey,
    );

    if (!required) IsOptional()(target, propertyKey);

    IsUrl({ protocols, require_protocol, ...validationOptions })(
      target,
      propertyKey,
    );
  };
}
