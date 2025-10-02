import { Prisma, PrismaClient, ApartmentType } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';
import { AmenitiesNames } from './amenities';
import { BedTypesNames } from './beds';

const dir_name = `/static/${ImagePaths.APARTMENTS}`

export const seedApartments = async (prisma: PrismaClient) => {
  const apartments: (Prisma.ApartmentCreateInput & { amenities?: AmenitiesNames[], beds?: { name: BedTypesNames, count: number }[] })[] = [
    {
      name: 'Studio 1',
      description: 'Studio 1 description',
      image: `${dir_name}/apartment-1.jpg`,
      number: 1,
      floor: 1,
      rooms_count: 1,
      max_capacity: 2,
      is_available: true,
      type: ApartmentType.BUDGET,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      amenities: ['WiFi', 'Stove'],
      beds: [{ name: 'Single bed', count: 2 }]
    },
    {
      name: 'Studio 2',
      description: 'Studio 2 description',
      image: `${dir_name}/apartment-2.jpg`,
      number: 2,
      floor: 2,
      rooms_count: 2,
      max_capacity: 3,
      is_available: true,
      type: ApartmentType.STANDARD,
      is_smoking: false,
      is_pet_friendly: false,
      is_excluded: false,
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Iron'],
      beds: [{ name: 'Double bed', count: 1 }, { name: 'Couch bed', count: 1 }]
    },
    {
      name: 'Studio 3',
      description: 'Studio 3 description',
      image: `${dir_name}/apartment-3.jpg`,
      number: 3,
      floor: 3,
      rooms_count: 3,
      max_capacity: 4,
      is_available: true,
      type: ApartmentType.EXCLUSIVE,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron'],
      beds: [{ name: 'Double bed', count: 1 }, { name: 'Couch bed', count: 1 }, { name: 'Single bed', count: 1 }]
    },
    {
      name: 'Studio 4',
      description: 'Studio 4 description',
      image: `${dir_name}/apartment-4.jpg`,
      number: 4,
      floor: 4,
      rooms_count: 4,
      max_capacity: 6,
      is_available: true,
      type: ApartmentType.SUPERIOR,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe'],
      beds: [{ name: 'Double bed', count: 2 }, { name: 'Couch bed', count: 2 }]
    },
    {
      name: 'Studio 5',
      description: 'Studio 5 description',
      image: `${dir_name}/apartment-5.jpg`,
      number: 5,
      floor: 5,
      rooms_count: 6,
      max_capacity: 8,
      is_available: true,
      type: ApartmentType.LUXURY,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe', 'Mini bar'],
      beds: [{ name: 'Double bed', count: 3 }, { name: 'Couch bed', count: 2 }]
    },
  ];

  for (const apartment of apartments) {
    const { beds, amenities, ...data } = apartment;

    const createdApartment = await prisma.apartment.upsert({
      where: { number: apartment.number },
      update: data,
      create: data,
    });

    if (amenities && amenities.length > 0) {
      await prisma.apartmentAmenity.deleteMany({
        where: { apartment_id: createdApartment.id }
      });

      for (const amenity_name of amenities) {
        const amenity = await prisma.amenity.findUnique({
          where: { name: amenity_name }
        });

        if (amenity) {
          await prisma.apartmentAmenity.create({
            data: {
              apartment_id: createdApartment.id,
              amenity_id: amenity.id
            }
          });
        }
      }
    }

    if (beds && beds.length > 0) {
      await prisma.apartmentBed.deleteMany({
        where: { apartment_id: createdApartment.id }
      });

      for (const bed of beds) {
        const bedType = await prisma.bedType.findUnique({
          where: { name: bed.name }
        });

        if (bedType) {
          await prisma.apartmentBed.create({
            data: {
              apartment_id: createdApartment.id,
              bed_type_id: bedType.id,
              count: bed.count
            }
          });
        }
      }
    }
  }
};