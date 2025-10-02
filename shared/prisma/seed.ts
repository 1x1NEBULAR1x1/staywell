import { PrismaClient, Prisma } from '../src/database';
import { seedAmenities } from './seeds/amenities';
import * as argon2 from 'argon2';
import { seedBeds } from './seeds/beds';
import { seedApartments } from './seeds/apartments';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password_hash: await argon2.hash('G@me2022'),
        role: 'ADMIN',
        first_name: 'Admin',
        last_name: 'Admin',
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.warn('Admin user already exists');
    } else {
      throw error;
    }
  }

  console.log('🌱 Seeding amenities...');
  await seedAmenities(prisma);
  console.log('🌱 Seeding beds...');
  await seedBeds(prisma);
  console.log('🌱 Seeding apartments...');
  await seedApartments(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 