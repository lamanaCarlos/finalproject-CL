import apiClient from './client';
import type { ApiResponse, Certificate } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const certificateApi = {
  getByOrder: async (orderId: string): Promise<ApiResponse<Certificate>> => {
    const response = await apiClient.get<ApiResponse<Certificate>>(`/certificates/order/${orderId}`);
    validateApiResponse(response.data);
    return response.data;
  },
};

