import { Prisma, ApartmentType } from '../../../src/database';
import { ImagePaths } from '../../../src/common/image-paths.enum';
import { AmenitiesNames } from '../amenities/data';
import { BedTypesNames } from '../beds';

const apartments_dir_name = `/static/${ImagePaths.APARTMENTS}`

const apartments_images_dir_name = `/static/${ImagePaths.APARTMENT_IMAGES}`

export const apartments: (Prisma.ApartmentCreateInput & {
  amenities?: AmenitiesNames[],
  beds?: { name: BedTypesNames, count: number }[],
  images?: { name: string, image: string, description: string }[],
  booking_variants?: { price: number, capacity: number }[]
})[] = [
    {
      name: 'Studio 1',
      description: 'Studio 1 description',
      image: `${apartments_dir_name}/apartment-1.jpg`,
      number: 1,
      floor: 1,
      rooms_count: 1,
      max_capacity: 2,
      is_available: true,
      type: ApartmentType.BUDGET,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 25,
          capacity: 1
        },
        {
          price: 35,
          capacity: 2
        }
      ],
      amenities: ['WiFi', 'Stove'],
      beds: [{ name: 'Single bed', count: 2 }],
      images: [
        {
          name: 'apartment-1-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-1.1.jpg`,
          description: 'Apartment 1 image 1 description'
        },
        {
          name: 'apartment-1-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-1.2.jpg`,
          description: 'Apartment 1 image 2 description'
        },
        {
          name: 'apartment-1-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-1.3.jpg`,
          description: 'Apartment 1 image 3 description'
        },
        {
          name: 'apartment-1-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-1.4.jpg`,
          description: 'Apartment 1 image 4 description'
        }
      ]
    },
    {
      name: 'Studio 2',
      description: 'Studio 2 description',
      image: `${apartments_dir_name}/apartment-2.jpg`,

      number: 2,
      floor: 2,
      rooms_count: 2,
      max_capacity: 3,
      is_available: true,
      type: ApartmentType.STANDARD,
      is_smoking: false,
      is_pet_friendly: false,
      is_excluded: false,
      booking_variants: [
        {
          price: 45,
          capacity: 2
        },
        {
          price: 55,
          capacity: 3
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Iron'],
      beds: [{ name: 'Double bed', count: 1 }, { name: 'Couch bed', count: 1 }],
      images: [
        {
          name: 'apartment-2-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-2.1.jpg`,
          description: 'Apartment 2 image 1 description'
        },
        {
          name: 'apartment-2-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-2.2.jpg`,
          description: 'Apartment 2 image 2 description'
        },
        {
          name: 'apartment-2-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-2.3.jpg`,
          description: 'Apartment 2 image 3 description'
        },
        {
          name: 'apartment-2-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-2.4.jpg`,
          description: 'Apartment 2 image 4 description'
        }
      ],
    },
    {
      name: 'Studio 3',
      description: 'Studio 3 description',
      image: `${apartments_dir_name}/apartment-3.jpg`,
      number: 3,
      floor: 3,
      rooms_count: 3,
      max_capacity: 4,
      is_available: true,
      type: ApartmentType.EXCLUSIVE,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 55,
          capacity: 1
        },
        {
          price: 60,
          capacity: 2
        },
        {
          price: 65,
          capacity: 3
        },
        {
          price: 70,
          capacity: 4
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron'],
      beds: [
        { name: 'Double bed', count: 1 },
        { name: 'Couch bed', count: 1 },
        { name: 'Single bed', count: 1 }
      ],
      images: [
        {
          name: 'apartment-3-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-3.1.jpg`,
          description: 'Apartment 3 image 1 description'
        },
        {
          name: 'apartment-3-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-3.2.jpg`,
          description: 'Apartment 3 image 2 description'
        },
        {
          name: 'apartment-3-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-3.3.jpg`,
          description: 'Apartment 3 image 3 description'
        },
        {
          name: 'apartment-3-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-3.4.jpg`,
          description: 'Apartment 3 image 4 description'
        }
      ],
    },
    {
      name: 'Studio 4',
      description: 'Studio 4 description',
      image: `${apartments_dir_name}/apartment-4.jpg`,
      number: 4,
      floor: 4,
      rooms_count: 4,
      max_capacity: 6,
      is_available: true,
      type: ApartmentType.SUPERIOR,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 75,
          capacity: 2
        },
        {
          price: 85,
          capacity: 3
        },
        {
          price: 95,
          capacity: 4
        },
        {
          price: 105,
          capacity: 5
        },
        {
          price: 115,
          capacity: 6
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe'],
      beds: [
        { name: 'Double bed', count: 2 },
        { name: 'Couch bed', count: 2 }
      ],
      images: [
        {
          name: 'apartment-4-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-4.1.jpg`,
          description: 'Apartment 4 image 1 description'
        },
        {
          name: 'apartment-4-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-4.2.jpg`,
          description: 'Apartment 4 image 2 description'
        },
        {
          name: 'apartment-4-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-4.3.jpg`,
          description: 'Apartment 4 image 3 description'
        },
        {
          name: 'apartment-4-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-4.4.jpg`,
          description: 'Apartment 4 image 4 description'
        },
        {
          name: 'apartment-4-image-5.jpg',
          image: `${apartments_images_dir_name}/apartment-4.5.jpg`,
          description: 'Apartment 4 image 5 description'
        }
      ],
    },
    {
      name: 'Studio 5',
      description: 'Studio 5 description',
      image: `${apartments_dir_name}/apartment-5.jpg`,
      number: 5,
      floor: 5,
      rooms_count: 6,
      max_capacity: 8,
      is_available: true,
      type: ApartmentType.LUXURY,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe', 'Mini bar'],
      booking_variants: [
        {
          price: 125,
          capacity: 2
        },
        {
          price: 135,
          capacity: 3
        },
        {
          price: 145,
          capacity: 4
        },
        {
          price: 155,
          capacity: 5
        },
        {
          price: 165,
          capacity: 6
        },
        {
          price: 175,
          capacity: 7
        },
        {
          price: 185,
          capacity: 8
        }
      ],
      beds: [
        { name: 'Double bed', count: 3 },
        { name: 'Couch bed', count: 2 }
      ],
      images: [
        {
          name: 'apartment-5-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-5.1.jpg`,
          description: 'Apartment 5 image 1 description'
        },
        {
          name: 'apartment-5-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-5.2.jpg`,
          description: 'Apartment 5 image 2 description'
        },
        {
          name: 'apartment-5-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-5.3.jpg`,
          description: 'Apartment 5 image 3 description'
        },
        {
          name: 'apartment-5-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-5.4.jpg`,
          description: 'Apartment 5 image 4 description'
        },
        {
          name: 'apartment-5-image-5.jpg',
          image: `${apartments_images_dir_name}/apartment-5.5.jpg`,
          description: 'Apartment 5 image 5 description'
        }
      ],
    },
    {
      name: 'Studio 6',
      description: 'Studio 6 description',
      image: `${apartments_dir_name}/apartment-6.jpg`,
      number: 6,
      floor: 6,
      rooms_count: 2,
      max_capacity: 5,
      is_available: true,
      type: ApartmentType.BUDGET,
      is_smoking: false,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 100,
          capacity: 2
        },
        {
          price: 110,
          capacity: 3
        },
        {
          price: 120,
          capacity: 4
        },
        {
          price: 130,
          capacity: 5
        }
      ],
      amenities: ['WiFi', 'Stove', 'Iron'],
      beds: [
        { name: 'Double bed', count: 1 },
        { name: 'Couch bed', count: 1 },
        { name: 'Single bed', count: 1 }
      ],
      images: [
        {
          name: 'apartment-6-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-6.1.jpg`,
          description: 'Apartment 6 image 1 description'
        },
        {
          name: 'apartment-6-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-6.2.jpg`,
          description: 'Apartment 6 image 2 description'
        },
        {
          name: 'apartment-6-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-6.3.jpg`,
          description: 'Apartment 6 image 3 description'
        }
      ],
    },
    {
      name: 'Studio 7',
      description: 'Studio 7 description',
      image: `${apartments_dir_name}/apartment-7.jpg`,

      number: 7,
      floor: 7,
      rooms_count: 2,
      max_capacity: 5,
      is_available: true,
      type: ApartmentType.STANDARD,
      is_smoking: false,
      is_pet_friendly: false,
      is_excluded: false,
      booking_variants: [
        {
          price: 100,
          capacity: 2
        },
        {
          price: 110,
          capacity: 3
        },
        {
          price: 120,
          capacity: 4
        },
        {
          price: 130,
          capacity: 5
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Iron'],
      beds: [
        { name: 'Double bed', count: 1 },
        { name: 'Couch bed', count: 2 }
      ],
      images: [
        {
          name: 'apartment-7-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-7.1.jpg`,
          description: 'Apartment 7 image 1 description'
        },
        {
          name: 'apartment-7-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-7.2.jpg`,
          description: 'Apartment 7 image 2 description'
        },
        {
          name: 'apartment-7-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-7.3.jpg`,
          description: 'Apartment 7 image 3 description'
        },
        {
          name: 'apartment-7-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-7.4.jpg`,
          description: 'Apartment 7 image 4 description'
        },
        {
          name: 'apartment-7-image-5.jpg',
          image: `${apartments_images_dir_name}/apartment-7.5.jpg`,
          description: 'Apartment 7 image 5 description'
        }
      ],
    },
    {
      name: 'Studio 8',
      description: 'Studio 8 description',
      image: `${apartments_dir_name}/apartment-8.jpg`,
      number: 8,
      floor: 8,
      rooms_count: 2,
      max_capacity: 5,
      is_available: true,
      type: ApartmentType.SUPERIOR,
      is_smoking: false,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 100,
          capacity: 2
        },
        {
          price: 110,
          capacity: 3
        },
        {
          price: 120,
          capacity: 4
        },
        {
          price: 130,
          capacity: 5
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe'],
      beds: [
        { name: 'Double bed', count: 1 },
        { name: 'Couch bed', count: 2 }
      ],
      images: [
        {
          name: 'apartment-8-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-8.1.jpg`,
          description: 'Apartment 8 image 1 description'
        },
        {
          name: 'apartment-8-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-8.2.jpg`,
          description: 'Apartment 8 image 2 description'
        },
        {
          name: 'apartment-8-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-8.3.jpg`,
          description: 'Apartment 8 image 3 description'
        }
      ],
    },
    {
      name: 'Studio 9',
      description: 'Studio 9 description',
      image: `${apartments_dir_name}/apartment-9.jpg`,
      number: 9,
      floor: 9,
      rooms_count: 4,
      max_capacity: 5,
      is_available: true,
      type: ApartmentType.LUXURY,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 100,
          capacity: 2
        },
        {
          price: 110,
          capacity: 3
        },
        {
          price: 120,
          capacity: 4
        },
        {
          price: 130,
          capacity: 5
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron', 'Safe', 'Mini bar'],
      beds: [
        { name: 'Double bed', count: 2 },
        { name: 'Couch bed', count: 2 }
      ],
      images: [
        {
          name: 'apartment-9-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-9.1.jpg`,
          description: 'Apartment 9 image 1 description'
        },
        {
          name: 'apartment-9-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-9.2.jpg`,
          description: 'Apartment 9 image 2 description'
        },
        {
          name: 'apartment-9-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-9.3.jpg`,
          description: 'Apartment 9 image 3 description'
        },
        {
          name: 'apartment-9-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-9.4.jpg`,
          description: 'Apartment 9 image 4 description'
        },
        {
          name: 'apartment-9-image-5.jpg',
          image: `${apartments_images_dir_name}/apartment-9.5.jpg`,
          description: 'Apartment 9 image 5 description'
        }
      ],
    },
    {
      name: 'Studio 10',
      description: 'Studio 10 description',
      image: `${apartments_dir_name}/apartment-10.jpg`,
      number: 10,
      floor: 10,
      rooms_count: 2,
      max_capacity: 4,
      is_available: true,
      type: ApartmentType.EXCLUSIVE,
      is_smoking: true,
      is_pet_friendly: true,
      is_excluded: false,
      booking_variants: [
        {
          price: 95,
          capacity: 1
        },
        {
          price: 100,
          capacity: 2
        },
        {
          price: 110,
          capacity: 3
        },
        {
          price: 120,
          capacity: 4
        }
      ],
      amenities: ['WiFi', 'Air conditioning', 'Hair dryer', 'Washing machine', 'Stove', 'Key card', 'Iron'],
      beds: [{ name: 'Double bed', count: 2 }],
      images: [
        {
          name: 'apartment-10-image-1.jpg',
          image: `${apartments_images_dir_name}/apartment-10.1.jpg`,
          description: 'Apartment 10 image 1 description'
        },
        {
          name: 'apartment-10-image-2.jpg',
          image: `${apartments_images_dir_name}/apartment-10.2.jpg`,
          description: 'Apartment 10 image 2 description'
        },
        {
          name: 'apartment-10-image-3.jpg',
          image: `${apartments_images_dir_name}/apartment-10.3.jpg`,
          description: 'Apartment 10 image 3 description'
        },
        {
          name: 'apartment-10-image-4.jpg',
          image: `${apartments_images_dir_name}/apartment-10.4.jpg`,
          description: 'Apartment 10 image 4 description'
        }
      ],
    },
  ];
