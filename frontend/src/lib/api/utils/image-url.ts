/**
 * Формирует полный URL для статических изображений
 * @param imagePath - относительный путь к изображению (например: /static/categories/image.png)
 * @returns полный URL к изображению
 */
export const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
  if (!imagePath) return undefined;

  // Если путь уже полный URL или это путь к статическим файлам Next.js, возвращаем как есть
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('/_next/') ||
    imagePath.startsWith('data:image')
  ) {
    return imagePath;
  }

  // Получаем базовый URL для статических файлов из переменных окружения или используем значение по умолчанию
  const staticBaseUrl = process.env.NEXT_PUBLIC_STATIC_URL || 'http://localhost:3001';

  // Убираем начальный слеш из imagePath если он есть, так как мы его добавим сами
  const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${staticBaseUrl}/${cleanImagePath}`;
}; 