import apiClient from './client';
import type {
  ApiResponse,
  Artwork,
  ArtworkFilters,
  CreateArtworkRequest,
  UpdateArtworkRequest,
  PaginatedResponse,
} from '../../types';
import { validateApiResponse, validatePaginatedResponse } from '../../utils/apiHelpers';

export const artworkApi = {
  getArtworks: async (filters?: ArtworkFilters): Promise<PaginatedResponse<Artwork>> => {
    const response = await apiClient.get<PaginatedResponse<Artwork>>('/artworks', { params: filters });
    validatePaginatedResponse(response.data);
    return response.data;
  },

  getArtworkById: async (id: string): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.get<ApiResponse<Artwork>>(`/artworks/${id}`);
    validateApiResponse(response.data);
    return response.data;
  },

  createArtwork: async (data: CreateArtworkRequest): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.post<ApiResponse<Artwork>>('/artworks', data);
    validateApiResponse(response.data);
    return response.data;
  },

  updateArtwork: async (id: string, data: UpdateArtworkRequest): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.put<ApiResponse<Artwork>>(`/artworks/${id}`, data);
    validateApiResponse(response.data);
    return response.data;
  },

  publishArtwork: async (id: string): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.patch<ApiResponse<Artwork>>(`/artworks/${id}/publish`);
    validateApiResponse(response.data);
    return response.data;
  },

  unpublishArtwork: async (id: string): Promise<ApiResponse<Artwork>> => {
    const response = await apiClient.patch<ApiResponse<Artwork>>(`/artworks/${id}/unpublish`);
    validateApiResponse(response.data);
    return response.data;
  },

  getMyArtworks: async (): Promise<ApiResponse<Artwork[]>> => {
    const response = await apiClient.get<ApiResponse<Artwork[]>>('/artworks/my/list');
    validateApiResponse(response.data);
    return response.data;
  },
};
