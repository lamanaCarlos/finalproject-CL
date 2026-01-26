import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { artworkApi } from '../../services/api';
import { Layout } from '../../components/layout';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { Pagination } from '../../components/common/Pagination';
import { Loader } from '../../components/common/Loader';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { FiSearch } from 'react-icons/fi';
import type { ArtworkFilters } from '../../types';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

export const GalleryPage = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArtworkFilters>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['artworks', filters],
    queryFn: () => artworkApi.getArtworks(filters),
  });

  // Show error toast only once when error occurs
  useEffect(() => {
    if (error) {
      toast.error(t('gallery.errorLoading') || 'Error al cargar las obras');
    }
  }, [error, t]);

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
    setPage(1);
  };

  const handleFilterChange = (key: keyof ArtworkFilters, value: string | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, page: 1 };
      if (value) {
        (newFilters as any)[key] = value;
      } else {
        delete (newFilters as any)[key];
      }
      return newFilters;
    });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const artworks = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('gallery.title') || 'Galería de Arte'}</h1>
          <p className="text-gray-600">{t('gallery.subtitle') || 'Descubre obras únicas de artistas talentosos'}</p>
        </div>

        {/* Filters */}
        <Card className="mb-8" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder={t('gallery.searchPlaceholder') || 'Buscar obras...'}
                leftIcon={<FiSearch className="w-5 h-5" />}
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>

            <Select
              placeholder={t('gallery.typePlaceholder') || 'Tipo'}
              options={[
                { value: '', label: t('gallery.allTypes') || 'Todos los tipos' },
                { value: 'digital', label: t('artwork.digital') || 'Digital' },
                { value: 'physical', label: t('artwork.physical') || 'Físico' },
              ]}
              fullWidth
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            />

            <Select
              placeholder={t('gallery.sortPlaceholder') || 'Ordenar por'}
              options={[
                { value: 'newest', label: t('gallery.sortNewest') || 'Más recientes' },
                { value: 'oldest', label: t('gallery.sortOldest') || 'Más antiguos' },
                { value: 'price-asc', label: t('gallery.sortPriceAsc') || 'Precio: menor a mayor' },
                { value: 'price-desc', label: t('gallery.sortPriceDesc') || 'Precio: mayor a menor' },
              ]}
              fullWidth
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
            />
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="text-center py-12">
            <p className="text-red-600 mb-4">{t('gallery.errorLoading') || 'Error al cargar las obras'}</p>
            <Button onClick={() => window.location.reload()}>{t('common.retry') || 'Reintentar'}</Button>
          </Card>
        )}

        {/* Artworks Grid */}
        {!isLoading && !error && (
          <>
            {artworks.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 text-lg">{t('gallery.noResults') || 'No se encontraron obras'}</p>
                <p className="text-gray-500 mt-2">{t('gallery.adjustFilters') || 'Intenta ajustar los filtros de búsqueda'}</p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {artworks.map((artwork) => (
                    <ArtworkCard key={artwork._id} artwork={artwork} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
