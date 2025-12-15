import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CrudService } from './crud.service';
import { PrismaService } from 'src/lib/prisma';
import { FilesService } from 'src/lib/files';
import { CreateEventDto, UpdateEventDto } from '../dto';

describe('Events CrudService', () => {
  let service: CrudService;
  let prismaService: any;
  let filesService: jest.Mocked<FilesService>;

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
    is_excluded: false,
    created: new Date(),
    updated: new Date(),
    booking_events: [],
  };

  beforeEach(async () => {
    const mockPrismaService = {
      event: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    const mockFilesService = {
      saveImage: jest.fn(),
      deleteImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrudService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    service = module.get<CrudService>(CrudService);
    prismaService = module.get(PrismaService);
    filesService = module.get(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
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

    it('should create an event without file', async () => {
      prismaService.event.create.mockResolvedValue(mockEvent as any);

      const result = await service.create({ data: createDto });

      expect(result).toEqual(mockEvent);
      expect(prismaService.event.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should create an event with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      filesService.saveImage.mockReturnValue('/uploads/events/new-event.jpg');
      prismaService.event.create.mockResolvedValue({
        ...mockEvent,
        image: '/uploads/events/new-event.jpg',
      } as any);

      const result = await service.create({ data: createDto, file: mockFile });

      expect(filesService.saveImage).toHaveBeenCalledWith({
        file: mockFile,
        dir_name: 'EVENTS',
      });
      expect(result.image).toBe('/uploads/events/new-event.jpg');
    });
  });

  describe('find', () => {
    it('should find an event by id', async () => {
      prismaService.event.findUnique.mockResolvedValue(mockEvent as any);

      const result = await service.find({ id: 'event-1' });

      expect(result).toBeDefined();
      expect(result.id).toBe('event-1');
      expect(result.available_spots).toBe(20); // capacity - 0 bookings
      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        include: expect.any(Object),
      });
    });

    it('should calculate available spots correctly', async () => {
      const eventWithBookings = {
        ...mockEvent,
        booking_events: [
          { id: 'booking-1', number_of_people: 5 },
          { id: 'booking-2', number_of_people: 3 },
        ],
      };

      prismaService.event.findUnique.mockResolvedValue(
        eventWithBookings as any,
      );

      const result = await service.find({ id: 'event-1' });

      expect(result.available_spots).toBe(12); // 20 - (5 + 3)
    });

    it('should return 0 available spots when fully booked', async () => {
      const eventFullyBooked = {
        ...mockEvent,
        booking_events: [
          { id: 'booking-1', number_of_people: 15 },
          { id: 'booking-2', number_of_people: 10 },
        ],
      };

      prismaService.event.findUnique.mockResolvedValue(eventFullyBooked as any);

      const result = await service.find({ id: 'event-1' });

      expect(result.available_spots).toBe(0); // Max(0, 20 - 25)
    });

    it('should throw NotFoundException when event is not found', async () => {
      prismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.find({ id: 'event-1' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateEventDto = {
      name: 'Updated Event',
      price: 150,
    };

    it('should update an event successfully', async () => {
      const updatedEvent = { ...mockEvent, ...updateDto };

      prismaService.event.findUnique.mockResolvedValue(mockEvent as any);
      prismaService.event.update.mockResolvedValue(updatedEvent as any);

      const result = await service.update({
        id: 'event-1',
        data: updateDto,
      });

      expect(result).toEqual(updatedEvent);
      expect(prismaService.event.update).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        data: { ...updateDto, image: undefined },
      });
    });

    it('should update event with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      filesService.saveImage.mockReturnValue('/uploads/events/updated.jpg');
      prismaService.event.findUnique.mockResolvedValue(mockEvent as any);
      prismaService.event.update.mockResolvedValue({
        ...mockEvent,
        image: '/uploads/events/updated.jpg',
      } as any);

      const result = await service.update({
        id: 'event-1',
        data: updateDto,
        file: mockFile,
      });

      expect(filesService.saveImage).toHaveBeenCalledWith({
        file: mockFile,
        dir_name: 'EVENTS',
      });
      expect(result.image).toBe('/uploads/events/updated.jpg');
    });

    it('should throw error when event to update does not exist', async () => {
      prismaService.event.findUnique.mockResolvedValue(null);

      await expect(
        service.update({ id: 'event-1', data: updateDto }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete event when is_excluded is false', async () => {
      prismaService.event.findUnique.mockResolvedValue({
        ...mockEvent,
        is_excluded: false,
      } as any);
      prismaService.event.update.mockResolvedValue({
        ...mockEvent,
        is_excluded: true,
      } as any);

      const result = await service.remove('event-1');

      expect(result.is_excluded).toBe(true);
      expect(prismaService.event.delete).not.toHaveBeenCalled();
      expect(prismaService.event.update).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        data: { is_excluded: true, image: undefined },
      });
    });

    it('should hard delete event when is_excluded is true', async () => {
      prismaService.event.findUnique.mockResolvedValue({
        ...mockEvent,
        is_excluded: true,
      } as any);
      prismaService.event.delete.mockResolvedValue(mockEvent as any);

      await service.remove('event-1');

      expect(prismaService.event.delete).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
    });

    it('should throw error when event to delete does not exist', async () => {
      prismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.remove('event-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
