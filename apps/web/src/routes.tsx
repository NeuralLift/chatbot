import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { ComponentLoader } from '@/components/ComponentLoader';

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
          <Route
            index
            element={
              <Suspense fallback={<ComponentLoader />}>
                <HomePage />
              </Suspense>
            }
          />

          <Route
            path="chat"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <ChatLayout />
              </Suspense>
            }>
            <Route
              index
              element={
                <Suspense fallback={<ComponentLoader />}>
                  <NewChatPage />
                </Suspense>
              }
            />
            <Route
              path=":conversationId"
              element={
                <Suspense fallback={<ComponentLoader />}>
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
            <Suspense fallback={<ComponentLoader />}>
              <DashboardLayout />
            </Suspense>
          }>
          <Route
            index
            element={
              <Suspense fallback={<ComponentLoader />}>
                <OverviewPage />
              </Suspense>
            }
          />
          <Route
            path="conversations"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <ConversationsPage />
              </Suspense>
            }>
            <Route
              path=":id"
              element={
                <Suspense fallback={<ComponentLoader />}>
                  <ConversationsPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="agents"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <AgentsPage />
              </Suspense>
            }
          />
          <Route
            path="knowledge"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <KnowledgeBasePage />
              </Suspense>
            }
          />
          <Route
            path="integrations"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <IntegrationsPage />
              </Suspense>
            }
          />
          <Route
            path="builder"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <BuilderPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<ComponentLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* NOT FOUND PAGE */}
        <Route
          path="*"
          element={
            <Suspense fallback={<ComponentLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
