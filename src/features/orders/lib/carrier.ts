import type { Carrier } from '@/types/shipments';

export const CARRIERS: Carrier[] = ['shalom', 'serpost', 'olva', 'dhl', 'other'];

export const carrierLabels: Record<Carrier, string> = {
  shalom: 'Shalom',
  serpost: 'SerPost',
  olva: 'Olva Courier',
  dhl: 'DHL',
  other: 'Otro',
};
