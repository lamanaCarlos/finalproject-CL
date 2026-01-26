import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUser,
  FiImage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from 'react-icons/fi';

export const AdminMetricsPage = () => {
  const { t } = useLanguage();

  const { data: metricsData, isLoading, error } = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => adminApi.getMetrics(),
  });

  const metrics = metricsData?.data;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !metrics) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar las métricas'}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-600 hover:underline"
            >
              {t('common.retry') || 'Reintentar'}
            </button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const growthRate = metrics.totalUsers > 0
    ? ((metrics.totalArtists / metrics.totalUsers) * 100).toFixed(1)
    : '0';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.metrics') || 'Métricas'}</h1>
          <p className="text-gray-600">{t('admin.metricsSubtitle') || 'Métricas detalladas del sistema'}</p>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card padding="lg" className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalUsers') || 'Total de Usuarios'}</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.totalUsers}</p>
              </div>
              <FiUsers className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalArtists') || 'Total de Artistas'}</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.totalArtists}</p>
              </div>
              <FiUser className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalArtworks') || 'Total de Obras'}</p>
                <p className="text-3xl font-bold text-green-600">{metrics.totalArtworks}</p>
              </div>
              <FiImage className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalRevenue') || 'Ingresos Totales'}</p>
                <p className="text-3xl font-bold text-yellow-600">${metrics.totalRevenue.toFixed(2)}</p>
              </div>
              <FiDollarSign className="w-10 h-10 text-yellow-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="lg" className="bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t('dashboard.pendingArtists') || 'Artistas Pendientes'}
                </p>
                <p className="text-3xl font-bold text-red-600">{metrics.pendingArtists}</p>
              </div>
              <FiAlertCircle className="w-10 h-10 text-red-600 opacity-50" />
            </div>
            {metrics.pendingArtists > 0 && (
              <Link to="/admin/artists?status=pending" className="mt-4 block">
                <button className="text-sm text-red-600 hover:underline">
                  {t('admin.reviewPending') || 'Revisar pendientes →'}
                </button>
              </Link>
            )}
          </Card>

          <Card padding="lg" className="bg-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalOrders') || 'Total de Pedidos'}</p>
                <p className="text-3xl font-bold text-indigo-600">{metrics.totalOrders}</p>
              </div>
              <FiShoppingBag className="w-10 h-10 text-indigo-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.growth') || 'Crecimiento'}</p>
                <p className="text-3xl font-bold text-teal-600">{growthRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.artistToUserRatio') || 'Ratio Artistas/Usuarios'}
                </p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-teal-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.quickLinks') || 'Enlaces Rápidos'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/users">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <p className="font-medium text-gray-900">{t('dashboard.manageUsers') || 'Gestionar Usuarios'}</p>
                <p className="text-sm text-gray-600 mt-1">{t('admin.viewAllUsers') || 'Ver todos los usuarios'}</p>
              </button>
            </Link>
            <Link to="/admin/artists">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <p className="font-medium text-gray-900">{t('dashboard.manageArtists') || 'Gestionar Artistas'}</p>
                <p className="text-sm text-gray-600 mt-1">{t('admin.viewAllArtists') || 'Ver todos los artistas'}</p>
              </button>
            </Link>
            <Link to="/admin/artworks">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <p className="font-medium text-gray-900">{t('dashboard.manageArtworks') || 'Gestionar Obras'}</p>
                <p className="text-sm text-gray-600 mt-1">{t('admin.viewAllArtworks') || 'Ver todas las obras'}</p>
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
