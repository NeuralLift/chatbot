import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router';

import AiThinking from '@/components/AiThinking';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/hooks/useChat';
import { API } from '@/lib/api';

const MemoMarkdown = React.memo(Markdown);

export default function ChatScreen() {
  const { messages, setMessages } = useChatStore();
  const { conversationId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isThinkingOpen, setThinkingOpen] = useState<{
    [key: string]: boolean;
  }>(
    window.localStorage.getItem('thinkingState')
      ? JSON.parse(window.localStorage.getItem('thinkingState')!)
      : {}
  );

  const toggleThinking = (id: string) => {
    setThinkingOpen((prev) => {
      const newState = {
        ...prev,
        [id]: !prev[id],
      };
      window.localStorage.setItem('thinkingState', JSON.stringify(newState));
      return newState;
    });
  };

  const {
    data: conversationData,
    error,
    isError,
  } = useQuery({
    queryFn: () => API.conversation.getConversationId(conversationId!),
    queryKey: ['conversation', conversationId],
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (conversationData?.messages) {
      setMessages((prev) => {
        const newMessages = conversationData.messages ?? [];
        const existingMessageIds = new Set(prev.map((msg) => msg.id));
        const filteredNewMessages = newMessages.filter(
          (msg) => !existingMessageIds.has(msg.id)
        );

        // Only update state if there are new messages to add
        if (filteredNewMessages.length > 0) {
          return [...prev, ...filteredNewMessages];
        }
        return prev;
      });
    }
  }, [conversationData?.messages, setMessages]);

  // Efek untuk mengatur isThinkingOpen pada pesan AI terbaru
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      // Hanya set isThinkingOpen ke true jika pesan terakhir dari AI
      if (
        latestMessage.role !== 'human' &&
        latestMessage.content.includes('<think>')
      ) {
        const isExitsInState = Object.keys(isThinkingOpen).some(
          (key) => key === latestMessage.id
        );
        if (!isExitsInState) {
          setThinkingOpen((prev) => ({
            ...prev,
            [latestMessage.id]: true, // Set true untuk pesan AI terbaru
          }));
        }
      }
    }
  }, [messages, isThinkingOpen]);

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
      {isError && <div>{error.message}</div>}

      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        {messages.map(({ id, role, content }) => {
          const isUser = role === 'human';

          function extractThinkContentFromStream(content: string) {
            let thinkContent = ''; // Content inside <think>...</think>
            let cleanContent = ''; // Content outside <think>...</think>

            // Find the start and end of the <think> block
            const startThinkTagIndex = content.indexOf('<think>');
            const endThinkTagIndex = content.indexOf('</think>');

            if (startThinkTagIndex === -1) {
              // No <think> tag found, all content is clean
              cleanContent = content.trim();
            } else if (endThinkTagIndex === -1) {
              // <think> tag found but no </think>, treat everything after <think> as thinkContent
              cleanContent = content.slice(0, startThinkTagIndex).trim();
              thinkContent = content.slice(startThinkTagIndex + 7).trim();
            } else {
              // Both <think> and </think> tags found, split accordingly
              cleanContent =
                content.slice(0, startThinkTagIndex).trim() +
                ' ' +
                content.slice(endThinkTagIndex + 8).trim();
              thinkContent = content
                .slice(startThinkTagIndex + 7, endThinkTagIndex)
                .trim();
            }

            return {
              thinkContent: thinkContent,
              cleanContent: cleanContent.trim(),
            };
          }

          const { thinkContent, cleanContent } =
            extractThinkContentFromStream(content);

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

              {/* AI Thinking loading */}
              {!isUser && content.trim() === '' ? (
                <AiThinking />
              ) : isUser ? (
                <div
                  className={`prose dark:prose-invert bg-accent text-accent-foreground min-w-0 rounded-lg px-4 py-2 shadow-md`}>
                  {cleanContent && <MemoMarkdown>{cleanContent}</MemoMarkdown>}
                </div>
              ) : (
                <div className="">
                  {thinkContent && (
                    <div className="mb-2 w-full">
                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleThinking(id)}
                        className="bg-muted flex items-center gap-1 rounded-full p-2 text-xs font-medium">
                        <span>AI Thought</span>
                        {isThinkingOpen[id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {/* AI Thought Process (Collapsible) */}
                      <div
                        className={`text-muted-foreground prose dark:prose-invert custom-scrollbar min-w-0 overflow-hidden overflow-y-auto p-2 text-sm backdrop-blur-md transition-all ${
                          isThinkingOpen[id]
                            ? 'max-h-[1000px] opacity-100'
                            : 'hidden max-h-0 opacity-0'
                        }`}>
                        <MemoMarkdown>{thinkContent}</MemoMarkdown>
                      </div>
                    </div>
                  )}

                  <div
                    className={`prose dark:prose-invert bg-muted min-w-0 rounded-lg px-4 py-2 shadow-md`}>
                    {cleanContent && (
                      <MemoMarkdown>{cleanContent}</MemoMarkdown>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
