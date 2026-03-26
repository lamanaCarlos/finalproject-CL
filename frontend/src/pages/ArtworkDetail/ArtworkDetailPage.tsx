import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworkApi, orderApi, paymentApi, reviewApi } from '../../services/api';
import { Layout } from '../../components/layout';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Image } from '../../components/common/Image';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { FiArrowLeft, FiDollarSign, FiCalendar, FiUser, FiImage, FiPackage, FiMonitor } from 'react-icons/fi';
import toast from 'react-hot-toast';
import artworkPlaceholder from '../../assets/images/artwork-placeholder.svg';
import type { AxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
};

export const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locale = language === 'es' ? es : enUS;

  const { data, isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => artworkApi.getArtworkById(id!),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (artworkId: string) => {
      const orderResponse = await orderApi.createOrder({ artworkId });
      const orderId = orderResponse.data?._id;
      if (!orderId) {
        throw new Error('No se pudo crear la orden');
      }
      await paymentApi.createPaymentIntent({ orderId });
      return orderResponse;
    },
    onSuccess: (response) => {
      toast.success(t('order.purchaseSuccess') || 'Pedido creado. Continúa con el pago.');
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['artwork', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      // Redirigir al detalle del pedido
      if (response.data?._id) {
        navigate(`/buyer/orders/${response.data._id}`);
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError?.response?.data?.message || t('order.purchaseError') || 'Error al realizar la compra';
      toast.error(errorMessage);
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['artwork-reviews', id],
    queryFn: () => reviewApi.getArtworkReviews(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data?.data) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <p className="text-red-600 mb-4">{t('artwork.errorLoading') || 'Error al cargar la obra'}</p>
            <Button onClick={() => navigate('/gallery')}>{t('common.back') || 'Volver a la galería'}</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const artwork = data.data;
  const artist = typeof artwork.artist === 'object' ? artwork.artist : null;
  const artistId = typeof artwork.artistId === 'string' ? artwork.artistId : artwork.artistId?._id || '';
  const mainImage = artwork.images && artwork.images.length > 0 ? artwork.images[0] : artworkPlaceholder;
  const otherImages = artwork.images?.slice(1) || [];
  const reviews = reviewsData?.data || [];

  const getStatusBadge = () => {
    switch (artwork.status) {
      case 'published':
        return <Badge variant="success">{t('artwork.published') || 'Publicado'}</Badge>;
      case 'draft':
        return <Badge variant="warning">{t('artwork.draft') || 'Borrador'}</Badge>;
      case 'sold':
        return <Badge variant="danger">{t('artwork.sold') || 'Vendido'}</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    return artwork.type === 'digital' ? (
      <Badge variant="info">{t('artwork.digital') || 'Digital'}</Badge>
    ) : (
      <Badge variant="primary">{t('artwork.physical') || 'Físico'}</Badge>
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error(t('artwork.loginRequired') || 'Debes iniciar sesión para comprar');
      navigate('/login', { state: { from: `/artwork/${id}` } });
      return;
    }

    // Verificar que el usuario es comprador
    if (user?.role !== 'buyer' && user?.role !== 'admin') {
      toast.error(t('order.buyerOnly') || 'Solo los compradores pueden realizar compras');
      return;
    }

    // Verificar que la obra está disponible
    if (artwork.status !== 'published') {
      toast.error(t('artwork.notAvailable') || 'Esta obra no está disponible para la venta');
      return;
    }

    // Confirmar compra
    if (window.confirm(t('order.confirmPurchase') || `¿Confirmar compra de "${artwork.title}" por $${artwork.price}?`)) {
      purchaseMutation.mutate(artwork._id);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
          leftIcon={<FiArrowLeft className="w-4 h-4" />}
        >
          {t('common.back') || 'Volver'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card padding="none" className="overflow-hidden">
              <Image
                src={mainImage}
                alt={artwork.title}
                aspectRatio="square"
                objectFit="cover"
                className="w-full"
              />
            </Card>

            {/* Other Images */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((image, index) => (
                  <Card key={index} padding="none" className="overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <Image
                      src={image}
                      alt={`${artwork.title} ${index + 2}`}
                      aspectRatio="square"
                      objectFit="cover"
                      className="w-full"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{artwork.title}</h1>
                <div className="flex gap-2">
                  {getStatusBadge()}
                  {getTypeBadge()}
                </div>
              </div>

              {/* Artist Link */}
              {artist && (
                <Link
                  to={`/artist/${artistId}`}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-4"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">{artist.displayName}</span>
                </Link>
              )}
            </div>

            {/* Price */}
            <Card padding="lg" className="bg-primary-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('artwork.price') || 'Precio'}</p>
                  <p className="text-4xl font-bold text-primary-600">${artwork.price}</p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={artwork.status !== 'published' || purchaseMutation.isPending || !isAuthenticated}
                  leftIcon={<FiDollarSign className="w-5 h-5" />}
                >
                  {purchaseMutation.isPending
                    ? t('order.processing') || 'Procesando...'
                    : artwork.status === 'sold'
                    ? t('artwork.sold') || 'Vendido'
                    : !isAuthenticated
                    ? t('artwork.loginToBuy') || 'Inicia sesión para comprar'
                    : t('common.buyNow') || 'Comprar ahora'}
                </Button>
              </div>
            </Card>

            {/* Description */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('artwork.description') || 'Descripción'}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </Card>

            {/* Details */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('artwork.details') || 'Detalles'}</h2>
              <div className="space-y-3">
                {artwork.technique && (
                  <div className="flex items-center gap-3">
                    <FiImage className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t('artwork.technique') || 'Técnica'}</p>
                      <p className="text-gray-900">{artwork.technique}</p>
                    </div>
                  </div>
                )}

                {artwork.type === 'physical' && (
                  <>
                    {artwork.dimensions && (
                      <div className="flex items-center gap-3">
                        <FiPackage className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('artwork.dimensions') || 'Dimensiones'}</p>
                          <p className="text-gray-900">{artwork.dimensions}</p>
                        </div>
                      </div>
                    )}
                    {artwork.weight && (
                      <div className="flex items-center gap-3">
                        <FiPackage className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('artwork.weight') || 'Peso'}</p>
                          <p className="text-gray-900">{artwork.weight} kg</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {artwork.type === 'digital' && (
                  <>
                    {artwork.digitalFormat && (
                      <div className="flex items-center gap-3">
                        <FiMonitor className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('artwork.format') || 'Formato'}</p>
                          <p className="text-gray-900">{artwork.digitalFormat}</p>
                        </div>
                      </div>
                    )}
                    {artwork.resolution && (
                      <div className="flex items-center gap-3">
                        <FiMonitor className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('artwork.resolution') || 'Resolución'}</p>
                          <p className="text-gray-900">{artwork.resolution}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('artwork.createdAt') || 'Fecha de creación'}</p>
                    <p className="text-gray-900">
                      {format(new Date(artwork.createdAt), 'dd MMMM yyyy', { locale })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('artwork.reviews') || 'Reseñas'}</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-600">{t('artwork.noReviews') || 'Aún no hay reseñas para esta obra.'}</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment || '-'}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
