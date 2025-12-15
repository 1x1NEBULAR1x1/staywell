import { Prisma, PrismaClient } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';

const dir_name = `/static/${ImagePaths.BED_TYPES}/`

// For reuse in apartments, allows to easily add/remove/modify beds by names
export const bed_types_names = ['Single bed', 'Double bed', 'Couch bed'] as const;
export type BedTypesNames = typeof bed_types_names[number];


const beds: Prisma.BedTypeCreateInput[] = [
  {
    name: 'Single bed',
    image: `${dir_name}/single-bed.png`,
  },
  {
    name: 'Double bed',
    image: `${dir_name}/bed.png`,
  },
  {
    name: 'Couch bed',
    image: `${dir_name}/sofa.png`,
  },
]


export async function seedBeds(prisma: PrismaClient) {
  for (const bed of beds) {
    await prisma.bedType.upsert({
      where: { name: bed.name },
      update: bed,
      create: bed,
    });
  }
}