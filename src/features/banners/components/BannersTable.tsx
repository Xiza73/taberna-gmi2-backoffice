import { useState } from 'react';
import { ExternalLink, ImageOff, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/utils/cn';
import { formatDate, formatInteger } from '@/utils/format';
import type { Banner } from '@/types/banners';
import { positionBadgeClass, positionLabels } from '../lib/position';

interface Props {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

function isExpired(banner: Banner): boolean {
  if (!banner.endDate) return false;
  return new Date(banner.endDate) < new Date();
}

export function BannersTable({ banners, onEdit, onDelete }: Props) {
  if (banners.length === 0) {
    return (
      <div className="border-t border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No hay banners para mostrar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]"></TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Posición</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Orden</TableHead>
          <TableHead className="text-right">Vigencia</TableHead>
          <TableHead className="text-right w-[120px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners.map((banner) => {
          const expired = isExpired(banner);
          return (
            <TableRow key={banner.id}>
              <TableCell>
                <BannerThumb url={banner.imageUrl} alt={banner.title} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{banner.title}</span>
                  {banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors max-w-[280px] truncate"
                    >
                      {banner.linkUrl}
                      <ExternalLink size={11} className="shrink-0" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    positionBadgeClass[banner.position],
                  )}
                >
                  {positionLabels[banner.position]}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center text-xs px-2 py-0.5 rounded',
                    !banner.isActive
                      ? 'bg-muted text-muted-foreground'
                      : expired
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-emerald-500/10 text-emerald-400',
                  )}
                >
                  {!banner.isActive ? 'Inactivo' : expired ? 'Expirado' : 'Activo'}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums text-sm">
                {formatInteger(banner.sortOrder)}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                {banner.startDate || banner.endDate ? (
                  <>
                    {banner.startDate ? formatDate(banner.startDate) : '∞'} →{' '}
                    {banner.endDate ? formatDate(banner.endDate) : '∞'}
                  </>
                ) : (
                  <span>Sin fechas</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(banner)}
                    className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Editar ${banner.title}`}
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(banner)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Eliminar ${banner.title}`}
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function BannerThumb({ url, alt }: { url: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-24 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
        <ImageOff size={14} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={96}
      height={48}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-24 h-12 rounded object-cover bg-muted"
    />
  );
}
