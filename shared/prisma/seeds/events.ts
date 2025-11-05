import { Prisma, PrismaClient } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';

const events_dir_name = `/static/${ImagePaths.EVENTS}`;
const event_images_dir_name = `/static/${ImagePaths.EVENT_IMAGES}`;

export const seedEvents = async (prisma: PrismaClient) => {
  const events: (Prisma.EventCreateInput & { images?: { name: string, image?: string, description?: string }[] })[] = [
    {
      name: 'Wine Tasting Evening',
      description: 'Join us for an exquisite wine tasting evening featuring premium wines from local vineyards. Learn about different grape varieties, wine pairing techniques, and enjoy complimentary appetizers.',
      image: `${events_dir_name}/wine-tasting.jpg`,
      price: 75.00,
      capacity: 20,
      start: new Date('2025-12-01T18:00:00Z'),
      end: new Date('2025-12-01T21:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Wine glasses arrangement',
          image: `${event_images_dir_name}/wine-glasses.jpg`,
          description: 'Beautiful arrangement of wine glasses for the tasting'
        },
        {
          name: 'Wine bottles collection',
          image: `${event_images_dir_name}/wine-bottles.jpg`,
          description: 'Selection of premium wines for the evening'
        }
      ]
    },
    {
      name: 'Mountain Hiking Adventure',
      description: 'Experience breathtaking mountain views on this guided hiking tour. Suitable for all fitness levels with stunning panoramic vistas and photo opportunities.',
      image: `${events_dir_name}/mountain-hiking.jpg`,
      price: 45.00,
      capacity: 15,
      start: new Date('2025-12-05T09:00:00Z'),
      end: new Date('2025-12-05T16:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Mountain trail view',
          image: `${event_images_dir_name}/mountain-trail.jpg`,
          description: 'Scenic mountain trail with amazing views'
        },
        {
          name: 'Group hiking photo',
          image: `${event_images_dir_name}/hiking-group.jpg`,
          description: 'Happy hikers enjoying the mountain adventure'
        }
      ]
    },
    {
      name: 'Cooking Masterclass: Italian Cuisine',
      description: 'Learn authentic Italian cooking techniques from our chef. Prepare traditional pasta, pizza, and desserts while enjoying wine and conversation.',
      image: `${events_dir_name}/cooking-class.jpg`,
      price: 95.00,
      capacity: 12,
      start: new Date('2025-12-10T14:00:00Z'),
      end: new Date('2025-12-10T18:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Fresh ingredients preparation',
          image: `${event_images_dir_name}/cooking-ingredients.jpg`,
          description: 'Fresh ingredients laid out for the cooking class'
        },
        {
          name: 'Chef demonstration',
          image: `${event_images_dir_name}/chef-demo.jpg`,
          description: 'Professional chef demonstrating cooking techniques'
        },
        {
          name: 'Finished dishes',
          image: `${event_images_dir_name}/finished-dishes.jpg`,
          description: 'Beautifully plated Italian dishes ready to enjoy'
        }
      ]
    },
    {
      name: 'Photography Workshop',
      description: 'Capture stunning landscapes and learn professional photography techniques. Includes camera settings, composition, and post-processing tips.',
      image: `${events_dir_name}/photography-workshop.jpg`,
      price: 65.00,
      capacity: 10,
      start: new Date('2025-12-15T10:00:00Z'),
      end: new Date('2025-12-15T17:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Camera equipment setup',
          image: `${event_images_dir_name}/camera-setup.jpg`,
          description: 'Professional camera equipment for the workshop'
        },
        {
          name: 'Landscape photography',
          image: `${event_images_dir_name}/landscape-photo.jpg`,
          description: 'Beautiful landscape captured during the workshop'
        }
      ]
    },
    {
      name: 'Spa & Wellness Retreat',
      description: 'Relax and rejuvenate with our full-day spa experience. Includes massages, facials, yoga, and healthy organic meals.',
      image: `${events_dir_name}/spa-retreat.jpg`,
      price: 150.00,
      capacity: 8,
      start: new Date('2025-12-20T08:00:00Z'),
      end: new Date('2025-12-20T18:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Spa treatment room',
          image: `${event_images_dir_name}/spa-room.jpg`,
          description: 'Peaceful spa treatment room with ambient lighting'
        },
        {
          name: 'Wellness activities',
          image: `${event_images_dir_name}/wellness-activities.jpg`,
          description: 'Various wellness activities including yoga and meditation'
        },
        {
          name: 'Healthy organic meals',
          image: `${event_images_dir_name}/organic-meals.jpg`,
          description: 'Nutritious and delicious organic meals served during retreat'
        }
      ]
    }
  ];

  for (const event of events) {
    const { images, ...data } = event;

    try {
      const createdEvent = await prisma.event.create({
        data,
      });


      if (images && images.length > 0) {
        await prisma.eventImage.deleteMany({
          where: { event_id: createdEvent.id }
        });

        for (const image of images) {
          await prisma.eventImage.create({
            data: {
              event_id: createdEvent.id,
              name: image.name,
              image: image.image,
              description: image.description
            }
          });
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
};
