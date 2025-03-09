import { BadgeStatus } from '@/components/knowledge/BadgeStatus';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatRelativeDate } from '@/lib/utils';
import { useDetailsAgentModalStore } from './useDetailsAgentModal';

export default function DetailsAgentModal() {
  const { open, handleClose, agent } = useDetailsAgentModalStore();

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="custom-scrollbar max-h-screen w-full overflow-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Agent Settings</SheetTitle>
          <SheetDescription>
            View and manage settings for {agent.name}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h3 className="font-medium">Basic Information</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatRelativeDate(agent.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <BadgeStatus status={agent.active ? 'active' : 'inactive'} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span>{agent.successRate}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Model Configuration</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <Badge variant="outline">{agent.model}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature</span>
                <span>{agent.temperature}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Knowledge Base Access</h3>
            <div className="flex flex-wrap gap-2">
              {agent.datasources.length === 0 && (
                <Badge variant="outline">No knowledge bases</Badge>
              )}

              {agent.datasources.map((kb) => (
                <Badge key={kb.id} variant="secondary">
                  {kb.category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">System Prompt</h3>
            <Card>
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {agent.system_prompt}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
