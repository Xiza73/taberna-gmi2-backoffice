import { type LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, subtitle, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6">
          <h2 className="text-2xl lg:text-3xl mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-border bg-card/50 gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Sección en construcción</p>
        </div>
      </div>
    </div>
  );
}
