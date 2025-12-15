import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { SortDirection } from '@shared/src/common';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildQuery', () => {
    it('should build query with default parameters', () => {
      const filters = {
        take: 10,
        skip: 0,
      };

      const result = service.buildQuery({
        filters,
      });

      expect(result).toEqual({
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: SortDirection.desc },
      });
    });

    it('should apply skip and take from filters', () => {
      const filters = {
        skip: 20,
        take: 50,
      };

      const result = service.buildQuery({
        filters,
      });

      expect(result.skip).toBe(20);
      expect(result.take).toBe(50);
    });

    it('should apply sort field and direction', () => {
      const filters = {
        take: 10,
        skip: 0,
        sort_field: 'name' as const,
        sort_direction: SortDirection.asc,
      };

      const result = service.buildQuery<{ id: string; name: string; created: Date }>({
        filters,
      });

      expect(result.order_by).toEqual({ name: SortDirection.asc });
    });

    it('should use default sort field when not provided', () => {
      const filters = {
        take: 10,
        skip: 0,
      };

      const result = service.buildQuery({
        filters,
        default_sort_field: 'created',
      });

      expect(result.order_by).toEqual({ created: SortDirection.desc });
    });

    it('should filter out empty strings and undefined values', () => {
      const filters = {
        take: 10,
        skip: 0,
        name: 'Test',
        description: '',
        price: undefined,
        status: null,
      };

      const result = service.buildQuery({
        filters,
      });

      expect(result.where).not.toHaveProperty('description');
      expect(result.where).not.toHaveProperty('price');
      expect(result.where).not.toHaveProperty('status');
    });

    it('should apply custom filters when provided', () => {
      const filters = {
        take: 10,
        skip: 0,
        min_price: 100,
        max_price: 500,
      };

      const customFilters = (query: any) => ({
        price: { gte: query.min_price, lte: query.max_price },
      });

      const result = service.buildQuery({
        filters,
        customFilters,
      });

      expect(result.where).toHaveProperty('price');
    });

    it('should apply date filters with start_date and end_date', () => {
      const start_date = new Date('2025-01-01');
      const end_date = new Date('2025-01-31');
      const filters = {
        take: 10,
        skip: 0,
        start_date,
        end_date,
      };

      const result = service.buildQuery({
        filters,
        date_field: 'created',
      });

      expect(result.where).toHaveProperty('created');
      expect((result.where as any).created).toEqual({
        gte: start_date,
        lte: end_date,
      });
    });

    it('should apply date filter with only start_date', () => {
      const start_date = new Date('2025-01-01');

      const filters = {
        take: 10,
        skip: 0,
        start_date,
      };

      const result = service.buildQuery({
        filters,
        date_field: 'created',
      });

      expect((result.where as any).created).toEqual({ gte: start_date });
    });

    it('should apply date filter with only end_date', () => {
      const end_date = new Date('2025-01-31');

      const filters = {
        take: 10,
        skip: 0,
        end_date,
      };

      const result = service.buildQuery({
        filters,
        date_field: 'created',
      });

      expect((result.where as any).created).toEqual({ lte: end_date });
    });

    it('should remove skip, take, and search from where clause', () => {
      const filters = {
        skip: 10,
        take: 20,
        search: 'test',
        name: 'Valid Field',
      };

      const result = service.buildQuery({
        filters,
      });

      expect(result.where).not.toHaveProperty('skip');
      expect(result.where).not.toHaveProperty('take');
      expect(result.where).not.toHaveProperty('search');
    });
  });

  describe('findWithPagination', () => {
    it('should return items and total count', async () => {
      const mockModel = {
        findMany: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
        count: jest.fn().mockResolvedValue(2),
      };

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: SortDirection.desc },
      };

      const result = await service.findWithPagination({
        model: mockModel,
        query_options: queryOptions,
      });

      expect(result).toEqual({
        items: [{ id: '1' }, { id: '2' }],
        total: 2,
      });
      expect(mockModel.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        orderBy: { created: SortDirection.desc },
        include: {},
      });
      expect(mockModel.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should pass include parameter to findMany', async () => {
      const mockModel = {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      };

      const queryOptions = {
        skip: 0,
        take: 10,
        where: {},
        order_by: { created: SortDirection.desc },
      };

      const include = {
        relations: true,
        nested: { include: { deep: true } },
      };

      await service.findWithPagination({
        model: mockModel,
        query_options: queryOptions,
        include,
      });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include,
        }),
      );
    });

    it('should remove skip, take, search from where before querying', async () => {
      const mockModel = {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      };

      const queryOptions = {
        skip: 10,
        take: 20,
        where: {
          skip: 10,
          take: 20,
          search: 'test',
          validField: 'value',
        },
        order_by: { created: SortDirection.desc },
      };

      await service.findWithPagination({
        model: mockModel,
        query_options: queryOptions,
      });

      const callArgs = mockModel.findMany.mock.calls[0][0];
      expect(callArgs.where).not.toHaveProperty('skip');
      expect(callArgs.where).not.toHaveProperty('take');
      expect(callArgs.where).not.toHaveProperty('search');
      expect(callArgs.where).toHaveProperty('validField', 'value');
    });
  });
});
