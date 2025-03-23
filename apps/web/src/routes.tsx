import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import TopLoader from '@/components/TopLoader';

const NotFound = lazy(() => import('@/pages/NotFound'));
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
          <Route
            index
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <HomePage />
              </Suspense>
            }
          />

          <Route
            path="chat"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <ChatLayout />
              </Suspense>
            }>
            <Route
              index
              element={
                <Suspense fallback={<TopLoader isLoading />}>
                  <NewChatPage />
                </Suspense>
              }
            />
            <Route
              path=":conversationId"
              element={
                <Suspense fallback={<TopLoader isLoading />}>
                  <ChatPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* AUTHENTICATION PAGE */}
        {/* <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}

        {/* DASHBOARD PAGE */}
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<TopLoader isLoading />}>
              <DashboardLayout />
            </Suspense>
          }>
          <Route
            index
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <OverviewPage />
              </Suspense>
            }
          />
          <Route
            path="conversations"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <ConversationsPage />
              </Suspense>
            }>
            <Route
              path=":id"
              element={
                <Suspense fallback={<TopLoader isLoading />}>
                  <ConversationsPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="agents"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <AgentsPage />
              </Suspense>
            }
          />
          <Route
            path="knowledge"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <KnowledgeBasePage />
              </Suspense>
            }
          />
          <Route
            path="integrations"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <IntegrationsPage />
              </Suspense>
            }
          />
          <Route
            path="builder"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <BuilderPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<TopLoader isLoading />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* NOT FOUND PAGE */}
        <Route
          path="*"
          element={
            <Suspense fallback={<TopLoader isLoading />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
