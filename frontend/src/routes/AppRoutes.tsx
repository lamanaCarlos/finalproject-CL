import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Login';
import { RegisterPage } from '../pages/Register';
import { GalleryPage } from '../pages/Gallery';
import { ArtworkDetailPage } from '../pages/ArtworkDetail';
import { ArtistProfilePage } from '../pages/ArtistProfile';
import { BuyerDashboardPage } from '../pages/BuyerDashboard';
import { BuyerOrdersPage, BuyerOrderDetailPage } from '../pages/BuyerOrders';
import { BuyerCommissionsPage, BuyerCommissionDetailPage } from '../pages/BuyerCommissions';
import { ArtistDashboardPage } from '../pages/ArtistDashboard';
import { ArtistArtworksPage, ArtistCreateArtworkPage, ArtistEditArtworkPage } from '../pages/ArtistArtworks';
import { ArtistOrdersPage, ArtistOrderDetailPage } from '../pages/ArtistOrders';
import { ArtistCommissionsPage, ArtistCommissionDetailPage } from '../pages/ArtistCommissions';
import { ArtistProfileEditPage } from '../pages/ArtistProfile';
import { AdminDashboardPage } from '../pages/AdminDashboard';
import { AdminUsersPage, AdminUserDetailPage } from '../pages/AdminUsers';
import { AdminArtistsPage, AdminArtistDetailPage } from '../pages/AdminArtists';
import { AdminArtworksPage } from '../pages/AdminArtworks';
import { AdminMetricsPage } from '../pages/AdminMetrics';
import { AdminSettingsPage } from '../pages/AdminSettings';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            return false;
          }
        }
        return failureCount < 1;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Global error handler for React Query
// Note: In React Query v5, onError in defaultOptions is not available
// Errors should be handled at component level or using mutation callbacks

export const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          <Route path="/artist/:id" element={<ArtistProfilePage />} />

          {/* Auth Routes (Public but redirect if authenticated) */}
          <Route element={<PublicRoute redirectTo="/" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes - Buyer */}
          <Route element={<ProtectedRoute />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
            <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
            <Route path="/buyer/orders/:id" element={<BuyerOrderDetailPage />} />
            <Route path="/buyer/commissions" element={<BuyerCommissionsPage />} />
            <Route path="/buyer/commissions/:id" element={<BuyerCommissionDetailPage />} />
          </Route>

          {/* Protected Routes - Artist */}
          <Route element={<ProtectedRoute allowedRoles={['artist']} />}>
            <Route path="/artist/dashboard" element={<ArtistDashboardPage />} />
            <Route path="/artist/artworks" element={<ArtistArtworksPage />} />
            <Route path="/artist/artworks/new" element={<ArtistCreateArtworkPage />} />
            <Route path="/artist/artworks/:id/edit" element={<ArtistEditArtworkPage />} />
            <Route path="/artist/orders" element={<ArtistOrdersPage />} />
            <Route path="/artist/orders/:id" element={<ArtistOrderDetailPage />} />
            <Route path="/artist/commissions" element={<ArtistCommissionsPage />} />
            <Route path="/artist/commissions/:id" element={<ArtistCommissionDetailPage />} />
            <Route path="/artist/profile" element={<ArtistProfileEditPage />} />
          </Route>

          {/* Protected Routes - Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            <Route path="/admin/artists" element={<AdminArtistsPage />} />
            <Route path="/admin/artists/:id" element={<AdminArtistDetailPage />} />
            <Route path="/admin/artworks" element={<AdminArtworksPage />} />
            <Route path="/admin/metrics" element={<AdminMetricsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
