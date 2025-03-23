import { lazy } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';

import ReactQueryProvider from '@/components/ReactQueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AppRoutes } from '@/routes';

const ErrorPage = lazy(() => import('@/components/ErrorPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ReactQueryProvider>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary, error }) => (
                <ErrorPage error={error} resetBoundary={resetErrorBoundary} />
              )}>
              <BrowserRouter>
                <AppRoutes />
                <Toaster position="top-center" richColors />
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
