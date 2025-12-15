import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsController } from './controller';
import {
  CrudService,
  ListService,
  AvailabilityService,
  AvailableListService,
  DatesConfigService,
  EventsConfigService,
} from './services';
import { ApartmentType, Role, User } from '@shared/src/database';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  ApartmentsFiltersDto,
  DateRangeDto,
  DatesConfigDto,
  EventsConfigDto,
} from './dto';

describe('ApartmentsController', () => {
  let controller: ApartmentsController;
  let crudService: jest.Mocked<CrudService>;
  let listService: jest.Mocked<ListService>;
  let availabilityService: jest.Mocked<AvailabilityService>;
  let availableListService: jest.Mocked<AvailableListService>;
  let datesConfigService: jest.Mocked<DatesConfigService>;
  let eventsConfigService: jest.Mocked<EventsConfigService>;

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

  const mockApartment = {
    id: 'apartment-1',
    name: 'Test Apartment',
    description: 'Test Description',
    number: 101,
    type: ApartmentType.STANDARD,
    max_capacity: 4,
    is_available: true,
    is_smoking: false,
    is_pet_friendly: true,
    image: '/uploads/apartment.jpg',
    created: new Date(),
    updated: new Date(),
  };

  beforeEach(async () => {
    const mockCrudService = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockListService = {
      list: jest.fn(),
    };

    const mockAvailabilityService = {
      checkApartmentAvailability: jest.fn(),
    };

    const mockAvailableListService = {
      findAvailableApartments: jest.fn(),
    };

    const mockDatesConfigService = {
      getDatesConfig: jest.fn(),
    };

    const mockEventsConfigService = {
      getAvailableEvents: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentsController],
      providers: [
        {
          provide: CrudService,
          useValue: mockCrudService,
        },
        {
          provide: ListService,
          useValue: mockListService,
        },
        {
          provide: AvailabilityService,
          useValue: mockAvailabilityService,
        },
        {
          provide: AvailableListService,
          useValue: mockAvailableListService,
        },
        {
          provide: DatesConfigService,
          useValue: mockDatesConfigService,
        },
        {
          provide: EventsConfigService,
          useValue: mockEventsConfigService,
        },
      ],
    }).compile();

    controller = module.get<ApartmentsController>(ApartmentsController);
    crudService = module.get(CrudService);
    listService = module.get(ListService);
    availabilityService = module.get(AvailabilityService);
    availableListService = module.get(AvailableListService);
    datesConfigService = module.get(DatesConfigService);
    eventsConfigService = module.get(EventsConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an apartment', async () => {
      const createDto: CreateApartmentDto = {
        name: 'Test Apartment',
        description: 'Test Description',
        number: 101,
        type: ApartmentType.STANDARD,
        max_capacity: 4,
        is_smoking: false,
        is_pet_friendly: true,
        image: '/uploads/apartment.jpg',
        floor: 1,
        rooms_count: 2,
        rules: 'Test Rules',
        is_available: true,
        deposit: 100,
      };

      crudService.create.mockResolvedValue(mockApartment as any);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockApartment);
      expect(crudService.create).toHaveBeenCalledWith({
        data: createDto,
        file: undefined,
      });
    });

    it('should create an apartment with file', async () => {
      const createDto: CreateApartmentDto = {
        name: 'Test Apartment',
        description: 'Test Description',
        number: 101,
        type: ApartmentType.STANDARD,
        max_capacity: 4,
        is_smoking: false,
        is_pet_friendly: true,
        image: '/uploads/apartment.jpg',
        floor: 1,
        rooms_count: 2,
        rules: 'Test Rules',
        is_available: true,
        deposit: 100,
      };

      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      crudService.create.mockResolvedValue(mockApartment as any);

      const result = await controller.create(createDto, mockFile);

      expect(result).toEqual(mockApartment);
      expect(crudService.create).toHaveBeenCalledWith({
        data: createDto,
        file: mockFile,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of apartments', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const expectedResult = {
        items: [mockApartment],
        total: 1,
        skip: 0,
        take: 10,
      };

      listService.list.mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(filters, mockUser);

      expect(result).toEqual(expectedResult);
      expect(listService.list).toHaveBeenCalledWith({
        filters,
        user: mockUser,
      });
    });
  });

  describe('findOne', () => {
    it('should return an apartment by id', async () => {
      crudService.findOne.mockResolvedValue(mockApartment as any);

      const result = await controller.findOne('apartment-1', mockUser);

      expect(result).toEqual(mockApartment);
      expect(crudService.findOne).toHaveBeenCalledWith({
        where: { id: 'apartment-1' },
        user: mockUser,
      });
    });
  });

  describe('update', () => {
    it('should update an apartment', async () => {
      const updateDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
      };

      const updatedApartment = { ...mockApartment, ...updateDto };

      crudService.update.mockResolvedValue(updatedApartment as any);

      const result = await controller.update('apartment-1', updateDto);

      expect(result).toEqual(updatedApartment);
      expect(crudService.update).toHaveBeenCalledWith({
        where: { id: 'apartment-1' },
        data: updateDto,
        file: undefined,
      });
    });

    it('should update an apartment with file', async () => {
      const updateDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
      };

      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const updatedApartment = { ...mockApartment, ...updateDto };

      crudService.update.mockResolvedValue(updatedApartment as any);

      const result = await controller.update(
        'apartment-1',
        updateDto,
        mockFile,
      );

      expect(result).toEqual(updatedApartment);
      expect(crudService.update).toHaveBeenCalledWith({
        where: { id: 'apartment-1' },
        data: updateDto,
        file: mockFile,
      });
    });
  });

  describe('remove', () => {
    it('should remove an apartment', async () => {
      crudService.remove.mockResolvedValue(mockApartment as any);

      const result = await controller.remove('apartment-1');

      expect(result).toEqual(mockApartment);
      expect(crudService.remove).toHaveBeenCalledWith({ id: 'apartment-1' });
    });
  });

  describe('checkAvailability', () => {
    it('should check apartment availability', async () => {
      const dateRange: DateRangeDto = {
        start_date: new Date('2025-01-01'),
        end_date: new Date('2025-01-05'),
      };

      const expectedResult = {
        is_available: true,
      };

      availabilityService.checkApartmentAvailability.mockResolvedValue(
        expectedResult as any,
      );

      const result = await controller.checkAvailability(
        'apartment-1',
        dateRange,
      );

      expect(result).toEqual(expectedResult);
      expect(
        availabilityService.checkApartmentAvailability,
      ).toHaveBeenCalledWith({
        id: 'apartment-1',
        ...dateRange,
      });
    });
  });

  describe('findAvailable', () => {
    it('should return available apartments', async () => {
      const filters: ApartmentsFiltersDto = {
        skip: 0,
        take: 10,
        start_date: new Date('2025-01-01'),
        end_date: new Date('2025-01-05'),
      };

      const expectedResult = {
        items: [mockApartment],
        total: 1,
      };

      availableListService.findAvailableApartments.mockResolvedValue(
        expectedResult as any,
      );

      const result = await controller.findAvailable(filters);

      expect(result).toEqual(expectedResult);
      expect(availableListService.findAvailableApartments).toHaveBeenCalledWith(
        filters,
      );
    });
  });

  describe('getDatesConfig', () => {
    it('should return dates configuration', async () => {
      const datesConfig: DatesConfigDto = {
        year: 2025,
        month: 1,
      };

      const expectedResult = {
        occupied_dates: ['2025-01-01', '2025-01-02'],
      };

      datesConfigService.getDatesConfig.mockResolvedValue(
        expectedResult as any,
      );

      const result = await controller.getDatesConfig(
        'apartment-1',
        datesConfig,
      );

      expect(result).toEqual(expectedResult);
      expect(datesConfigService.getDatesConfig).toHaveBeenCalledWith({
        id: 'apartment-1',
        ...datesConfig,
      });
    });
  });

  describe('getAvailableEvents', () => {
    it('should return available events', async () => {
      const eventsConfig: EventsConfigDto = {
        start_date: new Date('2025-01-01'),
        end_date: new Date('2025-01-05'),
      };

      const expectedResult = {
        available_events: [
          {
            id: 'event-1',
            name: 'Test Event',
            available_spots: 5,
          },
        ],
      };

      eventsConfigService.getAvailableEvents.mockResolvedValue(
        expectedResult as any,
      );

      const result = await controller.getAvailableEvents(eventsConfig);

      expect(result).toEqual(expectedResult);
      expect(eventsConfigService.getAvailableEvents).toHaveBeenCalledWith(
        eventsConfig,
      );
    });
  });
});
