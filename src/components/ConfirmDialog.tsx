import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

type ConfirmVariant = 'destructive' | 'primary';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: ConfirmVariant;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Eliminar',
  variant = 'destructive',
}: ConfirmDialogProps) {
  const iconBgClass =
    variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10';
  const iconColor =
    variant === 'destructive' ? 'text-destructive' : 'text-primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center mx-auto`}>
          <AlertTriangle className={iconColor} size={24} />
        </div>
        <p className="text-muted-foreground">{message}</p>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button variant={variant} onClick={onConfirm} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
