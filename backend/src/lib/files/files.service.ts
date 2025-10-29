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
   * Создает директорию для загрузки файлов, если она не существует
   */
  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    // Создаем директории для разных типов файлов
    const modelDirectories = Object.values(ImagePaths);
    modelDirectories.forEach((dir) => {
      const modelDir = path.join(this.uploadPath, dir);
      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
      }
    });
  }

  /**
   * Сохраняет файл изображения для указанной модели
   * @param file - загруженный файл
   * @param dir_name - название модели
   * @returns путь к сохраненному файлу
   */
  saveImage({
    file,
    dir_name,
  }: {
    file: Express.Multer.File;
    dir_name: ImagePaths;
  }): string {
    // Валидируем имя модели
    if (!this.isValidImage(file))
      throw new Error(
        'Недопустимый формат файла. Разрешены только JPEG, PNG и WebP',
      );

    if (!this.isValidSize(file, 5))
      throw new Error('Размер файла не должен превышать 5 МБ');

    if (!ImagePaths[dir_name]) {
      throw new Error(`Недопустимая directory: ${dir_name}`);
    }
    // Очищаем имя файла от специальных символов и пробелов
    const cleanOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_') // заменяем все специальные символы на подчеркивания
      .replace(/_+/g, '_') // заменяем множественные подчеркивания на одинарные
      .replace(/^_|_$/g, ''); // удаляем подчеркивания в начале и конце
    const singularModel = dir_name.endsWith('s')
      ? dir_name.slice(0, -1)
      : dir_name;
    const fileName = `${singularModel}_${Date.now()}_${cleanOriginalName}`;
    const filePath = path.join(this.uploadPath, dir_name, fileName);
    fs.writeFileSync(filePath, file.buffer);
    // Возвращаем относительный путь для хранения в БД
    return `/static/${ImagePaths[dir_name]}/${fileName}`;
  }
  /**
   * Удаляет файл изображения
   * @param imagePath - путь к изображению
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
   * Проверяет, является ли файл допустимым изображением
   * @param file - проверяемый файл
   * @returns true, если файл является изображением
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
   * Проверяет размер файла
   * @param file - проверяемый файл
   * @param maxSizeInMB - максимальный размер в МБ
   * @returns true, если размер файла допустим
   */
  isValidSize(file: Express.Multer.File, maxSizeInMB: number = 5): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
}
