import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ImagePaths } from '@shared/src/common/image-paths.enum';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
    (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveImage', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    it('should save image successfully', () => {
      const result = service.saveImage({
        file: mockFile,
        dir_name: ImagePaths.APARTMENTS,
      });

      expect(result).toContain('/static/APARTMENTS/');
      expect(result).toContain('test-image.jpg');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should save image to correct directory', () => {
      const result = service.saveImage({
        file: mockFile,
        dir_name: ImagePaths.EVENTS,
      });

      expect(result).toContain('/static/EVENTS/');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('EVENTS'),
        mockFile.buffer,
      );
    });

    it('should clean filename from special characters', () => {
      const fileWithSpecialChars: Express.Multer.File = {
        ...mockFile,
        originalname: 'test file@#$%^&*.jpg',
      };

      const result = service.saveImage({
        file: fileWithSpecialChars,
        dir_name: ImagePaths.APARTMENTS,
      });

      expect(result).not.toContain('@');
      expect(result).not.toContain('#');
      expect(result).not.toContain('$');
      expect(result).not.toContain('%');
    });

    it('should add timestamp to filename', () => {
      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(123456789);

      const result = service.saveImage({
        file: mockFile,
        dir_name: ImagePaths.APARTMENTS,
      });

      expect(result).toContain('123456789');
      dateSpy.mockRestore();
    });

    it('should throw error for invalid image format', () => {
      const invalidFile: Express.Multer.File = {
        ...mockFile,
        mimetype: 'application/pdf',
      };

      expect(() =>
        service.saveImage({
          file: invalidFile,
          dir_name: ImagePaths.APARTMENTS,
        }),
      ).toThrow('Invalid file format');
    });

    it('should throw error for oversized file', () => {
      const oversizedFile: Express.Multer.File = {
        ...mockFile,
        size: 10 * 1024 * 1024, // 10MB
      };

      expect(() =>
        service.saveImage({
          file: oversizedFile,
          dir_name: ImagePaths.APARTMENTS,
        }),
      ).toThrow('File size must not exceed 5 MB');
    });

    it('should throw error for invalid directory', () => {
      expect(() =>
        service.saveImage({
          file: mockFile,
          dir_name: 'INVALID_DIR' as ImagePaths,
        }),
      ).toThrow('Invalid directory');
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      service.deleteImage('/static/APARTMENTS/test.jpg');

      expect(fs.unlinkSync).toHaveBeenCalledWith(
        expect.stringContaining('APARTMENTS'),
      );
    });

    it('should not throw error if file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(() =>
        service.deleteImage('/static/APARTMENTS/nonexistent.jpg'),
      ).not.toThrow();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should not process invalid paths', () => {
      jest.clearAllMocks(); // Clear mocks called in constructor

      service.deleteImage('invalid/path.jpg');

      expect(fs.existsSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe('isValidImage', () => {
    it('should validate jpeg image', () => {
      const jpegFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'image/jpeg',
      };

      expect(service.isValidImage(jpegFile)).toBe(true);
    });

    it('should validate jpg image', () => {
      const jpgFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'image/jpg',
      };

      expect(service.isValidImage(jpgFile)).toBe(true);
    });

    it('should validate png image', () => {
      const pngFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'image/png',
      };

      expect(service.isValidImage(pngFile)).toBe(true);
    });

    it('should validate webp image', () => {
      const webpFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'image/webp',
      };

      expect(service.isValidImage(webpFile)).toBe(true);
    });

    it('should reject invalid mime types', () => {
      const invalidFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'application/pdf',
      };

      expect(service.isValidImage(invalidFile)).toBe(false);
    });

    it('should reject gif images', () => {
      const gifFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        mimetype: 'image/gif',
      };

      expect(service.isValidImage(gifFile)).toBe(false);
    });
  });

  describe('isValidSize', () => {
    it('should validate file within size limit', () => {
      const validFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        size: 3 * 1024 * 1024, // 3MB
      };

      expect(service.isValidSize(validFile, 5)).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const oversizedFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        size: 10 * 1024 * 1024, // 10MB
      };

      expect(service.isValidSize(oversizedFile, 5)).toBe(false);
    });

    it('should use default max size of 5MB', () => {
      const largeFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        size: 6 * 1024 * 1024, // 6MB
      };

      expect(service.isValidSize(largeFile)).toBe(false);
    });

    it('should validate file exactly at size limit', () => {
      const exactSizeFile: Express.Multer.File = {
        ...({} as Express.Multer.File),
        size: 5 * 1024 * 1024, // exactly 5MB
      };

      expect(service.isValidSize(exactSizeFile, 5)).toBe(true);
    });
  });
});
