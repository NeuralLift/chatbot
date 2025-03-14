import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, LucideProps } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAgentStore } from '@/hooks/useAgent';
import { API } from '@/lib/api';
import {
  createTelegramIntegration,
  CreateTelegramIntegration,
} from '@/lib/schema/integration';
import { cn } from '@/lib/utils';
import { FormLabelWithTooltip } from '../FormLabelWithTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateIntegrationMutation } from './useCreateIntegrationMutation';

const TelegramLogo = (props?: LucideProps) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48">
      <linearGradient
        id="BiF7D16UlC0RZ_VqXJHnXa_oWiuH0jFiU0R_gr1"
        x1="9.858"
        x2="38.142"
        y1="9.858"
        y2="38.142"
        gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#33bef0"></stop>
        <stop offset="1" stopColor="#0a85d9"></stop>
      </linearGradient>
      <path
        fill="url(#BiF7D16UlC0RZ_VqXJHnXa_oWiuH0jFiU0R_gr1)"
        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
      <path
        d="M10.119,23.466c8.155-3.695,17.733-7.704,19.208-8.284c3.252-1.279,4.67,0.028,4.448,2.113	c-0.273,2.555-1.567,9.99-2.363,15.317c-0.466,3.117-2.154,4.072-4.059,2.863c-1.445-0.917-6.413-4.17-7.72-5.282	c-0.891-0.758-1.512-1.608-0.88-2.474c0.185-0.253,0.658-0.763,0.921-1.017c1.319-1.278,1.141-1.553-0.454-0.412	c-0.19,0.136-1.292,0.935-1.745,1.237c-1.11,0.74-2.131,0.78-3.862,0.192c-1.416-0.481-2.776-0.852-3.634-1.223	C8.794,25.983,8.34,24.272,10.119,23.466z"
        opacity=".05"></path>
      <path
        d="M10.836,23.591c7.572-3.385,16.884-7.264,18.246-7.813c3.264-1.318,4.465-0.536,4.114,2.011	c-0.326,2.358-1.483,9.654-2.294,14.545c-0.478,2.879-1.874,3.513-3.692,2.337c-1.139-0.734-5.723-3.754-6.835-4.633	c-0.86-0.679-1.751-1.463-0.71-2.598c0.348-0.379,2.27-2.234,3.707-3.614c0.833-0.801,0.536-1.196-0.469-0.508	c-1.843,1.263-4.858,3.262-5.396,3.625c-1.025,0.69-1.988,0.856-3.664,0.329c-1.321-0.416-2.597-0.819-3.262-1.078	C9.095,25.618,9.075,24.378,10.836,23.591z"
        opacity=".07"></path>
      <path
        fill="#fff"
        d="M11.553,23.717c6.99-3.075,16.035-6.824,17.284-7.343c3.275-1.358,4.28-1.098,3.779,1.91	c-0.36,2.162-1.398,9.319-2.226,13.774c-0.491,2.642-1.593,2.955-3.325,1.812c-0.833-0.55-5.038-3.331-5.951-3.984	c-0.833-0.595-1.982-1.311-0.541-2.721c0.513-0.502,3.874-3.712,6.493-6.21c0.343-0.328-0.088-0.867-0.484-0.604	c-3.53,2.341-8.424,5.59-9.047,6.013c-0.941,0.639-1.845,0.932-3.467,0.466c-1.226-0.352-2.423-0.772-2.889-0.932	C9.384,25.282,9.81,24.484,11.553,23.717z"></path>
    </svg>
  );
};

const WhatsappLogo = (props?: LucideProps) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48">
      <path
        fill="#fff"
        d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
      <path
        fill="#fff"
        d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
      <path
        fill="#cfd8dc"
        d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
      <path
        fill="#40c351"
        d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
        clipRule="evenodd"></path>
    </svg>
  );
};

const integrations = [
  {
    name: 'Telegram',
    description: 'Send and receive messages directly from Telegram',
    icon: TelegramLogo,
    status: 'active' as const,
    lastSync: '5 mins ago',
    category: 'Communication',
  },
  {
    name: 'Whatsapp',
    description: 'Send and receive messages directly from WhatsApp',
    icon: WhatsappLogo,
    status: 'inactive' as const,
    lastSync: '5 mins ago',
    category: 'Communication',
  },
  //   {
  //     name: 'Zendesk',
  //     description: 'Sync customer conversations and tickets with Zendesk',
  //     logo: '/logos/zendesk.svg',
  //     status: 'inactive' as const,
  //     lastSync: 'Never',
  //     category: 'Help Desk',
  //   },
  //   {
  //     name: 'Salesforce',
  //     description: 'Connect customer data with your Salesforce CRM',
  //     logo: '/logos/salesforce.svg',
  //     status: 'active' as const,
  //     lastSync: '1 hour ago',
  //     category: 'CRM',
  //   },
  //   {
  //     name: 'HubSpot',
  //     description: 'Sync contacts and companies with HubSpot CRM',
  //     logo: '/logos/hubspot.svg',
  //     status: 'pending' as const,
  //     lastSync: 'Connecting...',
  //     category: 'CRM',
  //   },
  //   {
  //     name: 'Intercom',
  //     description: 'Chat with customers through Intercom messenger',
  //     logo: '/logos/intercom.svg',
  //     status: 'inactive' as const,
  //     lastSync: 'Never',
  //     category: 'Communication',
  //   },
  //   {
  //     name: 'GitHub',
  //     description: 'Track issues and sync technical documentation',
  //     logo: '/logos/github.svg',
  //     status: 'active' as const,
  //     lastSync: '10 mins ago',
  //     category: 'Development',
  //   },
];

export default function Integrations() {
  const { mutate: createIntegrationMutation, isPending } =
    useCreateIntegrationMutation();
  const { agentId } = useAgentStore();

  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: API.agent.getAllAgents,
    refetchOnWindowFocus: false,
  });

  const form = useForm<CreateTelegramIntegration>({
    resolver: zodResolver(createTelegramIntegration),
    defaultValues: {
      token: window.localStorage.getItem('telegram_token') || '',
      userId: 'awd',
      agentId: agentId ?? agentsData?.[0]?.id,
    },
  });

  const onSubmit = (data: CreateTelegramIntegration) => {
    if (isPending) return;

    window.localStorage.setItem('telegram_token', data.token);

    createIntegrationMutation(data, {
      onSuccess: () => {
        toast.success('Success Initializing Telegram Integration');
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <Card
          key={integration.name}
          className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <div className="flex gap-1">
              <div className="flex items-center space-x-4">
                <div className="bg-background relative rounded-lg border p-2">
                  <integration.icon
                    className={cn('size-10', {
                      grayscale: integration.name === 'Whatsapp',
                    })}
                  />
                  <div
                    className={cn(
                      'border-background absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2',
                      integration.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    )}
                  />
                </div>
                <div>
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription>{integration.category}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {integration.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Last sync: {integration.lastSync}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={integration.name == 'Whatsapp'}>
                    Configure
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure {integration.name}</DialogTitle>
                    <DialogDescription>
                      Manage your {integration.name} integration
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4">
                      <FormField
                        name="token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              label="Token"
                              name="Your Telegram token"
                            />
                            <FormControl>
                              <Input
                                placeholder="Telegram Bot Token"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="agentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              label="Agent"
                              name="The agent to use for this integration"
                            />
                            <FormControl>
                              <Select
                                defaultValue={field.value}
                                onValueChange={(v) => {
                                  field.onChange(v);
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button disabled={isPending} type="submit">
                          {isPending ? 'Initializing...' : 'Save changes'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
