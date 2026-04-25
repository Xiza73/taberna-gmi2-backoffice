import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { roleLabels } from '@/features/staff';
import { cn } from '@/utils/cn';
import type { StaffMe } from '@/types/auth';
import { useUpdateProfile } from '../hooks/useStaffProfileMutations';

interface Props {
  me: StaffMe;
}

interface FormValues {
  name: string;
}

export function ProfileForm({ me }: Props) {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: me.name } });

  useEffect(() => {
    reset({ name: me.name });
  }, [me.name, reset]);

  const currentName = watch('name');
  const dirty = currentName.trim() !== me.name;

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync({ name: values.name.trim() });
      toast.success('Perfil actualizado');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo actualizar';
      toast.error(message);
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nombre"
        error={errors.name?.message}
        {...register('name', {
          required: 'Nombre requerido',
          maxLength: { value: 255, message: 'Máximo 255 caracteres' },
        })}
      />

      <ReadOnlyField icon={<Mail size={14} />} label="Email" value={me.email} />
      <ReadOnlyField
        icon={<ShieldCheck size={14} />}
        label="Rol"
        value={roleLabels[me.role]}
      />

      <p className="text-xs text-muted-foreground">
        Email y rol los gestiona un super admin desde la sección Staff.
      </p>

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        {dirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => reset({ name: me.name })}
            disabled={isPending}
          >
            Descartar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!dirty || isPending}
        >
          {isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}

interface ReadOnlyFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ReadOnlyField({ icon, label, value }: ReadOnlyFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-muted-foreground">{label}</label>
      <div
        className={cn(
          'h-[38px] px-4 flex items-center gap-2 bg-muted/40 border border-border rounded-lg text-sm text-muted-foreground',
        )}
      >
        <span className="text-muted-foreground">{icon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
