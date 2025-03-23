import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Clock,
  Filter,
  MoreVertical,
  User,
} from 'lucide-react';

import { useCustomerDetailsModalStore } from '@/components/conversations/modal/useCustomerDetailsModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { API } from '@/lib/api';
import { Conversation } from '@/types/interface/chat';

// const CustomerDetailsModal = lazy(
//   () => import('@/components/conversations/modal/CustomerDetailsModal')
// );

// const conversations: Conversation[] = [
//   {
//     id: '1',
//     customer: {
//       name: 'Alice Brown',
//       email: 'alice@example.com',
//       status: 'online',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'Hi, I need help with my account settings',
//         role: 'human',
//         timestamp: '2 mins ago',
//       },
//       {
//         id: 'm2',
//         content:
//           "I'll be happy to help you with your account settings. What specific settings are you trying to adjust?",
//         role: 'ai',
//         timestamp: '1 min ago',
//       },
//       {
//         id: 'm3',
//         content: "I can't change my password",
//         role: 'human',
//         timestamp: '1 min ago',
//       },
//     ],
//     status: 'active',
//     category: 'Account',
//     priority: 'medium',
//     created_at: '10 mins ago',
//     updated_at: '1 min ago',
//   },
//   {
//     id: '2',
//     customer: {
//       name: 'John Smith',
//       email: 'john@example.com',
//       status: 'offline',
//       lastSeen: '5 mins ago',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'How do I cancel my subscription?',
//         role: 'human',
//         timestamp: '15 mins ago',
//       },
//       {
//         id: 'm2',
//         content:
//           "I can help you cancel your subscription. Could you please confirm which plan you're currently on?",
//         role: 'ai',
//         timestamp: '14 mins ago',
//       },
//     ],
//     status: 'pending',
//     category: 'Billing',
//     priority: 'high',
//     created_at: '15 mins ago',
//     updated_at: '14 mins ago',
//   },
//   {
//     id: '3',
//     customer: {
//       name: 'Sarah Johnson',
//       email: 'sarah@example.com',
//       status: 'online',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'When will my order be delivered?',
//         role: 'human',
//         timestamp: '1 hour ago',
//       },
//       {
//         id: 'm2',
//         content:
//           'Let me check that for you. Could you please provide your order number?',
//         role: 'ai',
//         timestamp: '59 mins ago',
//       },
//       {
//         id: 'm3',
//         content: "It's #ORD-12345",
//         role: 'human',
//         timestamp: '58 mins ago',
//       },
//     ],
//     status: 'active',
//     category: 'Orders',
//     priority: 'medium',
//     created_at: '1 hour ago',
//     updated_at: '58 mins ago',
//   },
//   {
//     id: '4',
//     customer: {
//       name: 'Michael Green',
//       email: 'michael@example.com',
//       status: 'offline',
//       lastSeen: '20 mins ago',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'What are your support hours?',
//         role: 'human',
//         timestamp: '30 mins ago',
//       },
//       {
//         id: 'm2',
//         content: 'Our support is available 24/7. How can I assist you further?',
//         role: 'ai',
//         timestamp: '29 mins ago',
//       },
//     ],
//     status: 'resolved',
//     category: 'Support',
//     priority: 'low',
//     created_at: '30 mins ago',
//     updated_at: '29 mins ago',
//   },
//   {
//     id: '5',
//     customer: {
//       name: 'Sarah Lee',
//       email: 'sarah@example.com',
//       status: 'online',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'I have a question about my order.',
//         role: 'human',
//         timestamp: '2 mins ago',
//       },
//     ],
//     status: 'active',
//     category: 'Orders',
//     priority: 'high',
//     created_at: '2 mins ago',
//     updated_at: '2 mins ago',
//   },
//   {
//     id: '6',
//     customer: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       status: 'offline',
//       lastSeen: '1 hour ago',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'I need help with my account settings',
//         role: 'human',
//         timestamp: '1 hour ago',
//       },
//       {
//         id: 'm2',
//         content:
//           "I'll be happy to help you with your account settings. What specific settings are you trying to adjust?",
//         role: 'ai',
//         timestamp: '59 mins ago',
//       },
//       {
//         id: 'm3',
//         content: "I can't change my password",
//         role: 'human',
//         timestamp: '58 mins ago',
//       },
//     ],
//     status: 'pending',
//     category: 'Support',
//     priority: 'low',
//     created_at: '1 hour ago',
//     updated_at: '1 hour ago',
//   },
//   {
//     id: '7',
//     customer: {
//       name: 'Emily Davis',
//       email: 'emily@example.com',
//       status: 'online',
//     },
//     messages: [
//       {
//         id: 'm1',
//         content: 'I have a question about my order.',
//         role: 'human',
//         timestamp: '2 mins ago',
//       },
//       {
//         id: 'm2',
//         content: "Sure, what's your order number?",
//         role: 'ai',
//         timestamp: '1 min ago',
//       },
//       {
//         id: 'm3',
//         content: "It's #ORD-67890",
//         role: 'human',
//         timestamp: '59 secs ago',
//       },
//       {
//         id: 'm4',
//         content: "I'll check on that for you.",
//         role: 'ai',
//         timestamp: '58 secs ago',
//       },
//       {
//         id: 'm5',
//         content: 'Thank you for your patience.',
//         role: 'ai',
//         timestamp: '57 secs ago',
//       },
//       {
//         id: 'm6',
//         content: "I've checked on your order, it's being processed.",
//         role: 'ai',
//         timestamp: '56 secs ago',
//       },
//       {
//         id: 'm7',
//         content: "I've also checked on your other order, #ORD-67891.",
//         role: 'ai',
//         timestamp: '55 secs ago',
//       },
//       {
//         id: 'm8',
//         content: 'Thank you so much for letting me know!',
//         role: 'human',
//         timestamp: '54 secs ago',
//       },
//     ],
//     status: 'active',
//     category: 'Orders',
//     priority: 'medium',
//     created_at: '2 mins ago',
//     updated_at: '2 mins ago',
//   },
// ];

