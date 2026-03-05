import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../../services/api';
import { artworkApi } from '../../services/api';
import { Layout } from '../../components/layout';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Image } from '../../components/common/Image';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { useLanguage } from '../../context/LanguageContext';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { FiInstagram, FiGlobe, FiUser, FiCalendar, FiImage } from 'react-icons/fi';

export const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const { data: artistData, isLoading: isLoadingArtist, error: artistError } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistApi.getArtistById(id!),
    enabled: !!id,
  });

  const { data: artworksData, isLoading: isLoadingArtworks } = useQuery({
    queryKey: ['artworks', 'artist', id],
    queryFn: () => artworkApi.getArtworks({ artistId: id, limit: 12 }),
    enabled: !!id && !!artistData?.data,
  });

  if (isLoadingArtist) {
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

  if (artistError || !artistData?.data) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <p className="text-red-600 mb-4">{t('artist.errorLoading') || 'Error al cargar el perfil del artista'}</p>
          </Card>
        </div>
      </Layout>
    );
  }

  const artist = artistData.data;
  const artworks = artworksData?.data || [];
  const stats = artist.stats;

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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card padding="lg" className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {artist.profileImage ? (
                <Image
                  src={artist.profileImage}
                  alt={artist.displayName}
                  aspectRatio="square"
                  objectFit="cover"
                  className="w-32 h-32 rounded-full"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{artist.displayName}</h1>
                  {getStatusBadge()}
                </div>
              </div>

              {artist.bio && (
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{artist.bio}</p>
              )}

              {/* Social Links */}
              {artist.socialLinks && (artist.socialLinks.instagram || artist.socialLinks.web) && (
                <div className="flex gap-4 mb-4">
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
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
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <FiGlobe className="w-5 h-5" />
                      <span>{t('artist.website') || 'Sitio web'}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.totalArtworks || 0}</p>
                    <p className="text-sm text-gray-600">{t('artist.totalArtworks') || 'Obras totales'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.publishedArtworks || 0}</p>
                    <p className="text-sm text-gray-600">{t('artist.publishedArtworks') || 'Publicadas'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.soldArtworks || 0}</p>
                    <p className="text-sm text-gray-600">{t('artist.soldArtworks') || 'Vendidas'}</p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <FiCalendar className="w-4 h-4" />
                <span>
                  {t('artist.memberSince') || 'Miembro desde'}{' '}
                  {format(new Date(artist.createdAt), 'MMMM yyyy', { locale })}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Artworks Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiImage className="w-6 h-6" />
              {t('artist.artworks') || 'Obras'}
            </h2>
          </div>

          {isLoadingArtworks ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </div>
          ) : artworks.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">{t('artist.noArtworks') || 'Este artista aún no tiene obras publicadas'}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
