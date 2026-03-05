import apiClient from './client';
import type { ApiResponse, User, ArtistProfile, Artwork, PaginatedResponse } from '../../types';
import { validateApiResponse, validatePaginatedResponse } from '../../utils/apiHelpers';

export interface AdminMetrics {
  totalUsers: number;
  totalArtists: number;
  totalArtworks: number;
  totalOrders: number;
  totalRevenue: number;
  pendingArtists: number;
}

export interface AdminSettings {
  commissionRate: number;
  minCommission: number;
}

export const adminApi = {
  getUsers: async (filters?: { page?: number; limit?: number; role?: string }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params: filters });
    validatePaginatedResponse(response.data);
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/status`, { isActive });
    validateApiResponse(response.data);
    return response.data;
  },

  getArtists: async (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ArtistProfile>> => {
    const response = await apiClient.get<PaginatedResponse<ArtistProfile>>('/admin/artists', { params: filters });
    validatePaginatedResponse(response.data);
    return response.data;
  },

  updateArtistStatus: async (id: string, status: 'approved' | 'blocked'): Promise<ApiResponse<ArtistProfile>> => {
    const response = await apiClient.patch<ApiResponse<ArtistProfile>>(`/admin/artists/${id}/status`, { status });
    validateApiResponse(response.data);
    return response.data;
  },

  getArtworks: async (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Artwork>> => {
    const response = await apiClient.get<PaginatedResponse<Artwork>>('/admin/artworks', { params: filters });
    validatePaginatedResponse(response.data);
    return response.data;
  },

  updateArtworkStatus: async (id: string, status: string): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.patch<ApiResponse<Artwork>>(`/admin/artworks/${id}/status`, { status });
    validateApiResponse(response.data);
    return response.data;
  },

  getMetrics: async (): Promise<ApiResponse<AdminMetrics>> => {
    const response = await apiClient.get<ApiResponse<AdminMetrics>>('/admin/metrics');
    validateApiResponse(response.data);
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<AdminSettings>> => {
    const response = await apiClient.get<ApiResponse<AdminSettings>>('/admin/settings');
    validateApiResponse(response.data);
    return response.data;
  },

  updateSettings: async (data: Partial<AdminSettings>): Promise<ApiResponse<AdminSettings>> => {
    const response = await apiClient.patch<ApiResponse<AdminSettings>>('/admin/settings', data);
    validateApiResponse(response.data);
    return response.data;
  },
};
