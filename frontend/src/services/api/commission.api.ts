import apiClient from './client';
import type {
  ApiResponse,
  CommissionRequest,
  CreateCommissionRequest,
  UpdateCommissionRequest,
  AddCommissionMessageRequest,
} from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const commissionApi = {
  createCommission: async (data: CreateCommissionRequest): Promise<ApiResponse<CommissionRequest>> => {
    const response = await apiClient.post<ApiResponse<CommissionRequest>>('/commissions', data);
    validateApiResponse(response.data);
    return response.data;
  },

  getMyCommissions: async (): Promise<ApiResponse<CommissionRequest[]>> => {
    const response = await apiClient.get<ApiResponse<CommissionRequest[]>>('/commissions/my');
    validateApiResponse(response.data);
    return response.data;
  },

  getCommissionById: async (id: string): Promise<ApiResponse<CommissionRequest>> => {
    const response = await apiClient.get<ApiResponse<CommissionRequest>>(`/commissions/${id}`);
    validateApiResponse(response.data);
    return response.data;
  },

  updateCommission: async (id: string, data: UpdateCommissionRequest): Promise<ApiResponse<CommissionRequest>> => {
    const response = await apiClient.patch<ApiResponse<CommissionRequest>>(`/commissions/${id}`, data);
    validateApiResponse(response.data);
    return response.data;
  },

  addMessage: async (id: string, data: AddCommissionMessageRequest): Promise<ApiResponse<CommissionRequest>> => {
    const response = await apiClient.post<ApiResponse<CommissionRequest>>(`/commissions/${id}/messages`, data);
    validateApiResponse(response.data);
    return response.data;
  },
};
