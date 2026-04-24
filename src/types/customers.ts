export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
}
