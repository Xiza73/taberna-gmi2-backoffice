import { createRootRouteWithContext, createRoute } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { BrandsPage } from '@/pages/BrandsPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { ShippingPage } from '@/pages/ShippingPage';
import { PromotionsPage } from '@/pages/PromotionsPage';
import { UsersPage } from '@/pages/UsersPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { StoresPage } from '@/pages/StoresPage';
import { ReviewsPage } from '@/pages/ReviewsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

// Principal
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// Catálogo
const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesPage,
});

const brandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/brands',
  component: BrandsPage,
});

// Ventas
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: PaymentsPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shipping',
  component: ShippingPage,
});

const promotionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/promotions',
  component: PromotionsPage,
});

// Gestión
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

const storesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stores',
  component: StoresPage,
});

// Comunicación
const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: ReviewsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

// Reportes
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

// Sistema
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  productsRoute,
  categoriesRoute,
  brandsRoute,
  ordersRoute,
  paymentsRoute,
  shippingRoute,
  promotionsRoute,
  usersRoute,
  customersRoute,
  storesRoute,
  reviewsRoute,
  notificationsRoute,
  analyticsRoute,
  reportsRoute,
  settingsRoute,
]);
