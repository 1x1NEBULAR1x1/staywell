import { ImagePaths } from '../../../src/common/image-paths.enum';
import { Prisma } from '../../../src/database';

const dir_name = `/static/${ImagePaths.AMENITIES}/`;

// For reuse in apartments, allows to easily add/remove/modify amenities by names
export const amenities_names = ['WiFi', 'Iron', 'Air conditioning', 'Hair dryer', 'Key card', 'Safe', 'Washing machine', 'Mini bar', 'Stove'] as const;
export type AmenitiesNames = typeof amenities_names[number];

export const amenities: Prisma.AmenityCreateInput[] = [
  {
    name: 'WiFi',
    image: `${dir_name}/wifi.png`,
    description: 'WiFi in the apartment'
  },
  {
    name: 'Iron',
    image: `${dir_name}/iron.png`,
    description: 'Iron in the apartment'
  },
  {
    name: 'Air conditioning',
    image: `${dir_name}/air-conditioner.png`,
    description: 'Air conditioning in the apartment'
  },
  {
    name: 'Hair dryer',
    image: `${dir_name}/hair-dryer.png`,
    description: 'Hair dryer in the apartment'
  },
  {
    name: 'Key card',
    image: `${dir_name}/key-card.png`,
    description: 'Key card for the apartment'
  },
  {
    name: 'Safe',
    image: `${dir_name}/safe.png`,
    description: 'Safe in the apartment'
  },
  {
    name: 'Washing machine',
    image: `${dir_name}/washing-machine.png`,
    description: 'Washing machine in the apartment'
  },
  {
    name: 'Mini bar',
    image: `${dir_name}/minibar.png`,
    description: 'Mini bar in the apartment'
  },
  {
    name: 'Stove',
    image: `${dir_name}/gas-stove.png`,
    description: 'Stove in the apartment'
  }
]