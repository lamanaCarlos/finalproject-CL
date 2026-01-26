import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { useLanguage } from '../../context/LanguageContext';
import { FiImage } from 'react-icons/fi';

export const AdminArtworksPage = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: artworksData, isLoading, error } = useQuery({
    queryKey: ['admin', 'artworks', page, statusFilter],
    queryFn: () => adminApi.getArtworks({ page, limit: 12, status: statusFilter || undefined }),
  });

  const artworks = artworksData?.data || [];
  const totalPages = artworksData?.pagination?.totalPages || 1;

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
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar las obras'}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.artworks') || 'Obras'}</h1>
          <p className="text-gray-600">{t('admin.artworksSubtitle') || 'Gestiona todas las obras del sistema'}</p>
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
                  { value: 'draft', label: t('artwork.draft') || 'Borrador' },
                  { value: 'published', label: t('artwork.published') || 'Publicada' },
                  { value: 'sold', label: t('artwork.sold') || 'Vendida' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Artworks Grid */}
        {artworks.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('admin.noArtworks') || 'No hay obras'}</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
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
