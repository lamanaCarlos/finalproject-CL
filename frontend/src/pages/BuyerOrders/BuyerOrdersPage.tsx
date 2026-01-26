import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Image } from '../../components/common/Image';

export const BuyerOrdersPage = () => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => orderApi.getMyOrders(),
  });

  const orders = ordersData?.data || [];

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar los pedidos'}</p>
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.orders') || 'Mis Pedidos'}</h1>
          <p className="text-gray-600">{t('dashboard.ordersSubtitle') || 'Gestiona todos tus pedidos'}</p>
        </div>

        {orders.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{t('dashboard.noOrders') || 'No tienes pedidos aún'}</p>
            <Link to="/gallery">
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                {t('dashboard.exploreGallery') || 'Explorar Galería'}
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const artwork = typeof order.artworkId === 'object' ? order.artworkId : order.artwork;
              const artist = order.artist;
              const artistName = artist?.displayName || 'Artista';
              const imageUrl = artwork?.images?.[0] || '';

              return (
                <Link
                  key={order._id}
                  to={`/buyer/orders/${order._id}`}
                  className="block"
                >
                  <Card padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image */}
                      <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={artwork?.title || 'Obra'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FiPackage className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {artwork?.title || 'Obra'}
                            </h3>
                            <p className="text-gray-600">{artistName}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-primary-600 mb-2">${order.price}</p>
                            {getOrderStatusBadge(order)}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>
                              {t('order.orderDate') || 'Fecha de pedido'}:{' '}
                              {format(new Date(order.createdAt), 'dd MMM yyyy', { locale })}
                            </span>
                          </div>
                          {order.shippingRequired && (
                            <div className="flex items-center gap-2">
                              <FiPackage className="w-4 h-4" />
                              <span>{t('order.shippingRequired') || 'Requiere envío'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
