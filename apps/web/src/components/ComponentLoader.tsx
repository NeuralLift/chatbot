import { Loader2 } from 'lucide-react';

export const ComponentLoader = () => {
  return (
    <div className="mx-4 my-4 flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
};
