import { useQuery } from '@tanstack/react-query';
import { artworkApi, orderApi, commissionApi, artistApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiImage, FiDollarSign, FiPackage, FiFileText, FiTrendingUp, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const ArtistDashboardPage = () => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const { data: artworksData, isLoading: isLoadingArtworks } = useQuery({
    queryKey: ['artworks', 'my'],
    queryFn: () => artworkApi.getMyArtworks(),
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => orderApi.getMyOrders(),
  });

  const { data: commissionsData, isLoading: isLoadingCommissions } = useQuery({
    queryKey: ['commissions', 'my'],
    queryFn: () => commissionApi.getMyCommissions(),
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['artist', 'profile', 'me'],
    queryFn: () => artistApi.getMyProfile(),
  });

  const artworks = artworksData?.data || [];
  const orders = ordersData?.data || [];
  const commissions = commissionsData?.data || [];
  const profile = profileData?.data;

  // Calculate statistics
  const totalArtworks = artworks.length;
  const publishedArtworks = artworks.filter((a) => a.status === 'published').length;
  const soldArtworks = artworks.filter((a) => a.status === 'sold').length;
  const totalEarnings = orders.reduce((sum, order) => sum + (order.artistEarnings || 0), 0);
  const pendingCommissions = commissions.filter((c) => c.status === 'pending').length;
  const activeCommissions = commissions.filter((c) => ['pending', 'accepted', 'in_progress'].includes(c.status)).length;

  const isLoading = isLoadingArtworks || isLoadingOrders || isLoadingCommissions || isLoadingProfile;

  const getOrderStatusBadge = (order: typeof orders[0]) => {
    if (order.shippingRequired && order.shippingStatus) {
      switch (order.shippingStatus) {
        case 'pending':
          return <Badge variant="warning">{t('order.shippingPending') || 'Envío pendiente'}</Badge>;
        case 'agreed':
          return <Badge variant="info">{t('order.shippingAgreed') || 'Envío acordado'}</Badge>;
        case 'sent':
          return <Badge variant="success">{t('order.shippingSent') || 'Enviado'}</Badge>;
        default:
          return <Badge variant="success">{t('order.completed') || 'Completado'}</Badge>;
      }
    }
    return <Badge variant="success">{t('order.completed') || 'Completado'}</Badge>;
  };

  const getCommissionStatusBadge = (commission: typeof commissions[0]) => {
    switch (commission.status) {
      case 'pending':
        return <Badge variant="warning">{t('commission.pending') || 'Pendiente'}</Badge>;
      case 'accepted':
        return <Badge variant="success">{t('commission.accepted') || 'Aceptado'}</Badge>;
      case 'rejected':
        return <Badge variant="danger">{t('commission.rejected') || 'Rechazado'}</Badge>;
      case 'in_progress':
        return <Badge variant="info">{t('commission.inProgress') || 'En progreso'}</Badge>;
      case 'completed':
        return <Badge variant="success">{t('commission.completed') || 'Completado'}</Badge>;
      case 'cancelled':
        return <Badge variant="danger">{t('commission.cancelled') || 'Cancelado'}</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const profileStatus = profile?.status;
  const isProfileApproved = profileStatus === 'approved';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {t('dashboard.artist.title') || 'Panel de Artista'}
              </h1>
              <p className="text-gray-600">{t('dashboard.artist.subtitle') || 'Gestiona tus obras y ventas'}</p>
            </div>
            {!isProfileApproved && profileStatus === 'pending' && (
              <Card padding="md" className="bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    {t('dashboard.artist.profilePending') || 'Tu perfil está pendiente de aprobación'}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card padding="lg" className="bg-primary-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalArtworks') || 'Total de Obras'}</p>
                <p className="text-3xl font-bold text-primary-600">{totalArtworks}</p>
              </div>
              <FiImage className="w-10 h-10 text-primary-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.publishedArtworks') || 'Publicadas'}</p>
                <p className="text-3xl font-bold text-green-600">{publishedArtworks}</p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.soldArtworks') || 'Vendidas'}</p>
                <p className="text-3xl font-bold text-blue-600">{soldArtworks}</p>
              </div>
              <FiPackage className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalEarnings') || 'Ganancias Totales'}</p>
                <p className="text-3xl font-bold text-purple-600">${totalEarnings.toFixed(2)}</p>
              </div>
              <FiDollarSign className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card padding="lg" className="bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t('dashboard.pendingCommissions') || 'Encargos Pendientes'}
                </p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCommissions}</p>
              </div>
              <FiFileText className="w-10 h-10 text-yellow-600 opacity-50" />
            </div>
          </Card>

          <Card padding="lg" className="bg-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.activeCommissions') || 'Encargos Activos'}</p>
                <p className="text-3xl font-bold text-indigo-600">{activeCommissions}</p>
              </div>
              <FiFileText className="w-10 h-10 text-indigo-600 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiPackage className="w-6 h-6" />
                {t('dashboard.recentOrders') || 'Pedidos Recientes'}
              </h2>
              <Link to="/artist/orders">
                <Button variant="outline" size="sm">
                  {t('dashboard.viewAll') || 'Ver todos'}
                </Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('dashboard.noOrders') || 'No tienes pedidos aún'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => {
                  const artwork = typeof order.artworkId === 'object' ? order.artworkId : order.artwork;
                  const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;
                  return (
                    <Link
                      key={order._id}
                      to={`/artist/orders/${order._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{artwork?.title || 'Obra'}</p>
                          <p className="text-sm text-gray-600">{buyer?.email || 'Comprador'}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(order.createdAt), 'dd MMM yyyy', { locale })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">${order.artistEarnings || order.price}</p>
                          {getOrderStatusBadge(order)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Commissions */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="w-6 h-6" />
                {t('dashboard.recentCommissions') || 'Encargos Recientes'}
              </h2>
              <Link to="/artist/commissions">
                <Button variant="outline" size="sm">
                  {t('dashboard.viewAll') || 'Ver todos'}
                </Button>
              </Link>
            </div>

            {commissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('dashboard.noCommissions') || 'No tienes encargos aún'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {commissions.slice(0, 5).map((commission) => {
                  const buyer = typeof commission.buyerId === 'object' ? commission.buyerId : commission.buyer;
                  return (
                    <Link
                      key={commission._id}
                      to={`/artist/commissions/${commission._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{commission.title}</p>
                          <p className="text-sm text-gray-600">{buyer?.email || 'Comprador'}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(commission.createdAt), 'dd MMM yyyy', { locale })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            ${commission.agreedPrice || commission.budget}
                          </p>
                          {getCommissionStatusBadge(commission)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* My Artworks */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiImage className="w-6 h-6" />
              {t('dashboard.myArtworks') || 'Mis Obras'}
            </h2>
            <div className="flex gap-2">
              <Link to="/artist/artworks">
                <Button variant="outline" size="sm">{t('dashboard.viewAll') || 'Ver todos'}</Button>
              </Link>
              <Link to="/artist/artworks/new">
                <Button variant="primary" size="sm">{t('dashboard.createArtwork') || 'Crear Obra'}</Button>
              </Link>
            </div>
          </div>

          {artworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{t('dashboard.noArtworks') || 'No tienes obras aún'}</p>
              <Link to="/artist/artworks/new">
                <Button variant="primary">{t('dashboard.createFirstArtwork') || 'Crear tu primera obra'}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.slice(0, 8).map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
