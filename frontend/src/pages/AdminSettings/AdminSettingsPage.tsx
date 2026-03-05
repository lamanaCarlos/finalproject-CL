import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useLanguage } from '../../context/LanguageContext';
import { FiSave, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  commissionRate: z.number().min(0, 'La tasa debe ser mayor o igual a 0').max(100, 'La tasa no puede ser mayor a 100'),
  minCommission: z.number().min(0, 'La comisión mínima debe ser mayor o igual a 0'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const AdminSettingsPage = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminApi.getSettings(),
  });

  const settings = settingsData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  // Reset form when settings load
  if (settings) {
    reset({
      commissionRate: settings.commissionRate,
      minCommission: settings.minCommission,
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data: { commissionRate: number; minCommission: number }) => adminApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success(t('admin.settingsUpdated') || 'Configuración actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al actualizar la configuración');
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoadingSettings) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar la configuración'}</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FiSettings className="w-8 h-8" />
            {t('dashboard.settings') || 'Configuración'}
          </h1>
          <p className="text-gray-600">{t('admin.settingsSubtitle') || 'Gestiona la configuración del sistema'}</p>
        </div>

        {/* Settings Form */}
        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Commission Rate */}
            <div>
              <Input
                label={t('admin.commissionRate') || 'Tasa de Comisión (%)'}
                type="number"
                step="0.01"
                {...register('commissionRate', { valueAsNumber: true })}
                error={errors.commissionRate?.message}
                required
                helperText={t('admin.commissionRateHelp') || 'Porcentaje de comisión que se cobra por cada venta'}
              />
            </div>

            {/* Min Commission */}
            <div>
              <Input
                label={t('admin.minCommission') || 'Comisión Mínima ($)'}
                type="number"
                step="0.01"
                {...register('minCommission', { valueAsNumber: true })}
                error={errors.minCommission?.message}
                required
                helperText={t('admin.minCommissionHelp') || 'Comisión mínima que se cobra independientemente del porcentaje'}
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
                {isSubmitting ? (t('common.saving') || 'Guardando...') : (t('common.save') || 'Guardar')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
