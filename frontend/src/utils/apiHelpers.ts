import type { ApiResponse, PaginatedResponse } from '../types';

/**
 * Validates API response and throws error if not successful
 */
export function validateApiResponse<T>(response: ApiResponse<T> | PaginatedResponse<T>): asserts response is ApiResponse<T> & { success: true; data: T } {
  if (!response.success) {
    const errorMessage = response.message || 'Error en la solicitud';
    const errors = 'errors' in response ? response.errors : undefined;
    throw new Error(errors ? `${errorMessage}: ${errors.map(e => e.message).join(', ')}` : errorMessage);
  }
  
  if (!response.data) {
    throw new Error('La respuesta no contiene datos');
  }
}

/**
 * Validates paginated API response
 */
export function validatePaginatedResponse<T>(response: PaginatedResponse<T>): asserts response is PaginatedResponse<T> & { success: true; data: T[] } {
  validateApiResponse(response);
  
  if (!Array.isArray(response.data)) {
    throw new Error('La respuesta paginada no contiene un array de datos');
  }
}
