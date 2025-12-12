import { PrismaClient } from '../../../src/database';
import { additional_options } from './data';

export const seedAdditionalOptions = async (prisma: PrismaClient) => {
  console.log('Seeding additional options...');

  for (const additional_option of additional_options) {
    await prisma.additionalOption.upsert({
      where: { name: additional_option.name },
      update: additional_option,
      create: additional_option,
    });
  }

  console.log(`✓ Seeded ${additional_options.length} additional options`);
};
