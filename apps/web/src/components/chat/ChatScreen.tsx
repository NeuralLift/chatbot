import React, { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/hooks/useChat';

const MemoMarkdown = React.memo(Markdown);

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
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="custom-scrollbar flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {messages.map(({ id, role, content }) => {
          const isUser = role === 'human';
          return (
            <div
              key={id}
              className={`mb-4 flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {isUser ? (
                <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <AvatarImage src={'https://avatar.vercel.sh/human'} />
                </Avatar>
              ) : (
                <div className="bg-muted relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bot">
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
              )}
              <div
                className={`prose dark:prose-invert max-w-none overflow-auto rounded-lg px-4 py-2 shadow-md ${isUser ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                <MemoMarkdown>{content}</MemoMarkdown>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
