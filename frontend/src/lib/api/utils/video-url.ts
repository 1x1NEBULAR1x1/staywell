export const getVideoUrl = (url: string): string => {
  if (url.includes('youtube') || url.includes('youtu.be')) {
    // Если уже embed ссылка, возвращаем как есть
    if (url.includes('/embed/')) {
      return url;
    }

    // Извлекаем ID видео из различных форматов YouTube ссылок
    let videoId = '';

    // Формат youtu.be/ID
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    // Формат youtube.com/watch?v=ID
    else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  } else if (url.includes('vimeo')) {
    return /^https:\/\/player\.vimeo\.com\/video\//.test(url)
      ? url
      : url.replace(
        /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([\w-]+)/,
        'https://player.vimeo.com/video/$1'
      )
  }

  return url;
};