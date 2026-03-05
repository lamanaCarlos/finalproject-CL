import { Link } from 'react-router-dom';
import type { Artwork } from '../../../types';
import { Card } from '../../common/Card';
import { Image } from '../../common/Image';
import { Badge } from '../../common/Badge';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '../../../context/LanguageContext';
import artworkPlaceholder from '../../../assets/images/artwork-placeholder.svg';

export interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const { language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const getStatusBadge = () => {
    switch (artwork.status) {
      case 'published':
        return <Badge variant="success">Publicado</Badge>;
      case 'draft':
        return <Badge variant="warning">Borrador</Badge>;
      case 'sold':
        return <Badge variant="danger">Vendido</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    return artwork.type === 'digital' ? (
      <Badge variant="info">Digital</Badge>
    ) : (
      <Badge variant="primary">Físico</Badge>
    );
  };

  const mainImage = artwork.images && artwork.images.length > 0 ? artwork.images[0] : artworkPlaceholder;
  const artistName = typeof artwork.artist === 'object' ? artwork.artist.displayName : 'Artista';

  return (
    <Link to={`/artwork/${artwork._id}`}>
      <Card hover clickable className="h-full flex flex-col">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={mainImage}
            alt={artwork.title}
            aspectRatio="square"
            objectFit="cover"
            lazy
            className="w-full"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {getStatusBadge()}
            {getTypeBadge()}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{artwork.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{artwork.description}</p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">{artistName}</p>
              <p className="text-xs text-gray-400">
                {format(new Date(artwork.createdAt), 'dd MMM yyyy', { locale })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">${artwork.price}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
