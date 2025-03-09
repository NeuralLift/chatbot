import { BrowserRouter } from 'react-router';

import ReactQueryProvider from '@/components/ReactQueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ReactQueryProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
