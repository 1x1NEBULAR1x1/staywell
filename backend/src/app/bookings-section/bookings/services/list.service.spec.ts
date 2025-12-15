import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { PrismaService } from 'src/lib/prisma';
import { BookingStatus, Role, User } from '@shared/src/database';
import { BookingsFiltersDto } from '../dto';
import { SortDirection } from '@shared/src/common';

describe('Bookings ListService', () => {
  let service: ListService;
  let prismaService: any;

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

  const mockAdminUser = {
    ...mockUser,
    id: 'admin-1',
    email: 'admin@example.com',
    role: Role.ADMIN,
  };

  const mockBookings = [
    {
      id: 'booking-1',
      user_id: 'user-1',
      booking_variant_id: 'variant-1',
      status: BookingStatus.PENDING,
      start: new Date('2025-01-01'),
      end: new Date('2025-01-05'),
      created: new Date(),
    },
    {
      id: 'booking-2',
      user_id: 'user-1',
      booking_variant_id: 'variant-2',
      status: BookingStatus.CONFIRMED,
      start: new Date('2025-02-01'),
      end: new Date('2025-02-05'),
      created: new Date(),
    },
  ];

  beforeEach(async () => {
    const mockPrismaService = {
      booking: {},
      buildQuery: jest.fn(),
      findWithPagination: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated bookings for regular user', async () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const queryOptions = {
        skip: 0,
        take: 10,
        where: { user_id: 'user-1' },
        order_by: { start: SortDirection.desc },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockBookings,
        total: 2,
      } as any);

      const result = await service.findAll({ filters, user: mockUser });

      expect(result).toEqual({
        items: mockBookings,
        total: 2,
        skip: 0,
        take: 10,
      });
      expect(prismaService.buildQuery).toHaveBeenCalledWith({
        filters: { ...filters, user_id: 'user-1' },
        date_field: 'start',
        customFilters: expect.any(Function),
      });
      expect(prismaService.findWithPagination).toHaveBeenCalledWith({
        model: prismaService.booking,
        query_options: queryOptions,
        include: expect.any(Object),
      });
    });

    it('should return paginated bookings for admin user without user filter', async () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { start: SortDirection.desc },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockBookings,
        total: 2,
      } as any);

      await service.findAll({ filters, user: mockAdminUser });

      expect(prismaService.buildQuery).toHaveBeenCalledWith({
        filters: { ...filters, user_id: undefined },
        date_field: 'start',
        customFilters: expect.any(Function),
      });
    });

    it('should filter by status', async () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        status: BookingStatus.CONFIRMED,
      };

      const queryOptions = {
        skip: 0,
        take: 10,
        where: { user_id: 'user-1', status: BookingStatus.CONFIRMED },
        order_by: { start: SortDirection.desc },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: [mockBookings[1]],
        total: 1,
      } as any);

      const result = await service.findAll({ filters, user: mockUser });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('customFilters', () => {
    it('should build filters with status', () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        status: BookingStatus.PENDING,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({ status: BookingStatus.PENDING });
    });

    it('should build filters with user_id', () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        user_id: 'user-1',
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({ user_id: 'user-1' });
    });

    it('should build filters with booking_variant_id', () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        booking_variant_id: 'variant-1',
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({ booking_variant_id: 'variant-1' });
    });

    it('should build filters with transaction_id', () => {
      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        transaction_id: 'transaction-1',
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({ transaction_id: 'transaction-1' });
    });

    it('should build filters with date range (start and end)', () => {
      const start_date = new Date('2025-01-01');
      const end_date = new Date('2025-01-31');

      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        start_date,
        end_date,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        OR: [
          {
            AND: [{ start: { lte: end_date } }, { end: { gte: start_date } }],
          },
        ],
      });
    });

    it('should build filters with only start_date', () => {
      const start_date = new Date('2025-01-01');

      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        start_date,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        start: { gte: start_date },
      });
    });

    it('should build filters with only end_date', () => {
      const end_date = new Date('2025-01-31');

      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        end_date,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        end: { lte: end_date },
      });
    });

    it('should build complex filters with multiple criteria', () => {
      const start_date = new Date('2025-01-01');
      const end_date = new Date('2025-01-31');

      const filters: BookingsFiltersDto = {
        skip: 0,
        take: 10,
        status: BookingStatus.CONFIRMED,
        user_id: 'user-1',
        booking_variant_id: 'variant-1',
        transaction_id: 'transaction-1',
        start_date,
        end_date,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        status: BookingStatus.CONFIRMED,
        user_id: 'user-1',
        booking_variant_id: 'variant-1',
        transaction_id: 'transaction-1',
        OR: [
          {
            AND: [{ start: { lte: end_date } }, { end: { gte: start_date } }],
          },
        ],
      });
    });
  });
});
