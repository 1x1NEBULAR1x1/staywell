import { PrismaClient } from '../../../src/database';

import { amenities } from './data';



export async function seedAmenities(prisma: PrismaClient) {
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: amenity,
      create: amenity,
    });
  }
}; 