import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { DashboardLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FiUsers, FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const AdminUsersPage = () => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', page, roleFilter],
    queryFn: () => adminApi.getUsers({ page, limit: 10, role: roleFilter || undefined }),
  });

  const users = usersData?.data || [];
  const totalPages = usersData?.pagination?.totalPages || 1;

  const getRoleBadge = (role: string) => {
    switch (role) {
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
            <p className="text-red-600 mb-4">{t('common.error') || 'Error al cargar los usuarios'}</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.users') || 'Usuarios'}</h1>
            <p className="text-gray-600">{t('admin.usersSubtitle') || 'Gestiona todos los usuarios del sistema'}</p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                label={t('admin.filterByRole') || 'Filtrar por rol'}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: t('admin.allRoles') || 'Todos los roles' },
                  { value: 'buyer', label: t('user.buyer') || 'Comprador' },
                  { value: 'artist', label: t('user.artist') || 'Artista' },
                  { value: 'admin', label: t('user.admin') || 'Admin' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Users List */}
        {users.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('admin.noUsers') || 'No hay usuarios'}</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {users.map((user) => (
                <Link key={user._id} to={`/admin/users/${user._id}`} className="block">
                  <Card padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{user.email}</p>
                            {getRoleBadge(user.role)}
                            {!user.isActive && (
                              <Badge variant="danger">{t('user.inactive') || 'Inactivo'}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {t('admin.createdAt') || 'Creado'}:{' '}
                                {format(new Date(user.createdAt), 'dd MMM yyyy', { locale })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('dashboard.view') || 'Ver'}
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
