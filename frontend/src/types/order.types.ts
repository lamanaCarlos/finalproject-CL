import type { User } from './user.types';
import type { Artwork } from './artwork.types';

export type ShippingStatus = 'pending' | 'agreed' | 'sent';

export interface Order {
  _id: string;
  buyerId: string | User;
  artworkId: string | Artwork;
  artistId: string | User;
  price: number;
  commission: number;
  artistEarnings: number;
  shippingRequired: boolean;
  shippingStatus?: ShippingStatus;
  shippingInfo?: {
    address?: string;
    trackingNumber?: string;
    shippingMethod?: string;
    shippingCost?: number;
  };
  status: string;
  createdAt: string;
  updatedAt?: string;
  artwork?: {
    _id: string;
    title: string;
    images: string[];
  };
  artist?: {
    displayName: string;
  };
}

export interface CreateOrderRequest {
  artworkId: string;
}

export interface UpdateShippingRequest {
  shippingStatus: ShippingStatus;
  shippingInfo?: {
    address?: string;
    trackingNumber?: string;
    shippingMethod?: string;
    shippingCost?: number;
  };
}
