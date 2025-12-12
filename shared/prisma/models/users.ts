import { Prisma, PrismaClient } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';
import * as argon2 from 'argon2';

const users_dir_name = `/static/${ImagePaths.USERS}`;

export async function seedUsers(prisma: PrismaClient) {
  // Создание администратора
  try {
    await createAdmin(prisma);
  } catch (error) {
    console.warn('Admin already exists');

  }

  // Создание тестовых пользователей
  // Jon Snow
  await prisma.user.create({
    data: {
      email: 'jonsnow@whatever.com',
      password_hash: await argon2.hash('WinterIsComing!1'),
      role: 'USER',
      first_name: 'John',
      last_name: 'Snow',
      image: `${users_dir_name}/jon-snow.jpg`
    },
  });

  // Lucas Bennett
  await prisma.user.create({
    data: {
      email: 'lucas.bennett@example.com',
      password_hash: await argon2.hash('LucasSecure123!'),
      role: 'USER',
      first_name: 'Lucas',
      last_name: 'Bennett',
      image: `${users_dir_name}/lucas-bennett.jpg`
    },
  });

  // Mia Thompson
  await prisma.user.create({
    data: {
      email: 'mia.thompson@example.com',
      password_hash: await argon2.hash('MiaPass456!'),
      role: 'USER',
      first_name: 'Mia',
      last_name: 'Thompson',
      image: `${users_dir_name}/mia-thompson.jpg`
    },
  });

};




// Функция для создания администратора
const createAdmin = async (prisma: PrismaClient) => {
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
      console.warn('Users already exists');
    } else {
      throw error;
    }
  }
};