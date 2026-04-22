import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth';
import { ApiError } from '@/api/errors';
import type { LoginInput } from '@/types/auth';

function parseRedirect(searchStr: string): string {
  const params = new URLSearchParams(searchStr);
  const redirect = params.get('redirect');
  if (!redirect || !redirect.startsWith('/')) return '/';
  return redirect;
}

export function LoginPage() {
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = parseRedirect(location.searchStr);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: redirectTo });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values);
      void navigate({ to: redirectTo });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo iniciar sesión';
      if (err instanceof ApiError && err.code === 'RATE_LIMITED') {
        toast.error('Demasiados intentos. Esperá un minuto.');
        return;
      }
      toast.error(message);
      setError('password', { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl tracking-tight">
            <span className="text-primary">E</span>
            <span className="text-foreground">Commerce</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Backoffice</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h2 className="text-xl mb-1">Iniciá sesión</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Accedé con tu cuenta de staff.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                autoFocus
                error={errors.email?.message}
                className="pl-9"
                {...register('email', {
                  required: 'Email requerido',
                  pattern: { value: /.+@.+\..+/, message: 'Email inválido' },
                })}
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
              />
              <Input
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                className="pl-9"
                {...register('password', {
                  required: 'Contraseña requerida',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
              />
            </div>

            <Button type="submit" disabled={isLoggingIn} className="w-full mt-2">
              {isLoggingIn ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          ¿Olvidaste tu contraseña? Pedile a un super admin que te envíe un reset.
        </p>
      </div>
    </div>
  );
}
