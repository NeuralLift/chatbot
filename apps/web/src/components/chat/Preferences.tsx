import type React from 'react';
import { memo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard, Settings, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAgentStore } from '@/hooks/useAgent';
import { API } from '@/lib/api';
import { cn } from '@/lib/utils';

type Tab = {
  id: string;
  label: string;
  icon: React.ElementType;
  content: React.JSX.Element;
};

const BillingContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Billing Information</h3>
      <p className="text-muted-foreground text-sm">
        Manage your billing information and view your subscription.
      </p>
      <div className="border-muted rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Pro Plan</p>
            <p className="text-muted-foreground text-xs">$15/month</p>
          </div>
          <Button size="sm" variant="outline">
            Change Plan
          </Button>
        </div>
      </div>
      <div className="border-muted rounded-md border p-4">
        <p className="text-sm font-medium">Payment Method</p>
        <div className="mt-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <p className="text-sm">•••• •••• •••• 4242</p>
        </div>
      </div>
    </div>
  );
};

const AccountContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Account Settings</h3>
      <p className="text-muted-foreground text-sm">
        Manage your account settings and preferences.
      </p>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            placeholder="Your name"
            defaultValue="John Doe"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            placeholder="Your email"
            defaultValue="john.doe@example.com"
          />
        </div>
      </div>
    </div>
  );
};

const SettingsContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">General Settings</h3>
      <p className="text-muted-foreground text-sm">
        Configure your application preferences.
      </p>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Email Notifications</p>
            <p className="text-muted-foreground text-xs">
              Receive email notifications for important updates.
            </p>
          </div>
          <div className="bg-primary h-6 w-10 rounded-full p-0.5">
            <div className="h-5 w-5 translate-x-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-muted-foreground text-xs">
              Switch between light and dark themes.
            </p>
          </div>
          <div className="bg-muted h-6 w-10 rounded-full p-0.5">
            <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentsContent = () => {
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: API.agent.getAllAgents,
    refetchOnWindowFocus: false,
  });

  const { agentId, setAgent } = useAgentStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Agents Settings</h3>
      <p className="text-muted-foreground text-sm">
        Configure your agent preferences.
      </p>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Select
            defaultValue={agentId}
            onValueChange={(v) => {
              setAgent(v);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {agentsData?.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const tabs: Tab[] = [
  {
    id: 'account',
    label: 'Account',
    icon: User,
    content: <AccountContent />,
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    content: <BillingContent />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    content: <SettingsContent />,
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: Bot,
    content: <AgentsContent />,
  },
];

function Preferences() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={'circle'}>
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-h-[600px] w-[95vw] max-w-[800px] md:h-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex h-[500px] flex-col md:flex-row md:gap-6">
          {/* Mobile tab selector (visible only on small screens) */}
          <div className="mb-4 border-b p-2 md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {tabs.find((tab) => tab.id === activeTab)?.label ||
                    'Select tab'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop sidebar (hidden on mobile) */}
          <div className="hidden w-1/4 shrink-0 border-r pr-4 md:block">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content area (full width on mobile) */}
          <div className="flex-1 overflow-auto p-1">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

Preferences.displayName = 'Preferences';

export default memo(Preferences);
