import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
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
  FiSettings,
} from 'react-icons/fi';

export const AdminDashboardPage = () => {
  const { t } = useLanguage();

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => adminApi.getMetrics(),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers({ limit: 5 }),
  });

  const { data: artistsData, isLoading: isLoadingArtists } = useQuery({
    queryKey: ['admin', 'artists'],
    queryFn: () => adminApi.getArtists({ limit: 5, status: 'pending' }),
  });

  const metrics = metricsData?.data;
  const recentUsers = usersData?.data || [];
  const pendingArtists = artistsData?.data || [];

  const isLoading = isLoadingMetrics || isLoadingUsers || isLoadingArtists;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('dashboard.admin.title') || 'Panel de Administración'}
          </h1>
          <p className="text-gray-600">{t('dashboard.admin.subtitle') || 'Gestiona usuarios, artistas y contenido'}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card padding="lg" className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalUsers') || 'Total de Usuarios'}</p>
                <p className="text-3xl font-bold text-blue-600">{metrics?.totalUsers || 0}</p>
              </div>
              <FiUsers className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalArtists') || 'Total de Artistas'}</p>
                <p className="text-3xl font-bold text-purple-600">{metrics?.totalArtists || 0}</p>
              </div>
              <FiUser className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalArtworks') || 'Total de Obras'}</p>
                <p className="text-3xl font-bold text-green-600">{metrics?.totalArtworks || 0}</p>
              </div>
              <FiImage className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalRevenue') || 'Ingresos Totales'}</p>
                <p className="text-3xl font-bold text-yellow-600">${(metrics?.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <FiDollarSign className="w-10 h-10 text-yellow-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="lg" className="bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t('dashboard.pendingArtists') || 'Artistas Pendientes'}
                </p>
                <p className="text-3xl font-bold text-red-600">{metrics?.pendingArtists || 0}</p>
              </div>
              <FiAlertCircle className="w-10 h-10 text-red-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalOrders') || 'Total de Pedidos'}</p>
                <p className="text-3xl font-bold text-indigo-600">{metrics?.totalOrders || 0}</p>
              </div>
              <FiShoppingBag className="w-10 h-10 text-indigo-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.growth') || 'Crecimiento'}</p>
                <p className="text-3xl font-bold text-teal-600">
                  {metrics?.totalArtists && metrics?.totalUsers
                    ? ((metrics.totalArtists / metrics.totalUsers) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-teal-600 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Artists */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
                {t('dashboard.pendingArtists') || 'Artistas Pendientes'}
              </h2>
              <Link to="/admin/artists?status=pending">
                <Button variant="outline" size="sm">
                  {t('dashboard.viewAll') || 'Ver todos'}
                </Button>
              </Link>
            </div>

            {pendingArtists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('dashboard.noPendingArtists') || 'No hay artistas pendientes'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingArtists.map((artist) => {
                  const user = typeof artist.userId === 'object' ? artist.userId : null;
                  return (
                    <div
                      key={artist._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{artist.displayName}</p>
                          <p className="text-sm text-gray-600">{user?.email || 'Usuario'}</p>
                          {artist.bio && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{artist.bio}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="warning">{t('artist.pending') || 'Pendiente'}</Badge>
                          <Link to={`/admin/artists/${artist._id}`}>
                            <Button variant="outline" size="sm">
                              {t('dashboard.review') || 'Revisar'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Users */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="w-6 h-6" />
                {t('dashboard.recentUsers') || 'Usuarios Recientes'}
              </h2>
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  {t('dashboard.viewAll') || 'Ver todos'}
                </Button>
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('dashboard.noUsers') || 'No hay usuarios'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'artist' ? 'info' : 'primary'}>
                            {user.role === 'admin'
                              ? t('user.admin') || 'Admin'
                              : user.role === 'artist'
                                ? t('user.artist') || 'Artista'
                                : t('user.buyer') || 'Comprador'}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="danger">{t('user.inactive') || 'Inactivo'}</Badge>
                          )}
                        </div>
                      </div>
                      <Link to={`/admin/users/${user._id}`}>
                        <Button variant="outline" size="sm">
                          {t('dashboard.view') || 'Ver'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card padding="lg" className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiSettings className="w-6 h-6" />
            {t('dashboard.quickActions') || 'Acciones Rápidas'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/users">
              <Button variant="outline" fullWidth leftIcon={<FiUsers className="w-5 h-5" />}>
                {t('dashboard.manageUsers') || 'Gestionar Usuarios'}
              </Button>
            </Link>
            <Link to="/admin/artists">
              <Button variant="outline" fullWidth leftIcon={<FiUser className="w-5 h-5" />}>
                {t('dashboard.manageArtists') || 'Gestionar Artistas'}
              </Button>
            </Link>
            <Link to="/admin/artworks">
              <Button variant="outline" fullWidth leftIcon={<FiImage className="w-5 h-5" />}>
                {t('dashboard.manageArtworks') || 'Gestionar Obras'}
              </Button>
            </Link>
            <Link to="/admin/metrics">
              <Button variant="outline" fullWidth leftIcon={<FiTrendingUp className="w-5 h-5" />}>
                {t('dashboard.viewMetrics') || 'Ver Métricas'}
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" fullWidth leftIcon={<FiSettings className="w-5 h-5" />}>
                {t('dashboard.settings') || 'Configuración'}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
