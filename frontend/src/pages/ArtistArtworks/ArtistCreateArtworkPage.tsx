import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { artworkApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ImageUpload } from '../../components/common/ImageUpload';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import type { CreateArtworkRequest } from '../../types';

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

export const ArtistCreateArtworkPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      type: 'physical',
      language: 'es',
      images: [],
    },
  });

  const artworkType = watch('type');

  const createMutation = useMutation({
    mutationFn: (data: CreateArtworkRequest) => artworkApi.createArtwork(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks', 'my'] });
      toast.success(t('artwork.created') || 'Obra creada exitosamente');
      navigate('/artist/artworks');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al crear la obra');
    },
  });

  const onSubmit = (data: ArtworkFormData) => {
    const requestData: CreateArtworkRequest = {
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
    createMutation.mutate(requestData);
  };


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
            {t('artwork.create') || 'Crear Nueva Obra'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Input
                label={t('artwork.title') || 'Título'}
                {...register('title')}
                error={errors.title?.message}
                required
              />
            </div>

            {/* Description */}
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

            {/* Type */}
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

            {/* Price */}
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

            {/* Technique */}
            <div>
              <Input
                label={t('artwork.technique') || 'Técnica'}
                {...register('technique')}
                error={errors.technique?.message}
              />
            </div>

            {/* Physical Artwork Fields */}
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

            {/* Digital Artwork Fields */}
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

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('artwork.images') || 'Imágenes'} <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={watch('images') || []}
                onChange={(urls) => setValue('images', urls, { shouldValidate: true })}
                multiple
                maxImages={10}
                disabled={isSubmitting}
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
              )}
            </div>

            {/* Language */}
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

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                leftIcon={<FiSave className="w-5 h-5" />}
              >
                {isSubmitting ? (t('common.saving') || 'Guardando...') : (t('artwork.create') || 'Crear Obra')}
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
