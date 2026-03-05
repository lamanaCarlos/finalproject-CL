import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const AdminUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  const queryClient = useQueryClient();

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers({ limit: 1000 }),
  });

  const user = usersData?.data?.find((u) => u._id === id);

  const updateStatusMutation = useMutation({
    mutationFn: (isActive: boolean) => adminApi.updateUserStatus(id!, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success(
        user?.isActive
          ? t('admin.userDeactivated') || 'Usuario desactivado exitosamente'
          : t('admin.userActivated') || 'Usuario activado exitosamente'
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('common.error') || 'Error al actualizar el usuario');
    },
  });

  const handleToggleStatus = () => {
    if (user) {
      updateStatusMutation.mutate(!user.isActive);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card padding="lg" className="text-center">
            <p className="text-red-600 mb-4">{t('common.error') || 'Usuario no encontrado'}</p>
            <Link to="/admin/users">
              <Button variant="primary">{t('common.back') || 'Volver'}</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return <Badge variant="danger">{t('user.admin') || 'Admin'}</Badge>;
      case 'artist':
        return <Badge variant="info">{t('user.artist') || 'Artista'}</Badge>;
      case 'buyer':
        return <Badge variant="primary">{t('user.buyer') || 'Comprador'}</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('common.back') || 'Volver a usuarios'}</span>
        </Link>

        {/* User Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="w-6 h-6" />
                {t('admin.userInfo') || 'Información del Usuario'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('auth.email') || 'Email'}</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('auth.role') || 'Rol'}</p>
                    <div className="mt-1">{getRoleBadge()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.createdAt') || 'Fecha de creación'}</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(user.createdAt), 'dd MMM yyyy HH:mm', { locale })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.actions') || 'Acciones'}</h2>
              <div className="space-y-3">
                <Button
                  variant={user.isActive ? 'danger' : 'primary'}
                  fullWidth
                  onClick={handleToggleStatus}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending
                    ? t('common.loading') || 'Cargando...'
                    : user.isActive
                      ? t('admin.deactivateUser') || 'Desactivar Usuario'
                      : t('admin.activateUser') || 'Activar Usuario'}
                </Button>
              </div>
            </Card>

            {/* Status */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('admin.status') || 'Estado'}</h2>
              <div className="space-y-2">
                {user.isActive ? (
                  <Badge variant="success">{t('admin.active') || 'Activo'}</Badge>
                ) : (
                  <Badge variant="danger">{t('user.inactive') || 'Inactivo'}</Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
