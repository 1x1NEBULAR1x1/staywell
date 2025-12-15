import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './controller';
import { CrudService, ListService } from './services';
import { CreateEventDto, UpdateEventDto, EventsFiltersDto } from './dto';

describe('EventsController', () => {
  let controller: EventsController;
  let crudService: jest.Mocked<CrudService>;
  let listService: jest.Mocked<ListService>;

  const mockEvent = {
    id: 'event-1',
    name: 'Test Event',
    description: 'Test Description',
    price: 100,
    capacity: 20,
    start: new Date('2025-01-01'),
    end: new Date('2025-01-02'),
    image: '/uploads/event.jpg',
    guide_id: 'guide-1',
    created: new Date(),
    updated: new Date(),
  };

  beforeEach(async () => {
    const mockCrudService = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockListService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: CrudService,
          useValue: mockCrudService,
        },
        {
          provide: ListService,
          useValue: mockListService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    crudService = module.get(CrudService);
    listService = module.get(ListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createDto: CreateEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        price: 100,
        capacity: 20,
        start: new Date('2025-01-01'),
        end: new Date('2025-01-02'),
        guide_id: 'guide-1',
        image: '/uploads/event.jpg',
      };

      crudService.create.mockResolvedValue(mockEvent as any);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockEvent);
      expect(crudService.create).toHaveBeenCalledWith({
        data: createDto,
        file: undefined,
      });
    });

    it('should create an event with file', async () => {
      const createDto: CreateEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        price: 100,
        capacity: 20,
        start: new Date('2025-01-01'),
        end: new Date('2025-01-02'),
        guide_id: 'guide-1',
        image: '/uploads/event.jpg',
      };

      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      crudService.create.mockResolvedValue(mockEvent as any);

      const result = await controller.create(createDto, mockFile);

      expect(result).toEqual(mockEvent);
      expect(crudService.create).toHaveBeenCalledWith({
        data: createDto,
        file: mockFile,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of events', async () => {
      const filters: EventsFiltersDto = {
        skip: 0,
        take: 10,
      };

      const expectedResult = {
        items: [mockEvent],
        total: 1,
        skip: 0,
        take: 10,
      };

      listService.get.mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(filters);

      expect(result).toEqual(expectedResult);
      expect(listService.get).toHaveBeenCalledWith(filters);
    });
  });

  describe('find', () => {
    it('should return an event by id', async () => {
      crudService.find.mockResolvedValue(mockEvent as any);

      const result = await controller.find('event-1');

      expect(result).toEqual(mockEvent);
      expect(crudService.find).toHaveBeenCalledWith({ id: 'event-1' });
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateDto: UpdateEventDto = {
        name: 'Updated Event',
      };

      const updatedEvent = { ...mockEvent, ...updateDto };

      crudService.update.mockResolvedValue(updatedEvent as any);

      const result = await controller.update('event-1', updateDto);

      expect(result).toEqual(updatedEvent);
      expect(crudService.update).toHaveBeenCalledWith({
        id: 'event-1',
        data: updateDto,
        file: undefined,
      });
    });

    it('should update an event with file', async () => {
      const updateDto: UpdateEventDto = {
        name: 'Updated Event',
      };

      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const updatedEvent = { ...mockEvent, ...updateDto };

      crudService.update.mockResolvedValue(updatedEvent as any);

      const result = await controller.update('event-1', updateDto, mockFile);

      expect(result).toEqual(updatedEvent);
      expect(crudService.update).toHaveBeenCalledWith({
        id: 'event-1',
        data: updateDto,
        file: mockFile,
      });
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      crudService.remove.mockResolvedValue(mockEvent as any);

      const result = await controller.remove('event-1');

      expect(result).toEqual(mockEvent);
      expect(crudService.remove).toHaveBeenCalledWith('event-1');
    });
  });
});
