import { Prisma } from '../../../src/database';
import { ImagePaths } from '../../../src/common/image-paths.enum';

const additional_options_dir = `/static/${ImagePaths.ADDITIONAL_OPTIONS}`;

export const additional_options: Prisma.AdditionalOptionCreateInput[] = [
  {
    name: 'Airport Transfer',
    description: 'Comfortable and reliable transportation from/to the airport. Professional driver will meet you at the arrival hall with a name sign. Luxury sedan with air conditioning, complimentary water, and luggage assistance included.',
    image: `${additional_options_dir}/airport-transfer.jpg`,
    price: 45.00,
  },
  {
    name: 'Private Dinner',
    description: 'Experience a romantic candlelit dinner in the comfort of your room or on your private terrace. Our chef will prepare a gourmet 3-course meal featuring local and international cuisine, complete with wine pairing and table decoration.',
    image: `${additional_options_dir}/private-dinner.jpg`,
    price: 120.00,
  },
  {
    name: 'Room Service Breakfast',
    description: 'Start your day right with a delicious breakfast delivered to your door. Choose from continental, American, or healthy options. Includes fresh juice, coffee/tea, pastries, fruits, and your choice of hot meal.',
    image: `${additional_options_dir}/breakfast.jpg`,
    price: 25.00,
  },
  {
    name: 'Late Check-out',
    description: 'Extend your stay until 6 PM without rushing. Perfect for those with late flights or who want to enjoy more time at the resort. Subject to availability.',
    image: `${additional_options_dir}/late-checkout.jpg`,
    price: 50.00,
  },
  {
    name: 'In-Room Spa Treatment',
    description: 'Indulge in a relaxing spa experience without leaving your room. Choose from various treatments including Swedish massage, aromatherapy, hot stone therapy, or facial treatments. Professional therapist and all supplies included.',
    image: `${additional_options_dir}/spa-treatment.jpg`,
    price: 95.00,
  },
  {
    name: 'Champagne & Roses',
    description: 'Celebrate special moments with a bottle of premium champagne and a beautiful bouquet of fresh roses. Perfect for anniversaries, proposals, or romantic surprises. Includes chocolate-covered strawberries.',
    image: `${additional_options_dir}/champagne-roses.jpg`,
    price: 65.00,
  },
  {
    name: 'Daily Housekeeping Plus',
    description: 'Premium cleaning service with two visits per day. Includes fresh towels, bed making, mini-bar restocking, and turndown service in the evening with complimentary chocolates.',
    image: `${additional_options_dir}/housekeeping.jpg`,
    price: 30.00,
  },
  {
    name: 'Grocery Delivery',
    description: 'Have groceries delivered directly to your apartment. Perfect for longer stays or those who prefer to cook. Simply provide your shopping list, and we\'ll take care of the rest.',
    image: `${additional_options_dir}/grocery-delivery.jpg`,
    price: 35.00,
  },
  {
    name: 'Baby Equipment Package',
    description: 'Traveling with little ones? We provide everything you need: crib, high chair, baby monitor, bottle warmer, and safety gates. All equipment is sanitized and safety-tested.',
    image: `${additional_options_dir}/baby-equipment.jpg`,
    price: 40.00,
  },
  {
    name: 'Pet Care Package',
    description: 'Special amenities for your furry friend including pet bed, bowls, treats, toys, and a welcome gift. We can also arrange pet-sitting or walking services upon request.',
    image: `${additional_options_dir}/pet-care.jpg`,
    price: 30.00,
  },
  {
    name: 'Private Chef Service',
    description: 'Have a professional chef prepare meals in your apartment\'s kitchen. Customized menu based on your preferences and dietary requirements. Includes shopping, cooking, serving, and cleaning. Minimum 3 hours.',
    image: `${additional_options_dir}/private-chef.jpg`,
    price: 180.00,
  },
  {
    name: 'Guided City Tour',
    description: 'Discover the city\'s hidden gems with a knowledgeable local guide. 4-hour walking tour covering historical sites, local markets, best restaurants, and photo opportunities. Includes welcome drink.',
    image: `${additional_options_dir}/city-tour.jpg`,
    price: 75.00,
  },
];
