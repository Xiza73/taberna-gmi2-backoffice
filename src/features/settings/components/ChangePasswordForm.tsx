import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { clearTokens } from '@/api/tokens';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useChangePassword } from '../hooks/useStaffProfileMutations';

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultValues: FormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ChangePasswordForm() {
  const mutation = useChangePassword();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (values: FormValues) => {
    try {
      await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      // Back revokes all refresh tokens — we clear and force re-login.
      clearTokens();
      qc.clear();
      toast.success('Contraseña cambiada. Volvé a iniciar sesión.');
      void navigate({ to: '/login', search: { redirect: undefined } });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña';
      if (err instanceof ApiError && err.status === 400 && /current/i.test(err.message)) {
        setError('currentPassword', { message: 'Contraseña actual incorrecta' });
      }
      toast.error(message);
    }
  };

  const isPending = mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="relative">
        <Lock
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          className="pl-9"
          {...register('currentPassword', {
            required: 'Contraseña actual requerida',
          })}
        />
      </div>

      <div className="relative">
        <Lock
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          className="pl-9"
          {...register('newPassword', {
            required: 'Nueva contraseña requerida',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 128, message: 'Máximo 128 caracteres' },
          })}
        />
      </div>

      <div className="relative">
        <Lock
          size={16}
          className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          className="pl-9"
          {...register('confirmPassword', {
            required: 'Confirmá la nueva contraseña',
            validate: (v) => v === newPasswordValue || 'No coincide con la nueva',
          })}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Al cambiar la contraseña, todas tus sesiones activas se cierran y vas a
        tener que volver a iniciar sesión.
      </p>

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => reset(defaultValues)}
          disabled={isPending}
        >
          Limpiar
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Cambiando…' : 'Cambiar contraseña'}
        </Button>
      </div>
    </form>
  );
}
