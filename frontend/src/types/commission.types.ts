import type { User } from './user.types';

export type CommissionStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';

export interface CommissionMessage {
  senderId: string;
  message: string;
  createdAt: string;
}

export interface CommissionRequest {
  _id: string;
  buyerId: string | User;
  artistId: string | User;
  title: string;
  description: string;
  budget: number;
  agreedPrice?: number;
  deadline: string;
  status: CommissionStatus;
  messages?: CommissionMessage[];
  createdAt: string;
  updatedAt?: string;
  artist?: {
    displayName: string;
  };
  buyer?: {
    email: string;
  };
}

export interface CreateCommissionRequest {
  artistId: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export interface UpdateCommissionRequest {
  status?: CommissionStatus;
  agreedPrice?: number;
}

export interface AddCommissionMessageRequest {
  message: string;
}
