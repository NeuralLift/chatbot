import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

import { ComponentLoader } from '@/components/ComponentLoader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const AppSidebar = lazy(() => import('@/components/dashboard/sidebar/Sidebar'));
const Header = lazy(() => import('@/components/dashboard/sidebar/Header'));

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <Suspense fallback={<ComponentLoader />}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <Suspense>
          <Header />
        </Suspense>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
