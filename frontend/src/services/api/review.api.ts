import apiClient from './client';
import type { ApiResponse, PaginatedResponse, Review, CreateReviewRequest } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const reviewApi = {
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    validateApiResponse(response.data);
    return response.data;
  },
  getArtworkReviews: async (artworkId: string): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(`/reviews/artworks/${artworkId}`);
    validateApiResponse(response.data);
    return response.data;
  },
  getArtistReviews: async (artistId: string): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(`/reviews/artists/${artistId}`);
    validateApiResponse(response.data);
    return response.data;
  },
};

