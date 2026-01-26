import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const AdminArtistsPage = () => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: artistsData, isLoading, error } = useQuery({
    queryKey: ['admin', 'artists', page, statusFilter],
    queryFn: () => adminApi.getArtists({ page, limit: 10, status: statusFilter || undefined }),
  });

  const artists = artistsData?.data || [];
  const totalPages = artistsData?.pagination?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">{t('artist.approved') || 'Aprobado'}</Badge>;
      case 'pending':
        return <Badge variant="warning">{t('artist.pending') || 'Pendiente'}</Badge>;
      case 'blocked':
        return <Badge variant="danger">{t('artist.blocked') || 'Bloqueado'}</Badge>;
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
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar los artistas'}</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.artists') || 'Artistas'}</h1>
            <p className="text-gray-600">{t('admin.artistsSubtitle') || 'Gestiona todos los artistas del sistema'}</p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                label={t('admin.filterByStatus') || 'Filtrar por estado'}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: t('admin.allStatuses') || 'Todos los estados' },
                  { value: 'pending', label: t('artist.pending') || 'Pendiente' },
                  { value: 'approved', label: t('artist.approved') || 'Aprobado' },
                  { value: 'blocked', label: t('artist.blocked') || 'Bloqueado' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Artists List */}
        {artists.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('admin.noArtists') || 'No hay artistas'}</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {artists.map((artist) => {
                const user = typeof artist.userId === 'object' ? artist.userId : null;
                return (
                  <Link key={artist._id} to={`/admin/artists/${artist._id}`} className="block">
                    <Card padding="lg" className="hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <FiUser className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-gray-900">{artist.displayName}</p>
                              {getStatusBadge(artist.status)}
                              {artist.status === 'pending' && (
                                <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>
                                  {t('admin.createdAt') || 'Creado'}:{' '}
                                  {format(new Date(artist.createdAt), 'dd MMM yyyy', { locale })}
                                </span>
                              </div>
                              {user && (
                                <span className="text-gray-400">• {user.email}</span>
                              )}
                            </div>
                            {artist.bio && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{artist.bio}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {t('dashboard.view') || 'Ver'}
                        </Button>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
