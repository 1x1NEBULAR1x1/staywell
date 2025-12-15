import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './services';
import { Role, User } from '@shared/src/database';
import { CreateBookingDto } from '../bookings-section/bookings/dto';
import { CreateBookingEventDto } from '../events-section/booking-events/dto';

describe('CheckoutsController', () => {
  let controller: CheckoutsController;
  let checkoutsService: jest.Mocked<CheckoutsService>;

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
  };

  const mockTransaction = {
    id: 'transaction-1',
    amount: 100,
    transaction_status: 'PENDING',
    created: new Date(),
  };

  beforeEach(async () => {
    const mockCheckoutsService = {
      booking: jest.fn(),
      event: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutsController],
      providers: [
        {
          provide: CheckoutsService,
          useValue: mockCheckoutsService,
        },
      ],
    }).compile();

    controller = module.get<CheckoutsController>(CheckoutsController);
    checkoutsService = module.get(CheckoutsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('booking', () => {
    it('should create booking checkout', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_variant_id: 'variant-1',
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
        events: [],
        additional_options: [],
      };

      const expectedResult = {
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      };

      checkoutsService.booking.mockResolvedValue(expectedResult as any);

      const result = await controller.booking(mockUser, createBookingDto);

      expect(result).toEqual(expectedResult);
      expect(checkoutsService.booking).toHaveBeenCalledWith({
        user: mockUser,
        create_booking_dto: createBookingDto,
      });
    });

    it('should handle booking with events', async () => {
      const createBookingDto: CreateBookingDto = {
        booking_variant_id: 'variant-1',
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
        events: [
          {
            event_id: 'event-1',
            number_of_people: 2,
            booking_id: 'booking-1',
            transaction_id: 'transaction-1',
          },
        ],
        additional_options: [],
      };

      const expectedResult = {
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      };

      checkoutsService.booking.mockResolvedValue(expectedResult as any);

      const result = await controller.booking(mockUser, createBookingDto);

      expect(result).toEqual(expectedResult);
      expect(checkoutsService.booking).toHaveBeenCalledWith({
        user: mockUser,
        create_booking_dto: createBookingDto,
      });
    });
  });

  describe('event', () => {
    it('should create event checkout', async () => {
      const createBookingEventDtos: CreateBookingEventDto[] = [
        {
          event_id: 'event-1',
          number_of_people: 2,
          transaction_id: 'transaction-1',
          booking_id: null,
        },
        {
          event_id: 'event-2',
          number_of_people: 1,
          booking_id: null,
          transaction_id: 'transaction-2',
        },
      ];

      const expectedResult = {
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      };

      checkoutsService.event.mockResolvedValue(expectedResult as any);

      const result = await controller.event(mockUser, createBookingEventDtos);

      expect(result).toEqual(expectedResult);
      expect(checkoutsService.event).toHaveBeenCalledWith({
        user: mockUser,
        create_booking_event_dtos: createBookingEventDtos,
      });
    });

    it('should handle single event checkout', async () => {
      const createBookingEventDtos: CreateBookingEventDto[] = [
        {
          event_id: 'event-1',
          number_of_people: 1,
          transaction_id: 'transaction-1',
          booking_id: null,
        },
      ];

      const expectedResult = {
        session_url: 'https://checkout.stripe.com/session-123',
        transaction: mockTransaction,
      };

      checkoutsService.event.mockResolvedValue(expectedResult as any);

      const result = await controller.event(mockUser, createBookingEventDtos);

      expect(result).toEqual(expectedResult);
    });
  });
});
