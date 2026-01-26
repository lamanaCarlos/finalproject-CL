import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { commissionApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiUser, FiMessageSquare } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const ArtistCommissionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const { data: commissionData, isLoading, error } = useQuery({
    queryKey: ['commission', id],
    queryFn: () => commissionApi.getCommissionById(id!),
    enabled: !!id,
  });

  const commission = commissionData?.data;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !commission) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar el encargo'}</p>
            <Link to="/artist/commissions">
              <Button variant="primary">{t('common.back') || 'Volver'}</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const buyer = typeof commission.buyerId === 'object' ? commission.buyerId : commission.buyer;

  const getCommissionStatusBadge = () => {
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/artist/commissions" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver a encargos'}</span>
        </Link>

        {/* Commission Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Commission Info */}
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{commission.title}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('commission.description') || 'Descripción'}</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{commission.description}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUser className="w-5 h-5" />
                    <span>{buyer?.email || 'Comprador'}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Messages */}
            {commission.messages && commission.messages.length > 0 && (
              <Card padding="lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMessageSquare className="w-6 h-6" />
                  {t('commission.messages') || 'Mensajes'}
                </h2>
                <div className="space-y-4">
                  {commission.messages.map((message, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="text-gray-900 mb-1">{message.message}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(message.createdAt), 'dd MMM yyyy HH:mm', { locale })}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Commission Summary */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('commission.summary') || 'Resumen del Encargo'}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('commission.status') || 'Estado'}</span>
                  {getCommissionStatusBadge()}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('commission.budget') || 'Presupuesto'}</span>
                  <span className="font-semibold">${commission.budget}</span>
                </div>
                {commission.agreedPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('commission.agreedPrice') || 'Precio acordado'}</span>
                    <span className="font-semibold">${commission.agreedPrice}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">{t('commission.created') || 'Creado'}</span>
                    <span className="font-semibold text-sm">
                      {format(new Date(commission.createdAt), 'dd MMM yyyy', { locale })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('commission.deadline') || 'Fecha límite'}</span>
                    <span className="font-semibold text-sm">
                      {format(new Date(commission.deadline), 'dd MMM yyyy', { locale })}
                    </span>
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
