// Функция для формирования URL с параметрами запроса
export const formatQueryPath = (basePath: string, param: unknown): string => {
  if (!param) return basePath;

  // Если параметр - объект, преобразуем его в строку запроса
  if (typeof param === 'object') {
    const queryParams = Object.entries(param)
      .filter(([key, value]) => {
        // Для skip и take всегда включаем в запрос, если они числа (включая 0)
        if (key === 'skip' || key === 'take') {
          return typeof value === 'number';
        }
        // Для остальных параметров фильтруем пустые значения
        return value !== undefined && value !== '';
      })
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryParams ? `${basePath}?${queryParams}` : basePath;
  }

  // Если параметр - строка или число, добавляем как id
  return `${basePath}/${encodeURIComponent(String(param))}`;
};