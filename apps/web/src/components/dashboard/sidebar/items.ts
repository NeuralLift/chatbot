import {
  Bot,
  Database,
  GitGraph,
  LayoutDashboard,
  MessageCircle,
  MessageCircleQuestionIcon,
  PhoneCall,
  Settings,
  Zap,
} from 'lucide-react';

// Menu items.
const items = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Conversations',
    url: '/dashboard/conversations',
    icon: MessageCircle,
  },
  {
    title: 'Agent Management',
    url: '/dashboard/agents',
    icon: Bot,
  },
  {
    title: 'Knowlegde Base',
    url: '/dashboard/knowledge',
    icon: Database,
  },
  {
    title: 'Flow Builder',
    url: '/dashboard/builder',
    icon: GitGraph,
  },
  {
    title: 'Integrations',
    url: '/dashboard/integrations',
    icon: Zap,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

// Sup items
const supItems = [
  {
    title: 'FAQ',
    url: '/faq',
    icon: MessageCircleQuestionIcon,
  },
  {
    title: 'Contact',
    url: '/contact',
    icon: PhoneCall,
  },
];

export { items, supItems };
