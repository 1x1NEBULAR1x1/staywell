import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  ValidationOptions,
} from 'class-validator';

interface ToPriceOptions {
  required?: boolean;
}
/**
 * @ToPrice ensures a non-negative number with 2 decimal precision.
 */
export function ToPrice(
  options: ToPriceOptions = {},
  validationOptions?: ValidationOptions,
) {
  const { required } = options;

  return function (target: object, propertyKey: string | symbol) {
    IsNumberString()(target, propertyKey);
    Transform(({ value }: { value: unknown }) => {
      const num = parseFloat(String(value));
      return isNaN(num) ? value : parseFloat(num.toFixed(2));
    })(target, propertyKey);
    IsNumber({}, validationOptions)(target, propertyKey);
    IsPositive()(target, propertyKey);
    if (!required) {
      IsOptional()(target, propertyKey);
    }
  };
}
