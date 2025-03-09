import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  const shouldGoBack = () => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="bg-background flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="text-primary mx-auto h-12 w-12" />
        <h1 className="text-foreground mt-4 text-6xl font-bold tracking-tight sm:text-7xl">
          404
        </h1>
        <p className="text-muted-foreground mt-4 max-w-64 text-lg">
          Oops, it looks like the page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={() => shouldGoBack()}>
            <ChevronLeft /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
