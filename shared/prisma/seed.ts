import { PrismaClient, Prisma } from '../src/database';
import { seedAmenities } from './seeds/amenities';
import * as argon2 from 'argon2';
import { seedBeds } from './seeds/beds';
import { seedApartments } from './seeds/apartments';
import { seedEvents } from './seeds/events';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    console.log('🌱 Clearing database...');
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();

    console.log('🌱 Seeding admin user...');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password_hash: await argon2.hash('P@SSword!'),
        role: 'ADMIN',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Calico_tabby_cat_-_Savannah.jpg/1024px-Calico_tabby_cat_-_Savannah.jpg',
        first_name: 'Admin',
        last_name: 'Admin',
      },
    });

    console.log('🌱 Seeding test user...');
    const test = await prisma.user.create({
      data: {
        email: 'test@gmail.com',
        password_hash: await argon2.hash('P@SSword!'),
        role: 'ADMIN',
        image: 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
        first_name: 'Test',
        last_name: 'Test'
      }
    });

    console.log('🌱 Seeding test message...');
    await prisma.message.create({
      data: {
        sender_id: test.id,
        message: "miau",
        receiver_id: admin.id,
      }
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