import apiClient from './client';
import type {
  ApiResponse,
  ArtistProfile,
  CreateArtistProfileRequest,
  UpdateArtistProfileRequest,
} from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const artistApi = {
  getArtistById: async (id: string): Promise<ApiResponse<ArtistProfile>> => {
    const response = await apiClient.get<ApiResponse<ArtistProfile>>(`/artists/${id}`);
    validateApiResponse(response.data);
    return response.data;
  },

  getMyProfile: async (): Promise<ApiResponse<ArtistProfile>> => {
    const response = await apiClient.get<ApiResponse<ArtistProfile>>('/artists/me/profile');
    validateApiResponse(response.data);
    return response.data;
  },

  createOrUpdateProfile: async (
    data: CreateArtistProfileRequest | UpdateArtistProfileRequest
  ): Promise<ApiResponse<ArtistProfile>> => {
    const response = await apiClient.post<ApiResponse<ArtistProfile>>('/artists/profile', data);
    validateApiResponse(response.data);
    return response.data;
  },
};
