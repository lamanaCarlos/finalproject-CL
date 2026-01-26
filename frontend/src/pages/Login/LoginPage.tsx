import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Layout } from '../../components/layout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { FiMail, FiLock } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
            <p className="text-gray-600">{t('auth.loginSubtitle') || 'Ingresa a tu cuenta para continuar'}</p>
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

            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              leftIcon={<FiLock className="w-5 h-5" />}
              error={errors.password?.message}
              fullWidth
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('auth.forgotPassword') || '¿Olvidaste tu contraseña?'}
                </a>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
              {t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.noAccount') || '¿No tienes una cuenta?'}{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
