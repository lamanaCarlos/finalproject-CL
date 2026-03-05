import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Image } from '../../components/common/Image';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiPackage, FiMapPin, FiUser, FiSave } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';
import type { UpdateShippingRequest } from '../../types';

const shippingSchema = z.object({
  shippingStatus: z.enum(['pending', 'agreed', 'sent']),
  address: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingMethod: z.string().optional(),
  shippingCost: z.number().min(0).optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export const ArtistOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const locale = language === 'es' ? es : enUS;
  const [showShippingForm, setShowShippingForm] = useState(false);

  const { data: orderData, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrderById(id!),
    enabled: !!id,
  });

  const order = orderData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingStatus: order?.shippingStatus || 'pending',
      address: order?.shippingInfo?.address || '',
      trackingNumber: order?.shippingInfo?.trackingNumber || '',
      shippingMethod: order?.shippingInfo?.shippingMethod || '',
      shippingCost: order?.shippingInfo?.shippingCost || undefined,
    },
  });

  // Reset form when order loads
  if (order && order.shippingRequired) {
    reset({
      shippingStatus: order.shippingStatus || 'pending',
      address: order.shippingInfo?.address || '',
      trackingNumber: order.shippingInfo?.trackingNumber || '',
      shippingMethod: order.shippingInfo?.shippingMethod || '',
      shippingCost: order.shippingInfo?.shippingCost || undefined,
    });
  }

  const updateShippingMutation = useMutation({
    mutationFn: (data: UpdateShippingRequest) => orderApi.updateShipping(id!, data),
    onSuccess: () => {
      toast.success(t('order.shippingUpdated') || 'Información de envío actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowShippingForm(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('order.shippingError') || 'Error al actualizar el envío';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    const shippingData: UpdateShippingRequest = {
      shippingStatus: data.shippingStatus,
      shippingInfo: {
        address: data.address || undefined,
        trackingNumber: data.trackingNumber || undefined,
        shippingMethod: data.shippingMethod || undefined,
        shippingCost: data.shippingCost || undefined,
      },
    };
    updateShippingMutation.mutate(shippingData);
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

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar el pedido'}</p>
            <Link to="/artist/orders">
              <Button variant="primary">{t('common.back') || 'Volver'}</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const artwork = typeof order.artworkId === 'object' ? order.artworkId : order.artwork;
  const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;

  const getOrderStatusBadge = () => {
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/artist/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver a pedidos'}</span>
        </Link>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artwork Info */}
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('order.artworkInfo') || 'Información de la Obra'}</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {artwork?.images?.[0] ? (
                    <Image
                      src={artwork.images[0]}
                      alt={artwork.title || 'Obra'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiPackage className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{artwork?.title || 'Obra'}</h3>
                </div>
              </div>
            </Card>

            {/* Buyer Info */}
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-6 h-6" />
                {t('order.buyerInfo') || 'Información del Comprador'}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">{t('order.buyerEmail') || 'Email'}:</span> {buyer?.email || 'N/A'}
                </p>
              </div>
            </Card>

            {/* Shipping Info */}
            {order.shippingRequired && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{t('order.shippingInfo') || 'Información de Envío'}</h2>
                  {!showShippingForm && (
                    <Button variant="outline" size="sm" onClick={() => setShowShippingForm(true)}>
                      {t('order.updateShipping') || 'Actualizar Envío'}
                    </Button>
                  )}
                </div>

                {showShippingForm ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Select
                      label={t('order.shippingStatus') || 'Estado de envío'}
                      {...register('shippingStatus')}
                      error={errors.shippingStatus?.message}
                      options={[
                        { value: 'pending', label: t('order.shippingPending') || 'Envío pendiente' },
                        { value: 'agreed', label: t('order.shippingAgreed') || 'Envío acordado' },
                        { value: 'sent', label: t('order.shippingSent') || 'Enviado' },
                      ]}
                    />

                    <Input
                      label={t('order.shippingAddress') || 'Dirección de envío'}
                      {...register('address')}
                      error={errors.address?.message}
                      placeholder="Calle, número, ciudad, código postal"
                    />

                    <Input
                      label={t('order.trackingNumber') || 'Número de seguimiento'}
                      {...register('trackingNumber')}
                      error={errors.trackingNumber?.message}
                      placeholder="ABC123456789"
                    />

                    <Input
                      label={t('order.shippingMethod') || 'Método de envío'}
                      {...register('shippingMethod')}
                      error={errors.shippingMethod?.message}
                      placeholder="Correos, DHL, FedEx, etc."
                    />

                    <Input
                      type="number"
                      label={t('order.shippingCost') || 'Costo de envío'}
                      {...register('shippingCost', { valueAsNumber: true })}
                      error={errors.shippingCost?.message}
                      placeholder="0.00"
                      step="0.01"
                    />

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || updateShippingMutation.isPending}
                        leftIcon={<FiSave className="w-4 h-4" />}
                      >
                        {isSubmitting || updateShippingMutation.isPending
                          ? t('common.saving') || 'Guardando...'
                          : t('common.save') || 'Guardar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowShippingForm(false);
                          reset();
                        }}
                      >
                        {t('common.cancel') || 'Cancelar'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('order.shippingStatus') || 'Estado'}</span>
                      {getOrderStatusBadge()}
                    </div>
                    {order.shippingInfo?.address && (
                      <div className="flex items-start gap-3">
                        <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{t('order.shippingAddress') || 'Dirección'}</p>
                          <p className="text-gray-600">{order.shippingInfo.address}</p>
                        </div>
                      </div>
                    )}
                    {order.shippingInfo?.trackingNumber && (
                      <div className="flex items-start gap-3">
                        <FiPackage className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{t('order.trackingNumber') || 'Número de seguimiento'}</p>
                          <p className="text-gray-600">{order.shippingInfo.trackingNumber}</p>
                        </div>
                      </div>
                    )}
                    {order.shippingInfo?.shippingMethod && (
                      <div className="flex items-start gap-3">
                        <FiPackage className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{t('order.shippingMethod') || 'Método de envío'}</p>
                          <p className="text-gray-600">{order.shippingInfo.shippingMethod}</p>
                        </div>
                      </div>
                    )}
                    {order.shippingInfo?.shippingCost && (
                      <div className="flex items-start gap-3">
                        <FiPackage className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{t('order.shippingCost') || 'Costo de envío'}</p>
                          <p className="text-gray-600">${order.shippingInfo.shippingCost}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('order.summary') || 'Resumen del Pedido'}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('order.orderDate') || 'Fecha de pedido'}</span>
                  <span className="font-medium">
                    {format(new Date(order.createdAt), 'dd MMM yyyy', { locale })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('order.status') || 'Estado'}</span>
                  {getOrderStatusBadge()}
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">{t('order.price') || 'Precio'}</span>
                    <span className="font-semibold">${order.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">{t('order.commission') || 'Comisión'}</span>
                    <span className="font-semibold">${order.commission}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                    <span>{t('order.earnings') || 'Ganancias'}</span>
                    <span className="text-primary-600">${order.artistEarnings || order.price - order.commission}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
