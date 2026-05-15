import { useAuth } from '@/features/auth';
import {
  ChangePasswordForm,
  ProfileForm,
  StoreSettingsForm,
} from '@/features/settings';

export function SettingsPage() {
  const { me, isLoading } = useAuth();
  const canViewStore = me?.role === 'super_admin' || me?.role === 'admin';
  const canEditStore = me?.role === 'super_admin';

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">Configuración</h2>
          <p className="text-sm text-muted-foreground">
            Tus datos de staff, seguridad y configuración general de la tienda.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {isLoading ? (
          <SettingsSkeleton />
        ) : me ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
              <SectionCard title="Mi perfil">
                <ProfileForm me={me} />
              </SectionCard>
              <SectionCard title="Cambiar contraseña">
                <ChangePasswordForm />
              </SectionCard>
            </div>

            {canViewStore && (
              <div className="max-w-4xl">
                <SectionCard title="Configuración de tienda">
                  <StoreSettingsForm canEdit={canEditStore} />
                </SectionCard>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-4">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function SettingsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl animate-pulse">
      <div className="h-72 rounded-lg border border-border bg-card/50" />
      <div className="h-72 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
