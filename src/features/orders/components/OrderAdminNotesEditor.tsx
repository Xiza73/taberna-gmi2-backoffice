import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useUpdateOrderNotes } from '../hooks/useOrderMutations';

interface Props {
  orderId: string;
  initialAdminNotes: string | null;
}

export function OrderAdminNotesEditor({ orderId, initialAdminNotes }: Props) {
  const [draft, setDraft] = useState(initialAdminNotes ?? '');
  const updateMutation = useUpdateOrderNotes(orderId);

  useEffect(() => {
    setDraft(initialAdminNotes ?? '');
  }, [initialAdminNotes]);

  const dirty = draft !== (initialAdminNotes ?? '');
  const isPending = updateMutation.isPending;

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ adminNotes: draft });
      toast.success('Notas internas guardadas');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudieron guardar';
      toast.error(message);
    }
  };

  const handleRevert = () => {
    setDraft(initialAdminNotes ?? '');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm text-muted-foreground">Notas internas</h3>
        <span className="text-xs text-muted-foreground">Solo visible para staff</span>
      </div>
      <Textarea
        rows={4}
        placeholder="Anotaciones internas sobre este pedido…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        maxLength={2000}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        {dirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRevert}
            disabled={isPending}
          >
            Descartar
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => void handleSave()}
          disabled={!dirty || isPending}
        >
          {isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
}
