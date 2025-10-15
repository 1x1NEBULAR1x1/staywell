/**
 * Converts kebab-case string to readable title with uppercase letters
 * @param kebabString - string in kebab-case format (for example: "apartment-amenities")
 * @returns formatted string (for example: "Apartment Amenities")
 */
export const formatToTitle = (kebabString: string): string => {
  return kebabString
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
