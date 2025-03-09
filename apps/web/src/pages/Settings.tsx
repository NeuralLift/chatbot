import { ChevronDown } from 'lucide-react';

import type { Theme } from '@/components/ThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your AI support agent configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* General Settings */}
            <Collapsible className="group">
              <CollapsibleTrigger className="flex w-full items-center justify-between border-b pb-4 text-left">
                <span>General Settings</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 p-4">
                <p className="text-muted-foreground text-sm">
                  Manage basic configurations.
                </p>
              </CollapsibleContent>
            </Collapsible>

            {/* Theme Settings */}
            <Collapsible className="group">
              <CollapsibleTrigger className="flex w-full items-center justify-between border-b pb-4 text-left">
                <span>Appearance</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 p-4">
                <p className="text-muted-foreground text-sm">
                  Choose your theme preference.
                </p>
                <Select
                  defaultValue={theme}
                  onValueChange={(v) => setTheme(v as Theme)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>

            {/* Notification Settings */}
            <Collapsible className="group">
              <CollapsibleTrigger className="flex w-full items-center justify-between border-b pb-4 text-left">
                <span>Notifications</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 p-4">
                <p className="text-muted-foreground text-sm">
                  Control how you receive alerts.
                </p>
                <Button className="w-full">Manage Notifications</Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
