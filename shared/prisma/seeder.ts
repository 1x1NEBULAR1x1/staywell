import { PrismaClient } from '../src/database';
import { seedAmenities, seedBeds, seedApartments, seedEvents, seedUsers } from './models';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  console.log('🌱 Seeding users...');
  await seedUsers(prisma);
  console.log('🌱 Seeding amenities...');
  await seedAmenities(prisma);
  console.log('🌱 Seeding beds...');
  await seedBeds(prisma);
  console.log('🌱 Seeding apartments...');
  await seedApartments(prisma);
  console.log('🌱 Seeding events...');
  await seedEvents(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 