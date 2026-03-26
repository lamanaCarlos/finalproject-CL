import type { User } from './user.types';
import type { Artwork } from './artwork.types';

export type ShippingStatus = 'pending' | 'agreed' | 'sent';
export type PaymentStatus = 'payment_pending' | 'payment_succeeded' | 'payment_failed' | 'refunded';

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
  paymentStatus?: PaymentStatus;
  paymentProvider?: string;
  providerPaymentId?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentConfirmedAt?: string | null;
  status?: string;
  shippingInfo?: {
    address?: string;
    trackingNumber?: string;
    shippingMethod?: string;
    shippingCost?: number;
  };
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
