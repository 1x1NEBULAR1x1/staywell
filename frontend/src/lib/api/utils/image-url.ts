/**
 * Formats full URL for static images
 * @param imagePath - relative path to image (e.g.: /static/categories/image.png)
 * @returns full URL to image
 */
export const getImageUrl = (
  imagePath: string | null | undefined,
): string | undefined => {
  if (!imagePath) return undefined;

  // If path is already full URL or Next.js static files path, return as is
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("/_next/") ||
    imagePath.startsWith("data:image")
  ) {
    return imagePath;
  }

  // Get base URL for static files from environment variables or use default value
  const staticBaseUrl =
    process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:3001";

  // Remove leading slash from imagePath if present, as we'll add it ourselves
  const cleanImagePath = imagePath.startsWith("/")
    ? imagePath.slice(1)
    : imagePath;

  return `${staticBaseUrl}/${cleanImagePath}`;
};
