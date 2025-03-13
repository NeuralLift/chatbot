import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const MenuButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-background dark:bg-primary dark:text-background">
          <p>Toogle Sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
