import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ImageOff, X } from 'lucide-react';
import { useState } from 'react';
import { ImageUploadButton } from '@/features/uploads';
import { cn } from '@/utils/cn';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export function ProductImageGallery({ value, onChange, disabled = false }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(active.id as string);
    const newIndex = value.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(value, oldIndex, newIndex));
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const handleUploaded = (url: string) => {
    if (value.includes(url)) return;
    onChange([...value, url]);
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {value.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  isPrimary={index === 0}
                  disabled={disabled}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex items-center gap-3">
        <ImageUploadButton
          folder="products"
          onUploaded={(r) => handleUploaded(r.url)}
          disabled={disabled}
          label={value.length === 0 ? 'Subir primera imagen' : 'Agregar imagen'}
        />
        {value.length > 0 && (
          <p className="text-xs text-muted-foreground">
            La primera imagen se muestra como principal. Arrastrá para reordenar.
          </p>
        )}
      </div>
    </div>
  );
}

interface SortableImageProps {
  url: string;
  isPrimary: boolean;
  disabled: boolean;
  onRemove: (url: string) => void;
}

function SortableImage({ url, isPrimary, disabled, onRemove }: SortableImageProps) {
  const [errored, setErrored] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square"
    >
      {errored ? (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <ImageOff size={20} />
        </div>
      ) : (
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}

      {isPrimary && (
        <span className="absolute top-1 left-1 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
          Principal
        </span>
      )}

      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        className={cn(
          'absolute bottom-1 left-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity',
          isDragging && 'opacity-100 cursor-grabbing',
          !isDragging && 'cursor-grab',
        )}
        aria-label="Reordenar"
      >
        <GripVertical size={14} />
      </button>

      <button
        type="button"
        onClick={() => onRemove(url)}
        disabled={disabled}
        className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-destructive disabled:opacity-30"
        aria-label="Quitar imagen"
      >
        <X size={14} />
      </button>
    </div>
  );
}
