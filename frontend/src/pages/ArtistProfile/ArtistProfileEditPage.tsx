import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { artistApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import type { UpdateArtistProfileRequest } from '../../types';

const profileSchema = z.object({
  displayName: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  bio: z.string().max(1000, 'La biografía es muy larga').optional(),
  profileImage: z.string().url('URL inválida').optional().or(z.literal('')),
  socialLinks: z.object({
    instagram: z.string().url('URL inválida').optional().or(z.literal('')),
    web: z.string().url('URL inválida').optional().or(z.literal('')),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ArtistProfileEditPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['artist', 'profile', 'me'],
    queryFn: () => artistApi.getMyProfile(),
  });

  const profile = profileData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Reset form when profile loads
  if (profile) {
    reset({
      displayName: profile.displayName,
      bio: profile.bio || '',
      profileImage: profile.profileImage || '',
      socialLinks: {
        instagram: profile.socialLinks?.instagram || '',
        web: profile.socialLinks?.web || '',
      },
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data: UpdateArtistProfileRequest) => artistApi.createOrUpdateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artist', 'profile', 'me'] });
      toast.success(t('artist.profileUpdated') || 'Perfil actualizado exitosamente');
      navigate('/artist/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al actualizar el perfil');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const requestData: UpdateArtistProfileRequest = {
      displayName: data.displayName,
      bio: data.bio || undefined,
      profileImage: data.profileImage || undefined,
      socialLinks: {
        instagram: data.socialLinks?.instagram || undefined,
        web: data.socialLinks?.web || undefined,
      },
    };
    updateMutation.mutate(requestData);
  };

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar el perfil'}</p>
            <Link to="/artist/dashboard">
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
        <Link to="/artist/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver al dashboard'}</span>
        </Link>

        {/* Form */}
        <Card padding="lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('dashboard.artist.profile') || 'Mi Perfil Artístico'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div>
              <Input
                label={t('artist.displayName') || 'Nombre artístico'}
                {...register('displayName')}
                error={errors.displayName?.message}
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('artist.bio') || 'Biografía'}
              </label>
              <textarea
                {...register('bio')}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <Input
                label={t('artist.profileImage') || 'Imagen de perfil (URL)'}
                {...register('profileImage')}
                error={errors.profileImage?.message}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('artist.socialLinks') || 'Enlaces Sociales'}</h3>
              
              <div>
                <Input
                  label={t('artist.instagram') || 'Instagram'}
                  {...register('socialLinks.instagram')}
                  error={errors.socialLinks?.instagram?.message}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <Input
                  label={t('artist.web') || 'Sitio Web'}
                  {...register('socialLinks.web')}
                  error={errors.socialLinks?.web?.message}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                leftIcon={<FiSave className="w-5 h-5" />}
              >
                {isSubmitting ? (t('common.saving') || 'Guardando...') : (t('common.save') || 'Guardar')}
              </Button>
              <Link to="/artist/dashboard">
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
