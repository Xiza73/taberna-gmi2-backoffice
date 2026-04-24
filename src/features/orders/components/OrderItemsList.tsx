import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { formatInteger, formatPEN } from '@/utils/format';
import type { OrderItem } from '@/types/orders';

interface Props {
  items: OrderItem[];
}

export function OrderItemsList({ items }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 lg:px-5 py-3 border-b border-border">
        <h3 className="text-sm text-muted-foreground">
          {items.length === 1 ? '1 producto' : `${items.length} productos`}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Precio unit.</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <ItemThumb url={item.productImage} alt={item.productName} />
              </TableCell>
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatInteger(item.quantity)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatPEN(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {formatPEN(item.subtotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ItemThumb({ url, alt }: { url: string | null; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (!url || errored) {
    return (
      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
        <ImageOff size={14} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={40}
      height={40}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-10 h-10 rounded-md object-cover bg-muted"
    />
  );
}
