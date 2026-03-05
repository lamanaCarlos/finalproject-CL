export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ArtMarket';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  LANGUAGE: 'language',
} as const;

export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  LOGIN: '/login',
  REGISTER: '/register',
  ARTWORK_DETAIL: '/artwork/:id',
  ARTIST_PROFILE: '/artist/:id',
  ARTIST_DASHBOARD: '/artist/dashboard',
  BUYER_DASHBOARD: '/buyer/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  COMMISSION_DETAIL: '/commission/:id',
  ORDER_DETAIL: '/order/:id',
} as const;
