import { PenBox } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const NewChatButton = () => {
  const navigate = useNavigate();
  const handleNewChat = () => {
    navigate('/chat');
  };
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => handleNewChat()}>
            <PenBox />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-background dark:bg-primary dark:text-background">
          <p>New Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
