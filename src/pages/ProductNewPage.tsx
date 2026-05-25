import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ProductForm } from '@/features/products/components/ProductForm';

export function ProductNewPage() {
  const navigate = useNavigate();

  const goBack = () => {
    void navigate({ to: '/products' });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="p-4 pl-16 lg:pl-6 lg:p-6 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl lg:text-3xl mb-1">Nuevo producto</h2>
            <p className="text-sm text-muted-foreground">
              Completa los datos para agregar un producto al catálogo.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <ProductForm mode="create" onSuccess={goBack} onCancel={goBack} />
      </div>
    </div>
  );
}
