import React, { memo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from '@uploadthing/react';
import { Loader2, Paperclip, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAgentStore } from '@/hooks/useAgent';
import { useChatStore } from '@/hooks/useChat';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { API } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Message } from '@/types/interface/chat';
import { Attachments } from './Attachments';
import Preferences from './Preferences';

interface ChatWindowProps {
  position: 'center' | 'bottom';
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  position = 'bottom',
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const containerMaxHeight = 0;
  const { messages, setMessages } = useChatStore();
  const { agentId } = useAgentStore();
  const { attachments, isUploading, startUpload, removeAttachment } =
    useMediaUpload();
  const [isPending, setIsPending] = useState(false);
  const [question, setQuestion] = useState('');

  const queryClient = useQueryClient();

  const { data: conversationData } = useQuery({
    queryFn: () => API.conversation.getConversationId(conversationId!),
    queryKey: ['conversation', conversationId],
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
  });

  const { getInputProps, getRootProps } = useDropzone({
    onDrop: startUpload,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps();

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight;

    if (newHeight <= containerMaxHeight) {
      textarea.style.height = `${newHeight}px`;
    } else {
      textarea.style.height = `${containerMaxHeight}px`;
      textarea.style.overflowY = 'auto';
    }
  };

  const onHandleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      // e.preventDefault();
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: question,
      isTemporary: true,
      role: 'human',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await API.chat.createNewMessage({
        messages: [...messages.slice(-3), userMessage],
        conversationId: conversationId!,
        agentId,
        userId: '67c698efbe3f97543f604516',
      });

      if (!res.ok) {
        const data = await res.json();

        const errors = data.errors as Array<{ field: string; message: string }>;

        if (errors.length > 0 && errors[0].field === 'agentId') {
          throw new Error('Please select an agent in settings');
        }

        throw new Error(data.errorCode + ': ' + data.message);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream found');

      const aiMessageId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, content: '', role: 'ai', isTemporary: true },
      ]);

      await handleStreamResponse(reader, aiMessageId);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }

    await queryClient.invalidateQueries({
      queryKey: ['conversations'],
    });

    setQuestion('');
    setIsPending(false);
  };

  const handleStreamResponse = async (
    reader: ReadableStreamDefaultReader,
    aiMessageId: string
  ) => {
    const decoder = new TextDecoder();
    let accumulatedText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      accumulatedText += decoder.decode(value, { stream: true });
      const lines = accumulatedText.split('\n\n');
      accumulatedText = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(line.replace('data: ', ''));
            handleStreamEvent(jsonData, aiMessageId);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else if (line.startsWith('event: end')) {
          console.log('Stream ended');
          return;
        }
      }
    }
  };

  const handleStreamEvent = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonData: Record<string, any>,
    aiMessageId: string
  ) => {
    switch (jsonData.event) {
      case 'messages':
        updateAIMessage(aiMessageId, jsonData.data?.content ?? '');
        break;
      case 'values':
        break;
      case 'conversationId':
        if (!conversationData?.id && jsonData.data?.conversationId) {
          navigate(`/chat/${jsonData.data.conversationId}`);
        }
        break;
    }
  };

  const updateAIMessage = (aiMessageId: string, content: string) => {
    if (!content) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === aiMessageId
          ? { ...msg, content: msg.content + content }
          : msg
      )
    );
  };

  return (
    <>
      {/* CENTER INPUT */}
      {/* <form
        onSubmit={onSubmit}
        hidden={position === 'bottom'}
        className="w-full">
        <div
          {...rootProps}
          className={cn(
            'bg-background flex max-h-52 w-full flex-col gap-2 rounded-3xl border p-2 shadow-md max-lg:hidden',
            className
          )}>
          <Textarea
            ref={textareaRef}
            autoFocus
            className="resize-none border-none border-transparent bg-transparent ring-offset-0 focus-within:ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
            placeholder="Ask me anything"
            onInput={handleInput}
            value={question}
            onChange={onHandleInputChange}
          />

          <div className="inline-flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center gap-2">
              <input
                {...getInputProps()}
                ref={inputFileRef}
                type="file"
                hidden
                aria-hidden="true"
                name="file"
              />
              <UploadFileButton inputRef={inputFileRef} />

              {attachments.length > 0 && (
                <Attachments
                  attachments={attachments}
                  removeAttachment={removeAttachment}
                />
              )}
            </div>

            <div>
              <SendMessageButton
                isPending={isPending}
                isUploading={isUploading}
                question={question}
              />
            </div>
          </div>
        </div>
      </form> */}

      {/* BOTTOM INPUT */}
      <form
        className="relative w-full min-w-0"
        hidden={position === 'center'}
        onSubmit={onSubmit}>
        <div
          {...rootProps}
          className={cn(
            'bg-background flex max-h-52 w-full max-w-3xl flex-col gap-2 rounded-3xl border p-2 shadow-md',
            className
          )}>
          <Textarea
            ref={textareaRef}
            autoFocus
            className="resize-none border-none border-transparent bg-transparent text-sm ring-offset-0 focus-within:ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
            placeholder="Ask me anything"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={question}
            onChange={onHandleInputChange}
          />

          <div className="inline-flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center gap-2">
              <input
                {...getInputProps()}
                ref={inputFileRef}
                type="file"
                hidden
                aria-hidden="true"
                name="file"
              />
              <UploadFileButton inputRef={inputFileRef} />
              <Preferences />

              {attachments.length > 0 && (
                <Attachments
                  attachments={attachments}
                  removeAttachment={removeAttachment}
                />
              )}
            </div>
            <div>
              <SendMessageButton
                isPending={isPending}
                isUploading={isUploading}
                question={question}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

type SendButtonProps = {
  isPending: boolean;
  isUploading: boolean;
  question: string;
};

type UploadButtonProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const UploadFileButton: React.FC<UploadButtonProps> = memo(() => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {}}
            type="button"
            size="circle"
            disabled
            variant="outline">
            <Paperclip />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-primary text-background dark:bg-primary dark:text-background"
          side="bottom">
          <p>Upload files</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

UploadFileButton.displayName = 'UploadFileButton';

const SendMessageButton: React.FC<SendButtonProps> = memo(
  ({ isPending, isUploading, question }) => {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isPending || isUploading || !question.trim()}
              type="submit"
              size="circle"
              variant="default">
              {isPending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-primary text-background dark:bg-primary dark:text-background"
            side="bottom">
            <p>Send messages</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

SendMessageButton.displayName = 'SendMessageButton';

export default ChatWindow;
