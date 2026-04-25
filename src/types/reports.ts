export interface SalesReportItem {
  /** ISO date string (YYYY-MM-DD) — one row per day */
  date: string;
  orders: number;
  /** Revenue in integer cents PEN */
  revenue: number;
}

export interface SalesReport {
  /** ISO date string (YYYY-MM-DD) */
  dateFrom: string;
  /** ISO date string (YYYY-MM-DD) */
  dateTo: string;
  totalOrders: number;
  /** Revenue in integer cents PEN */
  totalRevenue: number;
  items: SalesReportItem[];
}

export interface SalesReportQuery {
  /** ISO date string (YYYY-MM-DD) */
  dateFrom: string;
  /** ISO date string (YYYY-MM-DD) */
  dateTo: string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  /** Revenue in integer cents PEN */
  totalRevenue: number;
}
