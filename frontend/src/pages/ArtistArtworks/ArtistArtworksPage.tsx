import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworkApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiImage, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ArtistArtworksPage = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: artworksData, isLoading, error } = useQuery({
    queryKey: ['artworks', 'my'],
    queryFn: () => artworkApi.getMyArtworks(),
  });

  const artworks = artworksData?.data || [];

  // Mutation para publicar obra
  const publishMutation = useMutation({
    mutationFn: (artworkId: string) => artworkApi.publishArtwork(artworkId),
    onSuccess: () => {
      toast.success(t('artwork.publishSuccess') || 'Obra publicada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['artworks', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('artwork.publishError') || 'Error al publicar la obra';
      toast.error(errorMessage);
    },
  });

  // Mutation para despublicar obra
  const unpublishMutation = useMutation({
    mutationFn: (artworkId: string) => artworkApi.unpublishArtwork(artworkId),
    onSuccess: () => {
      toast.success(t('artwork.unpublishSuccess') || 'Obra despublicada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['artworks', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('artwork.unpublishError') || 'Error al despublicar la obra';
      toast.error(errorMessage);
    },
  });

  const handlePublish = (artworkId: string) => {
    if (window.confirm(t('artwork.confirmPublish') || '¿Publicar esta obra?')) {
      publishMutation.mutate(artworkId);
    }
  };

  const handleUnpublish = (artworkId: string) => {
    if (window.confirm(t('artwork.confirmUnpublish') || '¿Despublicar esta obra?')) {
      unpublishMutation.mutate(artworkId);
    }
  };

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
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(artwork.status)}
                    <Link to={`/artist/artworks/${artwork._id}/edit`}>
                      <Button variant="outline" size="sm">
                        {t('common.edit') || 'Editar'}
                      </Button>
                    </Link>
                  </div>
                  {/* Publish/Unpublish Actions */}
                  {artwork.status !== 'sold' && (
                    <div className="flex gap-2">
                      {artwork.status === 'published' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => handleUnpublish(artwork._id)}
                          disabled={unpublishMutation.isPending}
                          leftIcon={<FiEyeOff className="w-4 h-4" />}
                        >
                          {t('artwork.unpublish') || 'Despublicar'}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => handlePublish(artwork._id)}
                          disabled={publishMutation.isPending}
                          leftIcon={<FiEye className="w-4 h-4" />}
                        >
                          {t('artwork.publish') || 'Publicar'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
