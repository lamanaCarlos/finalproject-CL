import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artworkApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import type { UpdateArtworkRequest } from '../../types';

const artworkSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type: z.enum(['digital', 'physical']),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  images: z.array(z.string().url('URL inválida')).min(1, 'Al menos una imagen es requerida'),
  technique: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().optional(),
  digitalFormat: z.string().optional(),
  resolution: z.string().optional(),
  language: z.enum(['es', 'en']),
});

type ArtworkFormData = z.infer<typeof artworkSchema>;

export const ArtistEditArtworkPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: artworkData, isLoading: isLoadingArtwork } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => artworkApi.getArtworkById(id!),
    enabled: !!id,
  });

  const artwork = artworkData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
  });

  // Reset form when artwork loads
  if (artwork && !watch('title')) {
    reset({
      title: artwork.title,
      description: artwork.description,
      type: artwork.type,
      price: artwork.price,
      images: artwork.images || [''],
      technique: artwork.technique || '',
      dimensions: artwork.dimensions || '',
      weight: artwork.weight,
      digitalFormat: artwork.digitalFormat || '',
      resolution: artwork.resolution || '',
      language: artwork.language,
    });
  }

  const artworkType = watch('type');

  const updateMutation = useMutation({
    mutationFn: (data: UpdateArtworkRequest) => artworkApi.updateArtwork(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artwork', id] });
      queryClient.invalidateQueries({ queryKey: ['artworks', 'my'] });
      toast.success(t('artwork.updated') || 'Obra actualizada exitosamente');
      navigate('/artist/artworks');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al actualizar la obra');
    },
  });

  const onSubmit = (data: ArtworkFormData) => {
    const requestData: UpdateArtworkRequest = {
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price,
      images: data.images.filter((img) => img.trim() !== ''),
      technique: data.technique || undefined,
      dimensions: data.dimensions || undefined,
      weight: data.weight || undefined,
      digitalFormat: data.digitalFormat || undefined,
      resolution: data.resolution || undefined,
      language: data.language,
    };
    updateMutation.mutate(requestData);
  };

  const addImageField = () => {
    const currentImages = watch('images') || [];
    setValue('images', [...currentImages, '']);
  };

  const removeImageField = (index: number) => {
    const currentImages = watch('images') || [];
    setValue('images', currentImages.filter((_, i) => i !== index));
  };

  if (isLoadingArtwork) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!artwork) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Obra no encontrada'}</p>
            <Link to="/artist/artworks">
              <Button variant="primary">{t('common.back') || 'Volver'}</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/artist/artworks" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver a obras'}</span>
        </Link>

        {/* Form */}
        <Card padding="lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('artwork.edit') || 'Editar Obra'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Same fields as create form */}
            <div>
              <Input
                label={t('artwork.title') || 'Título'}
                {...register('title')}
                error={errors.title?.message}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('artwork.description') || 'Descripción'} <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Select
                label={t('artwork.type') || 'Tipo'}
                {...register('type')}
                error={errors.type?.message}
                required
                options={[
                  { value: 'physical', label: t('artwork.physical') || 'Física' },
                  { value: 'digital', label: t('artwork.digital') || 'Digital' },
                ]}
              />
            </div>

            <div>
              <Input
                label={t('artwork.price') || 'Precio'}
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
                required
              />
            </div>

            <div>
              <Input
                label={t('artwork.technique') || 'Técnica'}
                {...register('technique')}
                error={errors.technique?.message}
              />
            </div>

            {artworkType === 'physical' && (
              <>
                <div>
                  <Input
                    label={t('artwork.dimensions') || 'Dimensiones (ej: 50x70 cm)'}
                    {...register('dimensions')}
                    error={errors.dimensions?.message}
                  />
                </div>
                <div>
                  <Input
                    label={t('artwork.weight') || 'Peso (kg)'}
                    type="number"
                    step="0.01"
                    {...register('weight', { valueAsNumber: true })}
                    error={errors.weight?.message}
                  />
                </div>
              </>
            )}

            {artworkType === 'digital' && (
              <>
                <div>
                  <Input
                    label={t('artwork.digitalFormat') || 'Formato (ej: PNG, JPG)'}
                    {...register('digitalFormat')}
                    error={errors.digitalFormat?.message}
                  />
                </div>
                <div>
                  <Input
                    label={t('artwork.resolution') || 'Resolución (ej: 1920x1080)'}
                    {...register('resolution')}
                    error={errors.resolution?.message}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('artwork.images') || 'Imágenes (URLs)'} <span className="text-red-500">*</span>
              </label>
              {watch('images')?.map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`images.${index}` as const)}
                    error={errors.images?.[index]?.message}
                    placeholder="https://example.com/image.jpg"
                  />
                  {watch('images') && watch('images')!.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeImageField(index)}
                    >
                      {t('common.remove') || 'Eliminar'}
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="mt-2"
              >
                {t('artwork.addImage') || 'Agregar Imagen'}
              </Button>
            </div>

            <div>
              <Select
                label={t('artwork.language') || 'Idioma'}
                {...register('language')}
                error={errors.language?.message}
                options={[
                  { value: 'es', label: t('common.spanish') || 'Español' },
                  { value: 'en', label: t('common.english') || 'Inglés' },
                ]}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                leftIcon={<FiSave className="w-5 h-5" />}
              >
                {isSubmitting ? (t('common.saving') || 'Guardando...') : (t('artwork.update') || 'Actualizar Obra')}
              </Button>
              <Link to="/artist/artworks">
                <Button type="button" variant="outline">
                  {t('common.cancel') || 'Cancelar'}
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
