import { FileText, X } from 'lucide-react';

import type { Attachment } from '@/hooks/useMediaUpload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type AttachmentsProps = {
  attachments: Attachment[];
  removeAttachment: (name: string) => void;
};

export function Attachments({
  attachments,
  removeAttachment,
}: AttachmentsProps) {
  return (
    <div className="flex size-10 flex-col gap-2">
      {attachments.map((attachment) => (
        <TooltipProvider key={attachment.file.name} delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-accent group relative flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-md">
                <FileText className="size-6" />
                <div className="absolute -right-2 -top-2">
                  <button
                    onClick={() => removeAttachment(attachment.file.name)}
                    className="bg-primary text-background hidden size-5 items-center justify-center rounded-full group-hover:flex">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-primary text-background">
              <p>{attachment.file.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
