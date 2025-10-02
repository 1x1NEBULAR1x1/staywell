import { Transform } from "class-transformer";
import { IsUUID, IsOptional, ValidationOptions } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

interface ToUUIDOptions {
  required?: boolean;
  version?: 3 | 4 | 5 | "all";
  description?: string;
  example?: string;
}

/**
 * @ToUUID ensures a valid UUID string with optional version validation.
 */
export function ToUUID(
  options: ToUUIDOptions = {},
  validationOptions?: ValidationOptions,
) {
  const { required = true, version = "all", description, example } = options;

  return function (target: object, propertyKey: string | symbol) {
    // API Documentation
    ApiProperty({
      type: "string",
      format: "uuid",
      description,
      example,
      required,
    })(target, propertyKey);

    // Transform value to trimmed string
    Transform(({ value }: { value: unknown }) => JSON.stringify(value).trim())(
      target,
      propertyKey,
    );

    if (!required) IsOptional()(target, propertyKey);

    IsUUID(version, validationOptions)(target, propertyKey);
  };
}
