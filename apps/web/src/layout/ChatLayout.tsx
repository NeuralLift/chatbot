import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

import { ComponentLoader } from '@/components/ComponentLoader';
import { SidebarProvider } from '@/components/ui/sidebar';

const ChatSidebar = lazy(() => import('@/components/chat/sidebar/ChatSidebar'));

export default function ChatLayout() {
  return (
    <SidebarProvider>
      <div className="flex max-h-screen w-full overflow-hidden">
        <Suspense fallback={<ComponentLoader />}>
          <ChatSidebar />
        </Suspense>
        <main className="w-full min-w-0 max-w-full flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