export default function Conversations() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile(1024);
  const [showChat, setShowChat] = useState(false);
  const { handleOpen } = useCustomerDetailsModalStore();

  const { data: conversationsData } = useSuspenseQuery({
    queryKey: ['conversations'],
    queryFn: () =>
      API.conversation.getAllConversations({
        includeAllMessages: true,
        chatOnly: true,
      }),
  });

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowChat(true);
    }
  };

  // Go back to conversation list on mobile
  const handleBackToList = () => {
    setShowChat(false);
  };

  return (
    <div className="grid max-h-[calc(100dvh-48px)] min-h-[calc(100dvh-48px)] min-w-0 gap-4 sm:max-h-dvh sm:min-h-dvh sm:p-6 lg:grid-cols-[350px_1fr]">
      {/* Conversations List - Hidden on mobile when chat is shown */}
      <Card
        className={`${isMobile && showChat ? 'hidden' : 'block'} w-full max-sm:rounded-none`}>
        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="custom-scrollbar max-h-[calc(100dvh-124px)] min-w-0 overflow-y-auto p-0">
          {/* <ScrollArea className="h-[700px]"> */}

          {conversationsData &&
            conversationsData?.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`hover:bg-muted/50 w-full min-w-0 p-4 text-left transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        conversation.user.name === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <span className="font-medium">
                      {conversation.user.name}
                    </span>
                  </div>
                  <Badge
                    variant={
                      conversation.priority === 'high'
                        ? 'destructive'
                        : conversation.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                    }>
                    {conversation.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 max-w-[200px] truncate text-sm sm:max-w-[250px] md:max-w-md">
                  {conversation.messages
                    ? conversation.messages[conversation.messages?.length - 1]
                        .content
                    : ''}
                </p>
                <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{conversation.updated_at}</span>
                </div>
              </button>
            ))}
          {/* </ScrollArea> */}
        </CardContent>
      </Card>

      {/* Chat Area - Hidden on mobile when conversation list is shown */}
      {selectedConversation ? (
        <Card
          className={`${isMobile && !showChat ? 'hidden' : 'block'} max-sm:rounded-none`}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToList}
                    className="mr-1">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedConversation?.user?.name === 'online'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                <CardTitle>{selectedConversation?.user?.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        handleOpen();
                      }}>
                      Customer Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Transfer</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative max-h-[calc(100dvh-124px)] min-h-[calc(100dvh-124px)] w-full p-4">
            {/* <ScrollArea className="h-auto p-4"> */}
            <div className="custom-scrollbar max-h-[calc(100dvh-242px)] space-y-4 overflow-y-auto">
              {selectedConversation.messages?.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.role === 'human' ? 'flex-row' : 'flex-row-reverse'} ${selectedConversation.messages && selectedConversation.messages.length - 1 === index ? '!mb-4' : ''}`}>
                  <div
                    className={`rounded-full p-2 ${message.role === 'human' ? 'bg-primary/10' : 'bg-muted'}`}>
                    {message.role === 'human' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'human' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-muted-foreground mt-1 text-xs">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* </ScrollArea> */}
            <div className="absolute bottom-0 left-1/2 right-0 w-full -translate-x-1/2 border-t">
              <div className="flex w-full items-center justify-center gap-2 p-2">
                <div className="flex w-full items-center gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button size="circle">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex items-center justify-center">
          <p className="text-muted-foreground">
            Select a conversation to start
          </p>
        </Card>
      )}
      {/* <CustomerDetailsModal selectedConversation={selectedConversation} /> */}
    </div>
  );
}
