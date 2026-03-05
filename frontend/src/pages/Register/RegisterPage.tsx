import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Layout } from '../../components/layout';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import type { UserRole } from '../../types';

const registerSchema = z
  .object({
    email: z.string().email('Email inválido').min(1, 'Email es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    role: z.enum(['buyer', 'artist']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { t } = useLanguage();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'buyer',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      });
      navigate('/login');
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  const roleOptions = [
    { value: 'buyer', label: t('auth.roleBuyer') || 'Comprador' },
    { value: 'artist', label: t('auth.roleArtist') || 'Artista' },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register')}</h1>
            <p className="text-gray-600">{t('auth.registerSubtitle') || 'Crea una cuenta para comenzar'}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="tu@email.com"
              leftIcon={<FiMail className="w-5 h-5" />}
              error={errors.email?.message}
              fullWidth
              {...register('email')}
            />

            <Select
              label={t('auth.role')}
              options={roleOptions}
              placeholder={t('auth.selectRole') || 'Selecciona tu rol'}
              leftIcon={<FiUser className="w-5 h-5" />}
              error={errors.role?.message}
              fullWidth
              {...register('role')}
            />

            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              leftIcon={<FiLock className="w-5 h-5" />}
              error={errors.password?.message}
              fullWidth
              {...register('password')}
            />

            <Input
              label={t('auth.confirmPassword')}
              type="password"
              placeholder="••••••••"
              leftIcon={<FiLock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              fullWidth
              {...register('confirmPassword')}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
              {t('auth.register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.haveAccount') || '¿Ya tienes una cuenta?'}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
