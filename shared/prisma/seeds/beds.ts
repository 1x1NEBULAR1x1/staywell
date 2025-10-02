import { Prisma, PrismaClient } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';

const dir_name = `/static/${ImagePaths.BED_TYPES}/`

const bed_types_names = ['Single bed', 'Double bed', 'Couch bed'] as const;

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


export const seedBeds = async (prisma: PrismaClient) => {
  for (const bed of beds) {
    await prisma.bedType.upsert({
      where: { name: bed.name },
      update: bed,
      create: bed,
    });
  }
}