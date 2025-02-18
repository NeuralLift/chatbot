import { useCallback, useEffect, useRef, useState } from 'react';
import { AvatarImage } from '@radix-ui/react-avatar';

import { Avatar } from '@/components/ui/avatar';
import { useChatStore } from '@/hooks/useChat';
import { ChatWindow } from './ChatWindow';

export function ChatScreen() {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1;
      setShouldAutoScroll(isAtBottom);
    }
  }, [scrollContainerRef, setShouldAutoScroll]);

  return (
    <div className="flex h-screen flex-col">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="custom-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.map(({ id, role, content }) => {
            const isUser = role === 'user';
            return (
              <div
                key={id}
                className={`mb-4 flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar>
                  <AvatarImage
                    src={
                      isUser
                        ? 'https://avatar.vercel.sh/user'
                        : 'https://avatar.vercel.sh/ai'
                    }
                  />
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${isUser ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <ChatWindow position="bottom" />
        </div>
      </div>
    </div>
  );
}
