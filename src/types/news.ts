export type NewsType = 'article' | 'gallery' | 'video';

export interface NewsItem {
  id: string;
  type: NewsType;
  title: string;
  date: string;
  summary: string;
  content?: string;
  coverImage?: string;
  coverImageFit?: 'cover' | 'contain';
  galleryImages?: string[];
  videoUrl?: string;
  featured?: boolean;
}
