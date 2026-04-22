import { useRef } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/ui/Button';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  type UploadFolder,
  type UploadImageResponse,
} from '@/types/uploads';
import { useUploadImage } from '../hooks/useImageUpload';

interface Props {
  folder: UploadFolder;
  onUploaded: (response: UploadImageResponse) => void;
  disabled?: boolean;
  label?: string;
}

const acceptedAttr = ACCEPTED_IMAGE_MIME_TYPES.join(',');

export function ImageUploadButton({
  folder,
  onUploaded,
  disabled = false,
  label = 'Subir imagen',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useUploadImage();

  const isPending = mutation.isPending;

  const handleClick = () => {
    if (disabled || isPending) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-selecting same file
    if (!file) return;

    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type as never)) {
      toast.error('Formato no permitido. Usá JPG, PNG o WEBP.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('La imagen supera el límite de 5MB.');
      return;
    }

    try {
      const result = await mutation.mutateAsync({ file, folder });
      onUploaded(result);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'No se pudo subir la imagen';
      toast.error(message);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedAttr}
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={handleClick}
        disabled={disabled || isPending}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Subiendo…</span>
          </>
        ) : (
          <>
            <ImagePlus size={16} />
            <span>{label}</span>
          </>
        )}
      </Button>
    </>
  );
}
