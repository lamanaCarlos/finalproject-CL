import type { ArtistProfile } from './artist.types';

export type ArtworkType = 'digital' | 'physical';
export type ArtworkStatus = 'draft' | 'published' | 'sold';
export type ArtworkLanguage = 'es' | 'en';

export interface Artwork {
  _id: string;
  artistId: string | ArtistProfile;
  title: string;
  description: string;
  type: ArtworkType;
  price: number;
  images: string[];
  technique?: string;
  dimensions?: string; // For physical artworks
  weight?: number; // For physical artworks
  digitalFormat?: string; // For digital artworks
  resolution?: string; // For digital artworks
  language: ArtworkLanguage;
  status: ArtworkStatus;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  artist?: {
    _id: string;
    displayName: string;
    profileImage?: string;
  };
}

export interface ArtworkFilters {
  page?: number;
  limit?: number;
  artistId?: string;
  type?: ArtworkType;
  minPrice?: number;
  maxPrice?: number;
  language?: ArtworkLanguage;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | '1' | '-1';
}

export interface CreateArtworkRequest {
  title: string;
  description: string;
  type: ArtworkType;
  price: number;
  images: string[];
  technique?: string;
  dimensions?: string;
  weight?: number;
  digitalFormat?: string;
  resolution?: string;
  language?: ArtworkLanguage;
}

export interface UpdateArtworkRequest extends Partial<CreateArtworkRequest> {}
