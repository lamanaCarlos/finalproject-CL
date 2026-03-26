import apiClient from './client';
import type { ApiResponse, PaymentIntentData, CreatePaymentIntentRequest } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const paymentApi = {
  createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<ApiResponse<PaymentIntentData>> => {
    const response = await apiClient.post<ApiResponse<PaymentIntentData>>('/payments/create-intent', data);
    validateApiResponse(response.data);
    return response.data;
  },
};

