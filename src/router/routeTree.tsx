import { lazy, Suspense, type ComponentType, type FC } from 'react';
import {
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthedLayout } from '@/layouts/AuthedLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProductsPage } from '@/pages/ProductsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { ShippingPage } from '@/pages/ShippingPage';
import { UsersPage } from '@/pages/UsersPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { ReviewsPage } from '@/pages/ReviewsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { CustomerDetailPage } from '@/pages/CustomerDetailPage';
import { CashRegistersPage } from '@/pages/CashRegistersPage';
import { CashRegisterDetailPage } from '@/pages/CashRegisterDetailPage';
import { PosReportsPage } from '@/pages/PosReportsPage';
import { CouponsPage } from '@/pages/CouponsPage';
import { BannersPage } from '@/pages/BannersPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterStaffPage } from '@/pages/RegisterStaffPage';
import { authKeys } from '@/features/auth';
import { staffAuthApi } from '@/api/staffAuthApi';

// --- Lazy-loaded pages (split heavy deps: recharts, @dnd-kit) ---
const DashboardPageLazy = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ReportsPageLazy = lazy(() =>
  import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
const ProductNewPageLazy = lazy(() =>
  import('@/pages/ProductNewPage').then((m) => ({ default: m.ProductNewPage })),
);
const ProductEditPageLazy = lazy(() =>
  import('@/pages/ProductEditPage').then((m) => ({ default: m.ProductEditPage })),
);

function PageFallback() {
  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-1/3 rounded-md bg-muted/40" />
        <div className="h-64 rounded-lg border border-border bg-card/50" />
        <div className="h-32 rounded-lg border border-border bg-card/50" />
      </div>
    </div>
  );
}

function withSuspense<P extends object>(
  LazyComp: ComponentType<P>,
): FC<P> {
  const Wrapped: FC<P> = (props) => (
    <Suspense fallback={<PageFallback />}>
      <LazyComp {...props} />
    </Suspense>
  );
  Wrapped.displayName = `WithSuspense(${LazyComp.displayName ?? 'Lazy'})`;
  return Wrapped;
}

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
  component: withSuspense(DashboardPageLazy),
});

const productsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const productNewRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/products/new',
  component: withSuspense(ProductNewPageLazy),
});

const productEditRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/products/$productId/edit',
  component: withSuspense(ProductEditPageLazy),
});

const categoriesRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/categories',
  component: CategoriesPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/orders',
  component: OrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/orders/$orderId',
  component: OrderDetailPage,
});

const cashRegistersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/cash-registers',
  component: CashRegistersPage,
});

const cashRegisterDetailRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/cash-registers/$registerId',
  component: CashRegisterDetailPage,
});

const posReportsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/pos-reports',
  component: PosReportsPage,
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

const couponsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/coupons',
  component: CouponsPage,
});

const bannersRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/banners',
  component: BannersPage,
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

const customerDetailRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/reviews',
  component: ReviewsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => authedLayoutRoute,
  path: '/reports',
  component: withSuspense(ReportsPageLazy),
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

// --- Staff register (public, NO redirect-if-authed) ---
// Lives directly under root so accepting an invite while logged-in as someone
// else replaces the session cleanly without bouncing back to /.
const staffRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/register',
  component: RegisterStaffPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
});

export const routeTree = rootRoute.addChildren([
  authedLayoutRoute.addChildren([
    dashboardRoute,
    productsRoute,
    productNewRoute,
    productEditRoute,
    categoriesRoute,
    ordersRoute,
    orderDetailRoute,
    cashRegistersRoute,
    cashRegisterDetailRoute,
    posReportsRoute,
    paymentsRoute,
    shippingRoute,
    couponsRoute,
    bannersRoute,
    usersRoute,
    customersRoute,
    customerDetailRoute,
    reviewsRoute,
    reportsRoute,
    settingsRoute,
  ]),
  publicLayoutRoute.addChildren([loginRoute]),
  staffRegisterRoute,
]);
