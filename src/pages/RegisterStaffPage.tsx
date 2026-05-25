import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2, Lock, Mail, ShieldCheck, Sparkles, User } from 'lucide-react';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authKeys } from '@/features/auth';
import {
  roleLabels,
  useRegisterStaff,
  useValidateInvitation,
} from '@/features/staff';

function parseToken(searchStr: string): string | undefined {
  const params = new URLSearchParams(searchStr);
  const token = params.get('token');
  return token && token.length > 0 ? token : undefined;
}

interface InvitedFormValues {
  name: string;
  password: string;
}

interface BootstrapFormValues {
  name: string;
  email: string;
  password: string;
}

export function RegisterStaffPage() {
  const location = useLocation();
  const token = parseToken(location.searchStr);

  // Con token → flujo de invitación: validamos el token primero para
  // mostrar el email/rol en pantalla y bloquear si está expirado.
  // Sin token → flujo de bootstrap: el primer SUPER_ADMIN del sistema.
  if (token) {
    return <InvitationRegister token={token} />;
  }

  return <BootstrapRegister />;
}

function InvitationRegister({ token }: { token: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const validateQuery = useValidateInvitation(token);
  const registerMutation = useRegisterStaff();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvitedFormValues>({ defaultValues: { name: '', password: '' } });

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

  const onSubmit = async (values: InvitedFormValues) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name.trim(),
        email,
        password: values.password,
        invitationToken: token,
      });
      await qc.invalidateQueries({ queryKey: authKeys.me });
      toast.success('Cuenta creada. ¡Bienvenido!');
      void navigate({ to: '/' });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'No se pudo completar el registro';
      toast.error(message);
    }
  };

  const isPending = registerMutation.isPending;

  return (
    <CenteredCard>
      <BrandHeader />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h2 className="text-xl mb-1">Completa tu registro</h2>
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

function BootstrapRegister() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const registerMutation = useRegisterStaff();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BootstrapFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: BootstrapFormValues) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      await qc.invalidateQueries({ queryKey: authKeys.me });
      toast.success('Super admin creado. ¡Bienvenido!');
      void navigate({ to: '/' });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo completar el registro';
      toast.error(message);
    }
  };

  const isPending = registerMutation.isPending;

  return (
    <CenteredCard>
      <BrandHeader />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-primary" />
          <h2 className="text-xl">Crear primer administrador</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          El sistema todavía no tiene cuentas. La primera persona que se
          registre queda como <span className="text-foreground">super admin</span>
          {' '}— a partir del segundo usuario el registro requiere invitación.
        </p>

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
            <Mail
              size={16}
              className="absolute left-3 top-[38px] text-muted-foreground pointer-events-none"
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              className="pl-9"
              {...register('email', {
                required: 'Email requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido',
                },
                maxLength: { value: 255, message: 'Máximo 255 caracteres' },
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
            {isPending ? 'Creando cuenta…' : 'Crear super admin'}
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

function BrandHeader() {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl tracking-tight">
        <span className="text-primary">E</span>
        <span className="text-foreground">Commerce</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-1">Backoffice</p>
    </div>
  );
}

function renderInvalid(message: string) {
  return (
    <div className="text-center space-y-4">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">{message}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Pídele al admin que te envíe una nueva invitación.
        </p>
      </div>
    </div>
  );
}
