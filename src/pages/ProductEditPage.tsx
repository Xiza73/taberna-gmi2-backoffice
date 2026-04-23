import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useProduct } from '@/features/products/hooks/useProduct';

export function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ strict: false }) as { productId?: string };
  const productQuery = useProduct(productId);

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
          <div className="min-w-0">
            <h2 className="text-2xl lg:text-3xl mb-1 truncate">
              {productQuery.data ? productQuery.data.name : 'Editar producto'}
            </h2>
            <p className="text-sm text-muted-foreground">Editar datos del producto.</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {productQuery.isLoading ? (
          <ProductFormSkeleton />
        ) : productQuery.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">No se pudo cargar el producto.</p>
            <p className="text-xs text-muted-foreground mt-1">
              {productQuery.error instanceof Error
                ? productQuery.error.message
                : 'Error desconocido'}
            </p>
          </div>
        ) : productQuery.data ? (
          <ProductForm
            mode="edit"
            product={productQuery.data}
            onSuccess={goBack}
            onCancel={goBack}
          />
        ) : null}
      </div>
    </div>
  );
}

function ProductFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 rounded-lg border border-border bg-card/50" />
      <div className="h-48 rounded-lg border border-border bg-card/50" />
      <div className="h-32 rounded-lg border border-border bg-card/50" />
    </div>
  );
}
