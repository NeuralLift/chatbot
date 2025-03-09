import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && (
        <header className="bg-sidebar sticky top-0 z-10 flex h-12 shrink-0 items-center">
          <div className="inline-flex items-center gap-2 px-3">
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              <Menu />
            </Button>
            <h1 className="text-balance text-xl font-bold">NeuralLift</h1>
          </div>
        </header>
      )}
    </>
  );
}
