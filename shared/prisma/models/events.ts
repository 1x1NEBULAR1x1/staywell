import { Prisma, PrismaClient } from '../../src/database';
import { ImagePaths } from '../../src/common/image-paths.enum';

const events_dir_name = `/static/${ImagePaths.EVENTS}`;
const event_images_dir_name = `/static/${ImagePaths.EVENT_IMAGES}`;

export async function seedEvents(prisma: PrismaClient) {
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
        }
      ]
    },
    {
      name: 'Sunset Yoga Session',
      description: 'A calming yoga class held outdoors during the golden hour. Perfect for relaxation, stretching, and reconnecting with nature.',
      image: `${events_dir_name}/sunset-yoga.jpg`,
      price: 40.00,
      capacity: 25,
      start: new Date('2025-12-22T17:00:00Z'),
      end: new Date('2025-12-22T18:30:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Yoga mats at sunset',
          image: `${event_images_dir_name}/yoga-mats-sunset.jpg`,
          description: 'Yoga mats arranged with a beautiful sunset view'
        },
        {
          name: 'Group yoga practice',
          image: `${event_images_dir_name}/group-yoga.jpg`,
          description: 'Participants practicing yoga outdoors'
        }
      ]
    },
    {
      name: 'Aromatherapy Workshop',
      description: 'Create your own essential oil blends while learning the therapeutic benefits of aromatherapy.',
      image: `${events_dir_name}/aromatherapy.jpg`,
      price: 60.00,
      capacity: 12,
      start: new Date('2025-12-24T10:00:00Z'),
      end: new Date('2025-12-24T12:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Essential oil set',
          image: `${event_images_dir_name}/essential-oils.jpg`,
          description: 'Collection of essential oils used in the workshop'
        },
        {
          name: 'Oil blending process',
          image: `${event_images_dir_name}/oil-blending.jpg`,
          description: 'Participants creating custom aroma blends'
        }
      ]
    },
    {
      name: 'Craft Beer Tasting Evening',
      description: 'Taste a curated selection of local craft beers and learn about brewing methods and flavor profiles.',
      image: `${events_dir_name}/beer-tasting.jpg`,
      price: 65.00,
      capacity: 20,
      start: new Date('2025-12-27T19:00:00Z'),
      end: new Date('2025-12-27T21:30:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Beer glasses close-up',
          image: `${event_images_dir_name}/beer-glasses.jpg`,
          description: 'Craft beer poured into tasting glasses'
        }
      ]
    },
    {
      name: 'Kayaking Adventure Tour',
      description: 'A scenic kayaking tour across a peaceful lake with short stops for photos and nature exploration.',
      image: `${events_dir_name}/kayak-tour.jpg`,
      price: 55.00,
      capacity: 10,
      start: new Date('2025-12-29T08:00:00Z'),
      end: new Date('2025-12-29T12:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Kayaks on the water',
          image: `${event_images_dir_name}/kayaks-water.jpg`,
          description: 'Colorful kayaks floating on calm lake water'
        },
        {
          name: 'Kayak group tour',
          image: `${event_images_dir_name}/kayak-group.jpg`,
          description: 'Group of participants kayaking together'
        }
      ]
    },
    {
      name: 'Stargazing Night',
      description: 'Discover stars, constellations, and planets through telescopes with a guide explaining the night sky.',
      image: `${events_dir_name}/stargazing.jpg`,
      price: 35.00,
      capacity: 30,
      start: new Date('2025-12-30T21:00:00Z'),
      end: new Date('2025-12-30T23:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Telescope setup',
          image: `${event_images_dir_name}/telescope.jpg`,
          description: 'Professional telescope prepared for observations'
        },
        {
          name: 'Night sky view',
          image: `${event_images_dir_name}/night-sky.jpg`,
          description: 'Clear starry sky during the stargazing event'
        }
      ]
    },
    {
      name: 'Outdoor Movie Night',
      description: 'A cozy cinema experience under the open sky with blankets, lights, and complimentary popcorn.',
      image: `${events_dir_name}/movie-night.jpg`,
      price: 30.00,
      capacity: 50,
      start: new Date('2025-12-31T19:00:00Z'),
      end: new Date('2025-12-31T22:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Outdoor cinema screen',
          image: `${event_images_dir_name}/cinema-screen.jpg`,
          description: 'Large outdoor screen set up for the movie night'
        },
        {
          name: 'Movie night ambience',
          image: `${event_images_dir_name}/movie-ambience.jpg`,
          description: 'Cozy seating with blankets and lights'
        }
      ]
    },
    {
      name: 'Live Acoustic Music Evening',
      description: 'An intimate evening featuring live acoustic guitar music and relaxing lounge atmosphere.',
      image: `${events_dir_name}/acoustic-night.jpg`,
      price: 45.00,
      capacity: 40,
      start: new Date('2026-01-02T20:00:00Z'),
      end: new Date('2026-01-02T22:00:00Z'),
      is_excluded: false,
      images: [
        {
          name: 'Guitar close-up',
          image: `${event_images_dir_name}/guitar.jpg`,
          description: 'Musician playing acoustic guitar'
        },
        {
          name: 'Warm live music ambience',
          image: `${event_images_dir_name}/music-ambience.jpg`,
          description: 'Cozy evening atmosphere with warm lighting'
        }
      ]
    }
  ];

  for (const event of events) {
    const { images, ...data } = event;

    try {
      let existingEvent = await prisma.event.findFirst({ where: { name: event.name } });
      if (existingEvent) {
        await prisma.event.update({
          where: { id: existingEvent.id },
          data: data,
        });
      } else {
        existingEvent = await prisma.event.create({
          data: data,
        });
      }


      if (images && images.length > 0) {
        await prisma.eventImage.deleteMany({
          where: { event_id: existingEvent.id }
        });

        for (const image of images) {
          await prisma.eventImage.create({
            data: {
              event_id: existingEvent.id,
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
