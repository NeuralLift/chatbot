import { HelpCircle } from 'lucide-react';

import { FormLabel } from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const FormLabelWithTooltip = ({
  label,
  name,
}: {
  label: string;
  name: string;
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      <FormLabel asChild>
        <legend>{label}</legend>
      </FormLabel>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild className="max-sm:hidden">
            <HelpCircle className="text-muted-foreground h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
