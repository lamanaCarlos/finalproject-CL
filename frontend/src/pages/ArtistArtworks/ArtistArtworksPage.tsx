import { useQuery } from '@tanstack/react-query';
import { artworkApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiImage, FiPlus } from 'react-icons/fi';

export const ArtistArtworksPage = () => {
  const { t } = useLanguage();

  const { data: artworksData, isLoading, error } = useQuery({
    queryKey: ['artworks', 'my'],
    queryFn: () => artworkApi.getMyArtworks(),
  });

  const artworks = artworksData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">{t('artwork.published') || 'Publicada'}</Badge>;
      case 'draft':
        return <Badge variant="warning">{t('artwork.draft') || 'Borrador'}</Badge>;
      case 'sold':
        return <Badge variant="info">{t('artwork.sold') || 'Vendida'}</Badge>;
      default:
        return <Badge variant="primary">{status}</Badge>;
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t('dashboard.myArtworks') || 'Mis Obras'}
            </h1>
            <p className="text-gray-600">{t('dashboard.myArtworksSubtitle') || 'Gestiona todas tus obras'}</p>
          </div>
          <Link to="/artist/artworks/new">
            <Button variant="primary" leftIcon={<FiPlus className="w-5 h-5" />}>
              {t('dashboard.createArtwork') || 'Crear Obra'}
            </Button>
          </Link>
        </div>

        {artworks.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{t('dashboard.noArtworks') || 'No tienes obras aún'}</p>
            <Link to="/artist/artworks/new">
              <Button variant="primary">{t('dashboard.createFirstArtwork') || 'Crear tu primera obra'}</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="relative">
                <ArtworkCard artwork={artwork} />
                <div className="mt-2 flex items-center justify-between">
                  {getStatusBadge(artwork.status)}
                  <Link to={`/artist/artworks/${artwork._id}/edit`}>
                    <Button variant="outline" size="sm">
                      {t('common.edit') || 'Editar'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
