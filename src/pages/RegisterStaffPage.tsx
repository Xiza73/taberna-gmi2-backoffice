import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2, Lock, ShieldCheck, User } from 'lucide-react';
import { ApiError } from '@/api/errors';
import { setTokens } from '@/api/tokens';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authKeys } from '@/features/auth';
import {
  roleLabels,
  useAcceptInvitation,
  useValidateInvitation,
} from '@/features/staff';
import type { AcceptInvitationInput } from '@/types/staff';

function parseToken(searchStr: string): string | undefined {
  const params = new URLSearchParams(searchStr);
  const token = params.get('token');
  return token && token.length > 0 ? token : undefined;
}

interface FormValues {
  name: string;
  password: string;
}

export function RegisterStaffPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const token = parseToken(location.searchStr);

  const validateQuery = useValidateInvitation(token);
  const acceptMutation = useAcceptInvitation(token ?? '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', password: '' } });

  useEffect(() => {
    if (!token) {
      toast.error('Falta el token de invitación en la URL.');
    }
  }, [token]);

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    try {
      const payload: AcceptInvitationInput = {
        name: values.name.trim(),
        password: values.password,
      };
      const tokens = await acceptMutation.mutateAsync(payload);
      setTokens(tokens);
      await qc.invalidateQueries({ queryKey: authKeys.me });
      toast.success('Cuenta creada. ¡Bienvenido!');
      void navigate({ to: '/' });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo completar el registro';
      toast.error(message);
    }
  };

  if (!token) {
    return <CenteredCard>{renderInvalid('Token faltante')}</CenteredCard>;
  }

  if (validateQuery.isLoading) {
    return (
      <CenteredCard>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          Validando invitación…
        </div>
      </CenteredCard>
    );
  }

  if (validateQuery.isError || !validateQuery.data) {
    const msg =
      validateQuery.error instanceof ApiError
        ? validateQuery.error.message
        : 'Invitación inválida o expirada';
    return <CenteredCard>{renderInvalid(msg)}</CenteredCard>;
  }

  const { email, role, invitedByName } = validateQuery.data;
  const isPending = acceptMutation.isPending;

  return (
    <CenteredCard>
      <div className="text-center mb-6">
        <h1 className="text-3xl tracking-tight">
          <span className="text-primary">E</span>
          <span className="text-foreground">Commerce</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Backoffice</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h2 className="text-xl mb-1">Completá tu registro</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Te invitó <span className="text-foreground">{invitedByName}</span>.
        </p>

        <dl className="space-y-2 mb-6 text-sm bg-muted/40 rounded-lg p-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-right">{email}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Rol asignado</dt>
            <dd className="inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-primary" />
              {roleLabels[role]}
            </dd>
          </div>
        </dl>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
            />
            <Input
              label="Nombre"
              autoComplete="name"
              autoFocus
              error={errors.name?.message}
              className="pl-9"
              {...register('name', {
                required: 'Nombre requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 100, message: 'Máximo 100 caracteres' },
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
              autoComplete="new-password"
              error={errors.password?.message}
              className="pl-9"
              {...register('password', {
                required: 'Contraseña requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 128, message: 'Máximo 128 caracteres' },
              })}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-2">
            {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>
      </div>
    </CenteredCard>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function renderInvalid(message: string) {
  return (
    <div className="text-center space-y-4">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">{message}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Pedile al admin que te envíe una nueva invitación.
        </p>
      </div>
    </div>
  );
}
