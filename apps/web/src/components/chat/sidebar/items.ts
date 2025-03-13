import {
  LayoutDashboard,
  MessageCircleQuestionIcon,
  PhoneCall,
} from 'lucide-react';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
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
