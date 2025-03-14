import { lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';

import { AgentList } from '@/components/agent/AgentList';
import { useAgentModalStore } from '@/components/agent/modal/useAgentModal';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/api';

const AddAgentModal = lazy(
  () => import('@/components/agent/modal/AddAgentModal')
);
const DeleteAgentModal = lazy(
  () => import('@/components/agent/modal/DeleteAgentModal')
);
const DetailsAgentModal = lazy(
  () => import('@/components/agent/modal/DetailsAgentModal')
);

// import { Agent } from '@/types/interface/agent';

// const agents: Agent[] = [
//   {
//     id: '1',
//     name: 'General Support Agent',
//     description: 'Handles general customer inquiries and basic troubleshooting',
//     model: 'gpt-4',
//     temperature: 0.7,
//     status: 'active',
//     lastActive: '2 mins ago',
//     conversations: [],
//     datasources: [],
//     successRate: 92,
//     knowledgeBases: ['Product Documentation', 'FAQs', 'Troubleshooting Guides'],
//     systemPrompt:
//       "You are a helpful customer support agent. Always be polite and professional. If you're unsure about something, acknowledge it and offer to escalate to a human agent.",
//     createdAt: '2024-01-15',
//     avatar: '/placeholder.svg?height=40&width=40',
//   },
//   {
//     id: '2',
//     name: 'Technical Support Specialist',
//     description: 'Handles complex technical issues and API support',
//     model: 'gpt-4',
//     temperature: 0.5,
//     status: 'active',
//     lastActive: '5 mins ago',
//     conversations: [],
//     datasources: [],
//     successRate: 88,
//     knowledgeBases: ['API Documentation', 'Technical Guides', 'Code Samples'],
//     systemPrompt:
//       'You are a technical support specialist. Focus on providing accurate technical information and code examples when relevant. Validate technical details before providing solutions.',
//     createdAt: '2024-02-01',
//     avatar: '/placeholder.svg?height=40&width=40',
//   },
//   {
//     id: '3',
//     name: 'Billing Support Agent',
//     description: 'Handles billing and subscription related queries',
//     model: 'gpt-3.5-turbo',
//     temperature: 0.3,
//     status: 'inactive',
//     lastActive: '2 days ago',
//     conversations: [],
//     datasources: [],
//     successRate: 95,
//     knowledgeBases: ['Billing Documentation', 'Pricing Plans', 'Payment FAQs'],
//     systemPrompt:
//       'You are a billing support agent. Be precise with billing information and always verify account details. Never share sensitive payment information.',
//     createdAt: '2024-02-10',
//     avatar: '/placeholder.svg?height=40&width=40',
//   },
// ];

export default function AgentsPage() {
  const { handleOpen } = useAgentModalStore();
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: API.agent.getAllAgents,
  });

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agent List</h2>
            <p className="text-muted-foreground">
              Manage and help generate responses for your AI support agents
            </p>
          </div>
          <Button
            className="max-sm:mt-4 max-sm:w-full"
            onClick={() => handleOpen()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>

        {isLoading ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : agents ? (
          <AgentList agents={agents} />
        ) : null}
      </div>

      <AddAgentModal />
      <DetailsAgentModal />
      <DeleteAgentModal />
    </div>
  );
}
