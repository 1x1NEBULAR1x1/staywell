import { Injectable, Global } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ImagePaths } from '@shared/src/common/image-paths.enum';

@Global()
@Injectable()
export class FilesService {
  private readonly uploadPath = 'uploads';

  constructor() {
    this.ensureUploadDir();
  }

  /**
   * Creates upload directory if it doesn't exist
   */
  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    // Create directories for different file types
    const modelDirectories = Object.values(ImagePaths);
    modelDirectories.forEach((dir) => {
      const modelDir = path.join(this.uploadPath, dir);
      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
      }
    });
  }

  /**
   * Saves image file for specified model
   * @param file - uploaded file
   * @param dir_name - model name
   * @returns path to saved file
   */
  saveImage({
    file,
    dir_name,
  }: {
    file: Express.Multer.File;
    dir_name: ImagePaths;
  }): string {
    // Validate model name
    if (!this.isValidImage(file))
      throw new Error(
        'Invalid file format. Only JPEG, PNG and WebP are allowed',
      );

    if (!this.isValidSize(file, 5))
      throw new Error('File size must not exceed 5 MB');

    if (!ImagePaths[dir_name]) {
      throw new Error(`Invalid directory: ${dir_name}`);
    }
    // Clean filename from special characters and spaces
    const cleanOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_') // replace all special characters with underscores
      .replace(/_+/g, '_') // replace multiple underscores with single
      .replace(/^_|_$/g, ''); // remove underscores at the beginning and end
    const singularModel = dir_name.endsWith('s')
      ? dir_name.slice(0, -1)
      : dir_name;
    const fileName = `${singularModel}_${Date.now()}_${cleanOriginalName}`;
    const filePath = path.join(this.uploadPath, dir_name, fileName);
    fs.writeFileSync(filePath, file.buffer);
    // Return relative path for storing in DB
    return `/static/${ImagePaths[dir_name]}/${fileName}`;
  }
  /**
   * Deletes image file
   * @param imagePath - path to image
   */
  deleteImage(imagePath: string) {
    if (!imagePath || !imagePath.startsWith('/static/')) {
      return;
    }
    const filePath = path.join(
      this.uploadPath,
      imagePath.replace('/static/', ''),
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  /**
   * Checks if file is a valid image
   * @param file - file to check
   * @returns true if file is an image
   */
  isValidImage(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }
  /**
   * Checks file size
   * @param file - file to check
   * @param maxSizeInMB - maximum size in MB
   * @returns true if file size is valid
   */
  isValidSize(file: Express.Multer.File, maxSizeInMB: number = 5): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
}
