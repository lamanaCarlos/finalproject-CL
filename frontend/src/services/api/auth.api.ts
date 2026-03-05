import apiClient from './client';
import type { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, User } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    validateApiResponse(response.data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
    validateApiResponse(response.data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    validateApiResponse(response.data);
    return response.data;
  },
};
