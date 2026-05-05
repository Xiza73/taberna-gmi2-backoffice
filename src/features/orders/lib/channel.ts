import type { OrderChannel } from '@/types/orders';

export const ORDER_CHANNELS: OrderChannel[] = ['online', 'pos', 'whatsapp'];

export const channelLabels: Record<OrderChannel, string> = {
  online: 'Online',
  pos: 'POS',
  whatsapp: 'WhatsApp',
};

export const channelBadgeClass: Record<OrderChannel, string> = {
  online: 'bg-blue-500/10 text-blue-400',
  pos: 'bg-amber-500/10 text-amber-400',
  whatsapp: 'bg-emerald-500/10 text-emerald-400',
};
