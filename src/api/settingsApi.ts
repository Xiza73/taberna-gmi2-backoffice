import type {
  StoreSettings,
  UpdateStoreSettingsInput,
} from '@/types/settings';
import { apiClient } from './client';

export const settingsApi = {
  get(): Promise<StoreSettings> {
    return apiClient.get<StoreSettings>('/admin/settings');
  },

  update(input: UpdateStoreSettingsInput): Promise<StoreSettings> {
    return apiClient.patch<StoreSettings>('/admin/settings', input);
  },
};
