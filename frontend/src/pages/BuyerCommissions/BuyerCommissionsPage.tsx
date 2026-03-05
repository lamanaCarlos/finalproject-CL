import { useQuery } from '@tanstack/react-query';
import { commissionApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiFileText, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const BuyerCommissionsPage = () => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const { data: commissionsData, isLoading, error } = useQuery({
    queryKey: ['commissions', 'my'],
    queryFn: () => commissionApi.getMyCommissions(),
  });

  const commissions = commissionsData?.data || [];

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar los encargos'}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('dashboard.commissions') || 'Mis Encargos'}
          </h1>
          <p className="text-gray-600">{t('dashboard.commissionsSubtitle') || 'Gestiona todos tus encargos'}</p>
        </div>

        {commissions.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{t('dashboard.noCommissions') || 'No tienes encargos aún'}</p>
            <Link to="/gallery">
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                {t('dashboard.exploreArtists') || 'Explorar Artistas'}
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {commissions.map((commission) => {
              const artist = commission.artist;
              const artistName = artist?.displayName || 'Artista';

              return (
                <Link
                  key={commission._id}
                  to={`/buyer/commissions/${commission._id}`}
                  className="block"
                >
                  <Card padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{commission.title}</h3>
                            <p className="text-gray-600 mb-2">{artistName}</p>
                            <p className="text-gray-500 text-sm line-clamp-2">{commission.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-primary-600 mb-2">
                              ${commission.agreedPrice || commission.budget}
                            </p>
                            {getCommissionStatusBadge(commission)}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>
                              {t('commission.created') || 'Creado'}:{' '}
                              {format(new Date(commission.createdAt), 'dd MMM yyyy', { locale })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>
                              {t('commission.deadline') || 'Fecha límite'}:{' '}
                              {format(new Date(commission.deadline), 'dd MMM yyyy', { locale })}
                            </span>
                          </div>
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
