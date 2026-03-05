import type { User } from './user.types';

export type ArtistStatus = 'pending' | 'approved' | 'blocked';

export interface ArtistProfile {
  _id: string;
  userId: string | User;
  displayName: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    instagram?: string;
    web?: string;
  };
  status: ArtistStatus;
  createdAt: string;
  updatedAt?: string;
  stats?: {
    totalArtworks: number;
    publishedArtworks: number;
    soldArtworks: number;
  };
}

export interface CreateArtistProfileRequest {
  displayName: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    instagram?: string;
    web?: string;
  };
}

export interface UpdateArtistProfileRequest extends Partial<CreateArtistProfileRequest> {}
