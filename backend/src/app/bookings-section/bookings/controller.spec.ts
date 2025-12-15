import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './controller';
import { CrudService, ListService, StatusService } from './services';
import { BookingStatus, Role, User } from '@shared/src/database';
import { UpdateBookingDto, BookingsFiltersDto } from './dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let listService: jest.Mocked<ListService>;
  let crudService: jest.Mocked<CrudService>;
  let statusService: jest.Mocked<StatusService>;

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

  const mockBooking = {
    id: 'booking-1',
    user_id: 'user-1',
    booking_variant_id: 'variant-1',
    transaction_id: 'transaction-1',
    status: BookingStatus.PENDING,
    start: new Date('2025-01-01'),
    end: new Date('2025-01-05'),
    message: 'Test booking',
    created: new Date(),
    updated: new Date(),
    booking_variant: {
      id: 'variant-1',
      apartment: {
        id: 'apartment-1',
        name: 'Test Apartment',
      },
    },
  };

  beforeEach(async () => {
    const mockListService = {
      findAll: jest.fn(),
    };

    const mockCrudService = {
      find: jest.fn(),
      update: jest.fn(),
    };

    const mockStatusService = {
      confirmBooking: jest.fn(),
      completeBooking: jest.fn(),
      cancelBooking: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: ListService,
          useValue: mockListService,
        },
        {
          provide: CrudService,
          useValue: mockCrudService,
        },
        {
          provide: StatusService,
          useValue: mockStatusService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    listService = module.get(ListService);
    crudService = module.get(CrudService);
    statusService = module.get(StatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of bookings', async () => {
      const filters: BookingsFiltersDto = { skip: 0, take: 10 };
      const expectedResult = {
        items: [mockBooking],
        total: 1,
        skip: 0,
        take: 10,
      };

      listService.findAll.mockResolvedValue(expectedResult as any);

      const result = await controller.list(mockUser, filters);

      expect(result).toEqual(expectedResult);
      expect(listService.findAll).toHaveBeenCalledWith({
        filters,
        user: mockUser,
      });
    });

    it('should pass filters to service', async () => {
      const filters: BookingsFiltersDto = {
        skip: 10,
        take: 20,
        status: BookingStatus.CONFIRMED,
      };

      listService.findAll.mockResolvedValue({
        items: [],
        total: 0,
        skip: 10,
        take: 20,
      } as any);

      await controller.list(mockUser, filters);

      expect(listService.findAll).toHaveBeenCalledWith({
        filters,
        user: mockUser,
      });
    });
  });

  describe('find', () => {
    it('should return a booking by id', async () => {
      crudService.find.mockResolvedValue(mockBooking as any);

      const result = await controller.find(mockUser, 'booking-1');

      expect(result).toEqual(mockBooking);
      expect(crudService.find).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        user: mockUser,
      });
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateDto: UpdateBookingDto = {
        message: 'Updated message',
      };
      const updatedBooking = { ...mockBooking, ...updateDto };

      crudService.update.mockResolvedValue(updatedBooking as any);

      const result = await controller.update(mockUser, 'booking-1', updateDto);

      expect(result).toEqual(updatedBooking);
      expect(crudService.update).toHaveBeenCalledWith({
        id: 'booking-1',
        data: updateDto,
        user: mockUser,
      });
    });

    it('should update booking status', async () => {
      const updateDto: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
      };
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };

      crudService.update.mockResolvedValue(updatedBooking as any);

      const result = await controller.update(mockUser, 'booking-1', updateDto);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(crudService.update).toHaveBeenCalledWith({
        id: 'booking-1',
        data: updateDto,
        user: mockUser,
      });
    });
  });

  describe('confirmBooking', () => {
    it('should confirm a booking', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };

      statusService.confirmBooking.mockResolvedValue(confirmedBooking as any);

      const result = await controller.confirmBooking('booking-1');

      expect(result).toEqual(confirmedBooking);
      expect(statusService.confirmBooking).toHaveBeenCalledWith('booking-1');
    });
  });

  describe('completeBooking', () => {
    it('should complete a booking', async () => {
      const completedBooking = {
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      };

      statusService.completeBooking.mockResolvedValue(completedBooking as any);

      const result = await controller.completeBooking('booking-1');

      expect(result).toEqual(completedBooking);
      expect(statusService.completeBooking).toHaveBeenCalledWith('booking-1');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      };

      statusService.cancelBooking.mockResolvedValue(cancelledBooking as any);

      const result = await controller.cancelBooking('booking-1');

      expect(result).toEqual(cancelledBooking);
      expect(statusService.cancelBooking).toHaveBeenCalledWith('booking-1');
    });
  });
});
