import apiClient from './client';
import type { ApiResponse, Notification, PaginatedResponse } from '../../types';
import { validateApiResponse } from '../../utils/apiHelpers';

export const notificationApi = {
  getMyNotifications: async (): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications');
    validateApiResponse(response.data);
    return response.data;
  },
  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    validateApiResponse(response.data);
    return response.data;
  },
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    validateApiResponse(response.data);
    return response.data;
  },
};

