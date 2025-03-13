import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const SearchButton = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <Search />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-background dark:bg-primary dark:text-background">
          <p>Search Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
