import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiGlobe, FiInstagram } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Image } from '../../components/common/Image';

export const AdminArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  const queryClient = useQueryClient();

  const { data: artistsData, isLoading } = useQuery({
    queryKey: ['admin', 'artists'],
    queryFn: () => adminApi.getArtists({ limit: 1000 }),
  });

  const artist = artistsData?.data?.find((a) => a._id === id);

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'approved' | 'blocked') => adminApi.updateArtistStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'artists'] });
      toast.success(t('admin.artistStatusUpdated') || 'Estado del artista actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al actualizar el artista');
    },
  });

  const handleApprove = () => {
    updateStatusMutation.mutate('approved');
  };

  const handleBlock = () => {
    updateStatusMutation.mutate('blocked');
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

  if (!artist) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Artista no encontrado'}</p>
            <Link to="/admin/artists">
              <Button variant="primary">{t('common.back') || 'Volver'}</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const user = typeof artist.userId === 'object' ? artist.userId : null;

  const getStatusBadge = () => {
    switch (artist.status) {
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/admin/artists" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver a artistas'}</span>
        </Link>

        {/* Artist Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artist Info */}
            <Card padding="lg">
              <div className="flex items-start gap-6 mb-6">
                {artist.profileImage ? (
                  <Image
                    src={artist.profileImage}
                    alt={artist.displayName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-primary-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{artist.displayName}</h2>
                  {getStatusBadge()}
                </div>
              </div>

              <div className="space-y-4">
                {artist.bio && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{t('artist.bio') || 'Biografía'}</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{artist.bio}</p>
                  </div>
                )}

                {user && (
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t('auth.email') || 'Email'}</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.createdAt') || 'Fecha de creación'}</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(artist.createdAt), 'dd MMM yyyy HH:mm', { locale })}
                    </p>
                  </div>
                </div>

                {artist.socialLinks && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{t('artist.socialLinks') || 'Enlaces Sociales'}</p>
                    <div className="flex flex-wrap gap-4">
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary-600 hover:underline"
                        >
                          <FiInstagram className="w-5 h-5" />
                          <span>Instagram</span>
                        </a>
                      )}
                      {artist.socialLinks.web && (
                        <a
                          href={artist.socialLinks.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary-600 hover:underline"
                        >
                          <FiGlobe className="w-5 h-5" />
                          <span>{t('artist.website') || 'Sitio web'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {artist.stats && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">{t('artist.totalArtworks') || 'Obras totales'}</p>
                      <p className="text-2xl font-bold text-gray-900">{artist.stats.totalArtworks || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('artist.publishedArtworks') || 'Publicadas'}</p>
                      <p className="text-2xl font-bold text-gray-900">{artist.stats.publishedArtworks || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('artist.soldArtworks') || 'Vendidas'}</p>
                      <p className="text-2xl font-bold text-gray-900">{artist.stats.soldArtworks || 0}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.actions') || 'Acciones'}</h2>
              <div className="space-y-3">
                {artist.status === 'pending' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleApprove}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? t('common.loading') || 'Cargando...'
                      : t('admin.approveArtist') || 'Aprobar Artista'}
                  </Button>
                )}
                {artist.status !== 'blocked' && (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={handleBlock}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? t('common.loading') || 'Cargando...'
                      : t('admin.blockArtist') || 'Bloquear Artista'}
                  </Button>
                )}
                {artist.status === 'blocked' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleApprove}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? t('common.loading') || 'Cargando...'
                      : t('admin.unblockArtist') || 'Desbloquear Artista'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Status */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.status') || 'Estado'}</h2>
              <div className="space-y-2">
                {getStatusBadge()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
