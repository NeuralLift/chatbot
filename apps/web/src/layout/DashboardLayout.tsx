import { lazy, Suspense } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import TopLoader from '@/components/TopLoader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const AppSidebar = lazy(() => import('@/components/dashboard/sidebar/Sidebar'));
const Header = lazy(() => import('@/components/dashboard/sidebar/Header'));

export default function DashboardLayout() {
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  return (
    <SidebarProvider>
      <Suspense fallback={<TopLoader isLoading />}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <Suspense>
          <Header />
        </Suspense>
        <Outlet />
      </SidebarInset>
      <TopLoader isLoading={isMutating > 0 || isFetching > 0} />
    </SidebarProvider>
  );
}
