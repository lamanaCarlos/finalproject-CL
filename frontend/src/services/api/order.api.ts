import apiClient from './client';
import type { ApiResponse, Order, CreateOrderRequest, UpdateShippingRequest } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const orderApi = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    validateApiResponse(response.data);
    return response.data;
  },

  getMyOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my');
    validateApiResponse(response.data);
    return response.data;
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    validateApiResponse(response.data);
    return response.data;
  },

  updateShipping: async (id: string, data: UpdateShippingRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/shipping`, data);
    validateApiResponse(response.data);
    return response.data;
  },
};
