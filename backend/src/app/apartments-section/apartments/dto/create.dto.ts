import {
  ToBoolean,
  ToInt,
  ToDecimal,
  ToString,
  ToUrl,
  ToEnum,
} from 'src/lib/common';
import { CreateApartment } from '@shared/src/types/apartments-section';
import { ApartmentType } from '@shared/src/database';

export class CreateApartmentDto implements CreateApartment {
  @ToInt({
    required: true,
    min: 1,
    description: 'Apartment number',
    example: 101,
  })
  number!: number;

  @ToInt({ required: true, min: 1, description: 'Apartment floor', example: 3 })
  floor!: number;

  @ToString({
    required: true,
    description: 'Apartment name',
    example: 'Sea View Suite',
    min: 1,
    max: 1024,
  })
  name!: string;

  @ToInt({ required: true, min: 1, description: 'Count of rooms', example: 3 })
  rooms_count!: number;

  @ToUrl({
    required: false,
    description: 'Apartment image',
    example: 'https://example.com/image.jpg',
  })
  image?: string;

  @ToString({
    required: true,
    description: 'Apartment description',
    example: 'Spacious apartment with balcony and sea view',
    min: 3,
    max: 4096,
  })
  description!: string;

  @ToString({
    required: true,
    description: 'Apartment rules',
    example: 'No smoking, no pets',
    min: 3,
    max: 4096,
  })
  rules!: string;

  @ToInt({
    required: true,
    min: 1,
    description: 'Maximum capacity',
    example: 3,
  })
  max_capacity!: number;

  @ToBoolean({
    required: true,
    default: true,
    description: 'Is the apartment active',
    example: true,
  })
  is_available!: boolean;

  @ToBoolean({
    required: true,
    default: false,
    description: 'Is the apartment smoking allowed',
    example: false,
  })
  is_smoking!: boolean;

  @ToBoolean({
    required: true,
    default: false,
    description: 'Is the apartment pet friendly',
    example: false,
  })
  is_pet_friendly!: boolean;

  @ToDecimal({
    required: true,
    min: 0,
    description: 'Deposite for booking',
    example: 100,
  })
  deposit!: number;

  @ToEnum({
    required: true,
    description: 'Apartment type',
    example: ApartmentType.BUDGET,
    enum: ApartmentType,
    enumName: 'ApartmentType',
  })
  type!: ApartmentType;
}
