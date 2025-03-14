import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
  User2,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router';

import DeleteConversationModal from '@/components/chat/modal/DeleteConversationModal';
import { useDeleteConversationModalStore } from '@/components/chat/modal/useDeleteConversationModal';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useChatStore } from '@/hooks/useChat';
import { API } from '@/lib/api';
import { Conversation } from '@/types/interface/chat';
import { items, supItems } from './items';
import { MenuButton } from './MenuButton';
import { NewChatButton } from './NewChatButton';
import { SearchButton } from './SearchButton';

export default function ChatSidebar() {
  const { conversationId } = useParams();
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();
  const { resetMessages } = useChatStore();
  /** Resets the chat messages to ensure a clean state. */
  const handleBeforeNavigateConversation = (newConversationId: string) => {
    if (newConversationId !== conversationId) {
      resetMessages();
    }
  };

  const handleClickLinkMobile = () => {
    setOpenMobile(false);
  };

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: API.conversation.getAllConversations,
  });

  return (
    <>
      <Sidebar collapsible="offcanvas" className="flex-shrink-0">
        {/* This is the sidebar trigger button */}
        {/* <div className="absolute -right-3 top-2.5 z-[11]">
      </div> */}
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <MenuButton />
            <div>
              <SearchButton />
              <NewChatButton />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      onClick={() => handleClickLinkMobile()}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Conversation</SidebarGroupLabel>
            {isLoading ? (
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : conversationsData?.length === 0 ? (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <span>No conversations yet</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            ) : conversationsData && conversationsData.length > 0 ? (
              <>
                <SidebarGroupContent className="custom-scrollbar max-h-96 overflow-y-auto">
                  <SidebarMenu>
                    {conversationsData.map((conversation) => {
                      const content = conversation.messages?.length
                        ? conversation.messages[0].content
                        : '';

                      return (
                        <SidebarMenuItem key={conversation.id}>
                          <SidebarMenuButton
                            asChild
                            tooltip={content}
                            isActive={pathname === conversation.id}
                            onClick={() => handleClickLinkMobile()}>
                            <Link
                              to={conversation.id}
                              aria-current="page"
                              onClick={() => {
                                handleBeforeNavigateConversation(
                                  conversation.id
                                );
                              }}>
                              <MessageSquare />
                              <span className="max-w-[calc(100%-0.75rem)]">
                                {content}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                          <DropdownMenuWithMenuAction
                            conversation={conversation}
                          />
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : null}
          </SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Help
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {supItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.url}
                          onClick={() => handleClickLinkMobile()}>
                          <a href={item.url} aria-current="page">
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip="User">
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <DeleteConversationModal />
    </>
  );
}

const DropdownMenuWithMenuAction = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { handleOpen, setConversation } = useDeleteConversationModalStore();

  const handleClickDelete = (conversation: Conversation) => {
    setConversation(conversation);
    handleOpen();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          showOnHover
          className="!peer-data-[size=default]/menu-button:2.5 !top-2.5">
          <MoreHorizontal />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem onClick={() => handleClickDelete(conversation)}>
          <span>Delete Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
