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
      name: 'Cozy Budget Studio',
      description: 'Perfect for budget-conscious travelers! This charming studio offers all the essentials for a comfortable stay. Enjoy the simplicity of a well-designed space with modern amenities. The room features comfortable single beds, a kitchenette with a stove for preparing simple meals, and high-speed WiFi to stay connected. Pet-friendly and smoking allowed. Ideal for solo travelers or couples looking for an affordable yet cozy retreat.',
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
      name: 'Modern Standard Studio',
      description: 'Experience comfort and convenience in this beautifully appointed standard studio. Located on the 2nd floor, this bright and airy space features a plush double bed and a comfortable couch bed, making it perfect for small families or friends traveling together. Equipped with air conditioning to keep you cool, a full kitchenette with modern appliances, and a washing machine for longer stays. Enjoy complimentary high-speed WiFi, a hair dryer, and iron for your convenience. Non-smoking environment to ensure fresh, clean air.',
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
      name: 'Exclusive Family Suite',
      description: 'Indulge in luxury and space with our Exclusive Family Suite! This premium 3-room apartment on the 3rd floor is designed with families in mind. Featuring a master bedroom with a double bed, a cozy living area with a couch bed, and an additional single bed, this suite comfortably accommodates up to 4 guests. Premium amenities include climate control air conditioning, high-speed WiFi, washing machine, professional hair dryer, and iron. Secure key card access ensures your safety. Both pet-friendly and smoking allowed. Perfect for families seeking comfort, convenience, and style.',
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
      name: 'Superior Family Apartment',
      description: 'Spacious and elegantly designed superior apartment spanning the entire 4th floor. This 4-room masterpiece offers generous living space for families or groups of up to 6 guests. Features two luxurious double bedrooms, a modern living area with comfortable couch beds, and a fully equipped kitchen. All rooms benefit from individual climate control, high-speed WiFi, and smart TV entertainment. Security features include an electronic safe and key card access. Pet-friendly with designated areas and smoking allowed in designated zones. Premium amenities include a washing machine, iron, professional hair dryer, and quality kitchenware.',
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
      name: 'Luxury Presidential Suite',
      description: 'Experience ultimate luxury in our magnificent Presidential Suite on the 5th floor. This spectacular 6-room apartment redefines elegance and comfort, accommodating up to 8 guests in absolute style. Featuring three master bedrooms with king-size beds, a spacious living room, separate dining area, and a state-of-the-art kitchen with premium appliances. Every room offers stunning views and is equipped with individual climate control. Exclusive amenities include a complimentary mini bar, electronic safe, premium toiletries, and luxury bathrobes. High-speed fiber optic WiFi throughout, smart home automation, and 24/7 concierge service. Pet-friendly with VIP pet amenities and designated smoking areas on the private balcony.',
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
      name: 'Pet-Friendly Comfort Studio',
      description: 'Welcome to our specially designed pet-friendly studio on the 6th floor! This charming 2-room apartment comfortably accommodates up to 5 guests and their furry companions. Features a cozy bedroom with a double bed, additional single bed, and a comfortable couch bed in the living area. The modern kitchenette is equipped with essential appliances for preparing meals. Complimentary high-speed WiFi keeps you connected while you enjoy quality time with your family and pets. Pet amenities include food bowls, a cozy pet bed, and access to nearby pet-friendly areas. Non-smoking environment ensures fresh air for all guests.',
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
      name: 'Fresh Air Standard Studio',
      description: 'Breathe easy in our pristine non-smoking standard studio on the 7th floor. This bright and airy 2-room apartment accommodates up to 5 guests in complete comfort. The master bedroom features a luxurious double bed, while the spacious living area provides two comfortable couch beds. Climate-controlled throughout with individual air conditioning, ensuring perfect temperature year-round. Modern amenities include high-speed WiFi, a fully equipped kitchen with quality appliances, washing machine for longer stays, professional hair dryer, and iron. Floor-to-ceiling windows offer abundant natural light and lovely views. Strictly non-smoking and no pets to maintain pristine air quality.',
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
      name: 'Superior Pet Paradise',
      description: 'Your pets deserve luxury too! Our superior pet-friendly studio on the 8th floor combines elegance with practicality for traveling with pets. This carefully designed 2-room apartment welcomes up to 5 guests plus their furry family members. Features include a spacious bedroom with a plush double bed, a modern living area with comfortable sleeping options, and pet-friendly flooring that\'s easy to clean. Premium pet amenities: dedicated feeding station, pet bed, toys, and treats. For humans: high-speed WiFi, climate control, full kitchen with modern appliances, washing machine, and all standard comforts. Large windows provide plenty of natural light. Pet waste stations located nearby.',
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
      name: 'Luxury Penthouse Suite',
      description: 'Indulge in the pinnacle of luxury living in our stunning 9th-floor penthouse suite. This magnificent 4-room luxury apartment accommodates up to 5 guests in unparalleled sophistication. Two master bedrooms with king-size beds, separate living and dining areas, and a gourmet kitchen with premium appliances. Floor-to-ceiling windows showcase breathtaking panoramic views. Exclusive amenities include a fully stocked mini bar, electronic safe, ultra-fast fiber WiFi, smart home controls, premium sound system, and Nespresso machine. All rooms feature individual climate control and luxury linens. Pet-friendly with VIP amenities and smoking permitted on the private terrace. Daily housekeeping and 24/7 concierge available.',
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
      name: 'Sky View Executive Suite',
      description: 'Reach new heights in our exclusive Sky View Executive Suite on the top 10th floor. This sophisticated 2-room apartment offers breathtaking 360-degree views and accommodates up to 4 guests in absolute comfort. Features a spacious master bedroom with a premium king-size bed and a stylish living area with modern furnishings. Floor-to-ceiling panoramic windows flood the space with natural light and offer stunning sunrise and sunset views. Premium amenities include key card security access, climate-controlled environment, high-speed WiFi, smart TV entertainment, fully equipped kitchen, and designer bathroom fixtures. Pet-friendly with premium pet amenities and designated smoking area on the private balcony overlooking the city skyline.',
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
