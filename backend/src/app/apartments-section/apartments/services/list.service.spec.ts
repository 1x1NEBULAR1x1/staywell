import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { PrismaService } from 'src/lib/prisma';
import { ApartmentType, Role, User } from '@shared/src/database';
import { ApartmentsFiltersDto } from '../dto';

describe('Apartments ListService', () => {
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
    email: 'admin@example.com',
    id: 'admin-1',
    role: Role.ADMIN,
  } as User;

  beforeEach(async () => {
    const mockPrismaService = {
      apartment: {},
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

  describe('customFilters', () => {
    it('should filter by min_price', () => {
      const filters = {
        min_price: 100,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        booking_variants: { some: { price: { gte: 100 } } },
      });
    });

    it('should filter by max_price', () => {
      const filters = {
        max_price: 500,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        booking_variants: { some: { price: { lte: 500 } } },
      });
    });

    it('should filter by is_available', () => {
      const filters = {
        is_available: true,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        is_available: true,
      });
    });

    it('should not filter by is_available when false', () => {
      const filters = {
        is_available: false,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result.is_available).toBeUndefined();
    });

    it('should filter by is_smoking', () => {
      const filters = {
        is_smoking: true,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        is_smoking: true,
      });
    });

    it('should filter by is_pet_friendly', () => {
      const filters: ApartmentsFiltersDto = {
        is_pet_friendly: true,
        skip: 0,
        take: 10,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        is_pet_friendly: true,
      });
    });

    it('should filter by type', () => {
      const filters = {
        type: ApartmentType.STANDARD,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        type: ApartmentType.STANDARD,
      });
    });

    it('should filter by min_capacity when is_available is not false', () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        min_capacity: 2,
        is_available: true,
      };

      const result = service.customFilters(filters);

      expect(result).toEqual({
        is_available: true,
        max_capacity: { gte: 2 },
      });
    });

    it('should filter by guests', () => {
      const filters = {
        guests: 4,
        is_available: true,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toEqual({
        is_available: true,
        max_capacity: { gte: 4 },
      });
    });

    it('should filter by date range when is_available is not false', () => {
      const start_date = new Date('2025-01-01');
      const end_date = new Date('2025-01-31');

      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        start_date,
        end_date,
        is_available: true,
      };

      const result = service.customFilters(filters);

      expect(result).toHaveProperty('AND');
      expect(result).toHaveProperty('is_available', true);
    });

    it('should not apply date filter when is_available is false', () => {
      const start_date = new Date('2025-01-01');
      const end_date = new Date('2025-01-31');

      const filters = {
        skip: 0,
        take: 10,
        start_date,
        end_date,
        is_available: false,
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result.AND).toBeUndefined();
    });

    it('should filter by search query', () => {
      const filters = {
        search: 'luxury',
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toHaveProperty('OR');
      expect(result.OR).toHaveLength(2);
    });

    it('should combine multiple filters', () => {
      const filters = {
        min_price: 100,
        max_price: 500,
        is_available: true,
        is_smoking: false,
        is_pet_friendly: true,
        type: ApartmentType.STANDARD,
        guests: 2,
        search: 'luxury',
      } as ApartmentsFiltersDto;

      const result = service.customFilters(filters);

      expect(result).toHaveProperty('booking_variants');
      expect(result).toHaveProperty('is_available', true);
      expect(result).toHaveProperty('is_smoking', false);
      expect(result).toHaveProperty('is_pet_friendly', true);
      expect(result).toHaveProperty('type', ApartmentType.STANDARD);
      expect(result).toHaveProperty('max_capacity');
      expect(result).toHaveProperty('OR');
    });
  });

  describe('list', () => {
    it('should return paginated apartments list', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const mockApartments = [
        {
          id: 'apartment-1',
          name: 'Test Apartment',
          booking_variants: [
            { id: 'variant-1', price: 100, capacity: 2, is_available: true },
          ],
        },
      ];

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: 'desc' },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockApartments,
        total: 1,
      } as any);

      const result = await service.list({ filters, user: mockUser });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.skip).toBe(0);
      expect(result.take).toBe(10);
    });

    it('should filter out apartments without booking variants when is_available is true', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        is_available: true,
      };

      const mockApartments = [
        {
          id: 'apartment-1',
          name: 'Apartment with variants',
          booking_variants: [
            { id: 'variant-1', price: 100, capacity: 2, is_available: true },
          ],
        },
        {
          id: 'apartment-2',
          name: 'Apartment without variants',
          booking_variants: [],
        },
      ];

      const queryOptions = {
        skip: 0,
        take: 10,
        where: { is_available: true },
        order_by: { created: 'desc' },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockApartments,
        total: 2,
      } as any);

      const result = await service.list({ filters, user: mockUser });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('apartment-1');
    });

    it('should include apartments without variants when is_available is false', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        is_available: false,
      };

      const mockApartments = [
        {
          id: 'apartment-1',
          name: 'Apartment with variants',
          booking_variants: [
            { id: 'variant-1', price: 100, capacity: 2, is_available: true },
          ],
        },
        {
          id: 'apartment-2',
          name: 'Apartment without variants',
          booking_variants: [],
        },
      ];

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: 'desc' },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockApartments,
        total: 2,
      } as any);

      const result = await service.list({ filters, user: mockUser });

      expect(result.items).toHaveLength(2);
    });

    it('should find cheapest variant correctly', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const mockApartments = [
        {
          id: 'apartment-1',
          name: 'Test Apartment',
          booking_variants: [
            { id: 'variant-1', price: 150, capacity: 2, is_available: true },
            { id: 'variant-2', price: 100, capacity: 4, is_available: true },
            { id: 'variant-3', price: 200, capacity: 6, is_available: true },
          ],
        },
      ];

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: 'desc' },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockApartments,
        total: 1,
      } as any);

      const result = await service.list({ filters, user: mockUser });

      expect(result.items[0].cheapest_variant?.price).toBe(100);
      expect(result.items[0].cheapest_variant?.id).toBe('variant-2');
    });

    it('should filter variants by capacity requirements', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        min_capacity: 4,
      };

      const mockApartments = [
        {
          id: 'apartment-1',
          name: 'Test Apartment',
          booking_variants: [
            { id: 'variant-1', price: 100, capacity: 2, is_available: true },
            { id: 'variant-2', price: 150, capacity: 4, is_available: true },
            { id: 'variant-3', price: 200, capacity: 6, is_available: true },
          ],
        },
      ];

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: 'desc' },
      };

      prismaService.buildQuery.mockReturnValue(queryOptions as any);
      prismaService.findWithPagination.mockResolvedValue({
        items: mockApartments,
        total: 1,
      } as any);

      const result = await service.list({ filters, user: mockUser });

      expect(result.items[0].cheapest_variant?.price).toBe(150);
      expect(result.items[0].cheapest_variant?.id).toBe('variant-2');
    });
  });
});
