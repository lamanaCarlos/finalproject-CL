import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { artworkApi } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Layout } from '../../components/layout';
import { ArtworkCard } from '../../components/artwork/ArtworkCard';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { useLanguage } from '../../context/LanguageContext';

// Function to shuffle array randomly
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const HomePage = () => {
  const { t } = useLanguage();

  // Fetch all published artworks
  const { data, isLoading, error } = useQuery({
    queryKey: ['artworks', 'home'],
    queryFn: () => artworkApi.getArtworks({ limit: 100 }),
  });

  // Shuffle and limit artworks for display
  // Note: Backend already filters by status='published', so all returned artworks are published
  const randomArtworks = useMemo(() => {
    if (!data?.data) return [];
    // All artworks from API are already published (backend filters them)
    const shuffled = shuffleArray(data.data);
    return shuffled.slice(0, 12); // Show 12 random artworks
  }, [data?.data]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t('home.title') || 'Descubre Obras Únicas'}
          </h1>
          <p className="text-xl mb-8">
            {t('home.subtitle') || 'Explora y compra arte original de artistas talentosos de todo el mundo'}
          </p>
          <Link to="/gallery">
            <Button variant="secondary" size="lg">
              {t('home.browseArt') || 'Explorar Galería'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Artworks Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.featuredArtworks') || 'Obras Destacadas'}
          </h2>
          <p className="text-gray-600">
            {t('home.featuredSubtitle') || 'Una selección aleatoria de obras de nuestros artistas'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="text-center py-12" padding="lg">
            <p className="text-red-600 mb-4">{t('gallery.errorLoading') || 'Error al cargar las obras'}</p>
            <Button onClick={() => window.location.reload()}>{t('common.retry') || 'Reintentar'}</Button>
          </Card>
        )}

        {/* Artworks Grid */}
        {!isLoading && !error && (
          <>
            {randomArtworks.length === 0 ? (
              <Card className="text-center py-12" padding="lg">
                <p className="text-gray-600 text-lg">
                  {t('home.noArtworks') || 'Aún no hay obras disponibles'}
                </p>
                <Link to="/gallery" className="mt-4 inline-block">
                  <Button variant="primary">{t('home.browseArt') || 'Explorar Galería'}</Button>
                </Link>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {randomArtworks.map((artwork) => (
                    <ArtworkCard key={artwork._id} artwork={artwork} />
                  ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-8">
                  <Link to="/gallery">
                    <Button variant="outline" size="lg">
                      {t('home.viewAllArtworks') || 'Ver Todas las Obras'}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
