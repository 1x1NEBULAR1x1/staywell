export const handleShare = ({ title, text, url }: { title: string, text: string | null, url: string }) => {
  if (navigator.share) {
    navigator.share({ title, text: text || '', url });
  } else {
    navigator.clipboard.writeText(url);
  }
};