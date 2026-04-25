import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { ImageUploadButton } from '@/features/uploads';

interface Props {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function BannerImagePicker({ value, onChange, disabled = false }: Props) {
  const [errored, setErrored] = useState(false);
  const hasImage = value.trim() !== '' && !errored;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-muted overflow-hidden aspect-[3/1] flex items-center justify-center">
        {hasImage ? (
          <img
            src={value}
            alt="Banner"
            className="w-full h-full object-cover"
            onError={() => setErrored(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageOff size={28} />
            <span className="text-xs">
              {errored ? 'No se pudo cargar la imagen' : 'Sin imagen'}
            </span>
          </div>
        )}
      </div>

      <ImageUploadButton
        folder="banners"
        onUploaded={(r) => {
          setErrored(false);
          onChange(r.url);
        }}
        disabled={disabled}
        label={hasImage ? 'Cambiar imagen' : 'Subir imagen'}
      />
    </div>
  );
}
