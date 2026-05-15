export interface StoreSettings {
  id: string;
  storeName: string;
  legalName: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  ruc: string | null;
  currency: string;
  igvPercentage: number;
  logoUrl: string | null;
  faviconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreSettingsInput {
  storeName?: string;
  legalName?: string | null;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  ruc?: string | null;
  currency?: string;
  igvPercentage?: number;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}
