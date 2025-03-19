import { lazy, Suspense } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import TopLoader from '@/components/TopLoader';
import { SidebarProvider } from '@/components/ui/sidebar';

const ChatSidebar = lazy(() => import('@/components/chat/sidebar/ChatSidebar'));

export default function ChatLayout() {
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  return (
    <SidebarProvider>
      <div className="flex max-h-dvh w-full overflow-hidden">
        <Suspense fallback={<TopLoader isLoading />}>
          <ChatSidebar />
        </Suspense>
        <main className="w-full min-w-0 max-w-full flex-1">
          <Outlet />
        </main>
      </div>
      <TopLoader isLoading={isMutating > 0 || isFetching > 0} />
    </SidebarProvider>
  );
}
