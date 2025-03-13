import { Link } from 'react-router';

import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MenuButton } from './MenuButton';
import { NewChatButton } from './NewChatButton';

export default function Header() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Only show on mobile screen */}
      {isMobile && (
        <header className="bg-sidebar sticky top-0 z-10 flex h-12 shrink-0 items-center">
          <div className="flex flex-1 items-center justify-between gap-2 px-3">
            <MenuButton />
            <Link to={'/chat'}>
              <span className="text-balance text-xl font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100">
                NeuralLift
              </span>
            </Link>

            <NewChatButton />
          </div>
        </header>
      )}

      <header className="bg-sidebar sticky top-0 z-10 flex h-12 shrink-0 items-center max-md:hidden">
        <div className="flex items-center gap-2 px-3">
          {!open && (
            <>
              <MenuButton />
              <NewChatButton />
            </>
          )}

          <Link to={'/chat'}>
            <span className="text-balance text-xl font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100">
              NeuralLift
            </span>
          </Link>
        </div>
      </header>
    </>
  );
}
