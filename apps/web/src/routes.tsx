import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const NotFound = lazy(() => import('@/components/NotFound'));
const ChatLayout = lazy(() => import('@/layout/ChatLayout'));
const DashboardLayout = lazy(() => import('@/layout/DashboardLayout'));
const AgentsPage = lazy(() => import('@/pages/Agents'));
const BuilderPage = lazy(() => import('@/pages/Builder'));
const ChatPage = lazy(() => import('@/pages/Chat'));
const ConversationsPage = lazy(() => import('@/pages/Conversations'));
const HomePage = lazy(() => import('@/pages/Home'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));
const KnowledgeBasePage = lazy(() => import('@/pages/KnowledgeBase'));
const NewChatPage = lazy(() => import('@/pages/NewChatPage'));
const OverviewPage = lazy(() => import('@/pages/Overview'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route>
          {/* LANDING PAGE */}
          <Route index element={<HomePage />} />

          <Route path="chat" element={<ChatLayout />}>
            <Route index element={<NewChatPage />} />
            <Route path=":conversationId" element={<ChatPage />} />
          </Route>
        </Route>

        {/* AUTHENTICATION PAGE */}
        {/* <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}

        {/* DASHBOARD PAGE */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="conversations" element={<ConversationsPage />}>
            <Route path=":id" element={<ConversationsPage />} />
          </Route>
          <Route path="agents" element={<AgentsPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="builder" element={<BuilderPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* NOT FOUND PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
