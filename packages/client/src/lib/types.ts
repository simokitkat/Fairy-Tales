export interface TaleCard {
  slug: string;
  thumbnailUrl: string;
  title: string;
  availableLanguages: string[];
}

export interface TaleVideo {
  youtubeId: string;
  title: string;
  cleanTitle: string;
  thumbnailUrl: string;
  durationSeconds: number;
  publishedAt: string;
  channel: {
    language: string;
    title: string;
    handle: string;
  };
}

export interface TaleTranslation {
  language: string;
  title: string;
}

export interface TaleDetail {
  slug: string;
  canonicalTitle: string;
  thumbnailUrl: string;
  translations: TaleTranslation[];
  videos: TaleVideo[];
}

export interface TaleListResponse {
  data: TaleCard[];
  total: number;
}
