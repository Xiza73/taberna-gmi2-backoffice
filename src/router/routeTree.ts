import {
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthedLayout } from '@/layouts/AuthedLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
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
import { LoginPage } from '@/pages/LoginPage';
import { authKeys } from '@/features/auth';
import { staffAuthApi } from '@/api/staffAuthApi';

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

// --- Authed group (pathless layout with guard) ---
const authedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authed',
  component: AuthedLayout,
  beforeLoad: async ({ context, location }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: authKeys.me,
        queryFn: staffAuthApi.me,
        staleTime: 30_000,
      });
    } catch {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/',
  component: DashboardPage,
});

const productsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/categories',
  component: CategoriesPage,
});

const brandsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/brands',
  component: BrandsPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/orders',
  component: OrdersPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/payments',
  component: PaymentsPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/shipping',
  component: ShippingPage,
});

const promotionsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/promotions',
  component: PromotionsPage,
});

const usersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/users',
  component: UsersPage,
});

const customersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/customers',
  component: CustomersPage,
});

const storesRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/stores',
  component: StoresPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/reviews',
  component: ReviewsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/reports',
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

// --- Public group (login; redirects to / if already authed) ---
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
  beforeLoad: async ({ context }) => {
    const cached = context.queryClient.getQueryData(authKeys.me);
    if (cached) throw redirect({ to: '/' });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
});

export const routeTree = rootRoute.addChildren([
  authedLayoutRoute.addChildren([
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
  ]),
  publicLayoutRoute.addChildren([loginRoute]),
]);
