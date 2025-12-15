import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CheckoutsService } from './checkouts.service';
import { BookingsCheckoutService } from './bookings.checkout.service';
import { EventsCheckoutService } from './events.checkout.service';
import { StripeService } from '../../../lib/providers/stripe/stripe.service';
import { Role, User } from '@shared/src/database';
import { CreateBookingDto } from '../../bookings-section/bookings/dto';
import { CreateBookingEventDto } from 'src/app/events-section/booking-events/dto/create.dto';

describe('CheckoutsService', () => {
  let service: CheckoutsService;
  let configService: jest.Mocked<ConfigService>;
  let stripeService: jest.Mocked<StripeService>;
  let bookingsCheckoutService: jest.Mocked<BookingsCheckoutService>;
  let eventsCheckoutService: jest.Mocked<EventsCheckoutService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: Role.USER,
    phone_number: '+1234567890',
    image: null,
    password_hash: 'hashed-password',
    date_of_birth: null,
    is_active: true,
    email_verified: false,
    phone_verified: false,
    email_notifications: true,
    created: new Date(),
    updated: new Date(),
  } as any;

  const mockTransaction = {
    id: 'transaction-1',
    user_id: 'user-1',
    amount: 100,
    transaction_status: 'PENDING',
    payment_method: 'STRIPE',
    created: new Date(),
    updated: new Date(),
  };

  const mockBooking = {
    id: 'booking-1',
    user_id: 'user-1',
    booking_variant_id: 'variant-1',
    transaction_id: 'transaction-1',
    start: new Date('2025-01-01'),
    end: new Date('2025-01-05'),
    created: new Date(),
  };

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    const mockStripeService = {
      createBookingSession: jest.fn(),
      createEventSession: jest.fn(),
    };

    const mockBookingsCheckoutService = {
      createBookingCheckout: jest.fn(),
    };

    const mockEventsCheckoutService = {
      createEventsCheckout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
        {
          provide: BookingsCheckoutService,
          useValue: mockBookingsCheckoutService,
        },
        {
          provide: EventsCheckoutService,
          useValue: mockEventsCheckoutService,
        },
      ],
    }).compile();

    service = module.get<CheckoutsService>(CheckoutsService);
    configService = module.get(ConfigService);
    stripeService = module.get(StripeService);
    bookingsCheckoutService = module.get(BookingsCheckoutService);
    eventsCheckoutService = module.get(EventsCheckoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('booking', () => {
    it('should create booking checkout with stripe session', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_variant_id: 'variant-1',
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
        events: [],
        additional_options: [],
      };

      bookingsCheckoutService.createBookingCheckout.mockResolvedValue({
        transaction: mockTransaction,
        booking: mockBooking,
      } as any);

      stripeService.createBookingSession.mockResolvedValue({
        url: 'https://checkout.stripe.com/session-123',
        id: 'session-123',
      } as any);

      const result = await service.booking({
        user: mockUser,
        create_booking_dto: createBookingDto,
      });

      expect(result).toEqual({
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      });

      expect(
        bookingsCheckoutService.createBookingCheckout,
      ).toHaveBeenCalledWith({
        create_booking_dto: createBookingDto,
        user: mockUser,
      });

      expect(stripeService.createBookingSession).toHaveBeenCalledWith({
        create_booking_dto: createBookingDto,
        booking_id: mockBooking.id,
        user: mockUser,
        transaction: mockTransaction,
        access_url: 'http://localhost:3000/bookings/booking-1/success',
        cancel_url: 'http://localhost:3000/bookings/booking-1/pending',
      });
    });

    it('should use correct URLs from config', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_variant_id: 'variant-1',
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
        events: [],
        additional_options: [],
      };

      configService.get.mockReturnValue('https://example.com');

      bookingsCheckoutService.createBookingCheckout.mockResolvedValue({
        transaction: mockTransaction,
        booking: mockBooking,
      } as any);

      stripeService.createBookingSession.mockResolvedValue({
        url: 'https://checkout.stripe.com/session-123',
        id: 'session-123',
      } as any);

      await service.booking({
        user: mockUser,
        create_booking_dto: createBookingDto,
      });

      expect(stripeService.createBookingSession).toHaveBeenCalledWith(
        expect.objectContaining({
          access_url: 'https://example.com/bookings/booking-1/success',
          cancel_url: 'https://example.com/bookings/booking-1/pending',
        }),
      );
    });
  });

  describe('event', () => {
    it('should create event checkout with stripe session', async () => {
      const createBookingEventDtos: any[] = [
        {
          event_id: 'event-1',
          number_of_people: 2,
        },
      ];

      const mockEvents = [
        {
          event_id: 'event-1',
          number_of_people: 2,
          price: 50,
        },
      ];

      eventsCheckoutService.createEventsCheckout.mockResolvedValue({
        transaction: mockTransaction,
        events: mockEvents,
      } as any);

      stripeService.createEventSession.mockResolvedValue({
        url: 'https://checkout.stripe.com/session-123',
        id: 'session-123',
      } as any);

      const result = await service.event({
        user: mockUser,
        create_booking_event_dtos: createBookingEventDtos,
      });

      expect(result).toEqual({
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      });

      expect(eventsCheckoutService.createEventsCheckout).toHaveBeenCalledWith({
        event_checkout_dtos: createBookingEventDtos,
        user: mockUser,
      });

      expect(stripeService.createEventSession).toHaveBeenCalledWith({
        create_booking_event_dtos: mockEvents,
        user: mockUser,
        transaction: mockTransaction,
        access_url: 'http://localhost:3000/events/membership',
        cancel_url: 'http://localhost:3000/events/pending',
      });
    });

    it('should use correct event URLs from config', async () => {
      const createBookingEventDtos: any[] = [
        {
          event_id: 'event-1',
          number_of_people: 1,
        },
      ];

      configService.get.mockReturnValue('https://example.com');

      eventsCheckoutService.createEventsCheckout.mockResolvedValue({
        transaction: mockTransaction,
        events: [],
      } as any);

      stripeService.createEventSession.mockResolvedValue({
        url: 'https://checkout.stripe.com/session-123',
        id: 'session-123',
      } as any);

      await service.event({
        user: mockUser,
        create_booking_event_dtos: createBookingEventDtos,
      });

      expect(stripeService.createEventSession).toHaveBeenCalledWith(
        expect.objectContaining({
          access_url: 'https://example.com/events/membership',
          cancel_url: 'https://example.com/events/pending',
        }),
      );
    });
  });
});
