import { PrismaClient } from '../../../src/database';
import { apartments } from './data';

export async function seedApartments(prisma: PrismaClient) {

  for (const apartment of apartments) {
    const { beds, amenities, images, booking_variants, ...data } = apartment;

    const createdApartment = await prisma.apartment.upsert({
      where: { number: apartment.number },
      update: data,
      create: data,
    });
    if (booking_variants && booking_variants.length > 0) {
      await prisma.bookingVariant.deleteMany({
        where: { apartment_id: createdApartment.id }
      });
      await prisma.bookingVariant.createMany({
        data: booking_variants.map(variant => ({ apartment_id: createdApartment.id, ...variant }))
      });
    }

    if (amenities && amenities.length > 0) {
      await prisma.apartmentAmenity.deleteMany({
        where: { apartment_id: createdApartment.id }
      });

      const amenities_to_create = await prisma.amenity.findMany({
        where: { name: { in: amenities } }
      });

      await prisma.apartmentAmenity.createMany({
        data: amenities_to_create.map(amenity => ({ apartment_id: createdApartment.id, amenity_id: amenity.id }))
      });
    }

    if (beds && beds.length > 0) {
      await prisma.apartmentBed.deleteMany({
        where: { apartment_id: createdApartment.id }
      });

      const beds_to_create = await prisma.bedType.findMany({
        where: { name: { in: beds.map(bed => bed.name) } }
      });

      await prisma.apartmentBed.createMany({
        data: beds_to_create.map(bed => ({ apartment_id: createdApartment.id, bed_type_id: bed.id, count: beds.find(b => b.name === bed.name)?.count ?? 1 }))
      });
    }

    if (images && images.length > 0) {
      await prisma.apartmentImage.deleteMany({
        where: { apartment_id: createdApartment.id }
      });

      await prisma.apartmentImage.createMany({
        data: images
          // Images with .1.jpg are the main images, so we don't need to create them again
          .filter(image => !image.image.endsWith('.1.jpg'))
          .map(image => ({ apartment_id: createdApartment.id, ...image }))
      });
    }
  }
};