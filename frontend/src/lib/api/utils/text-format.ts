/**
 * Преобразует kebab-case строку в читаемый заголовок с заглавными буквами
 * @param kebabString - строка в kebab-case формате (например: "apartment-amenities")
 * @returns отформатированная строка (например: "Apartment Amenities")
 */
export const formatToTitle = (kebabString: string): string => {
  return kebabString
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
