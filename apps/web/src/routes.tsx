import { Route, Routes } from 'react-router';

import NotFound from '@/components/NotFound';
import DashboardLayout from '@/layout/DashboardLayout';
import AgentsPage from '@/pages/Agents';
import BuilderPage from '@/pages/Builder';
import ChatPage from '@/pages/Chat';
import ConversationsPage from '@/pages/Conversations';
import HomePage from '@/pages/Home';
import IntegrationsPage from '@/pages/Integrations';
import KnowledgeBasePage from '@/pages/KnowledgeBase';
import OverviewPage from '@/pages/Overview';
import SettingsPage from '@/pages/Settings';

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route>
          {/* LANDING PAGE */}
          <Route index element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
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
