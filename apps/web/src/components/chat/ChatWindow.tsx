import React, { memo, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDropzone } from '@uploadthing/react';
import { Loader2, Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useChatStore } from '@/hooks/useChat';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { API } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Attachments } from './Attachments';

interface ChatWindowProps {
  position: 'center' | 'bottom';
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  position = 'bottom',
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const containerMaxHeight = 0;
  const { messages, setMessages } = useChatStore();
  const { attachments, isUploading, startUpload, removeAttachment } =
    useMediaUpload();
  const [isPending, setIsPending] = useState(false);
  const [question, setQuestion] = useState('');

  const { data: conversationData } = useQuery({
    queryFn: () =>
      API.conversation.getConversationId('67c96e052adbf6d6b40b70dd'),
    queryKey: ['conversation'],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (conversationData) {
      setMessages((prev) => [...prev, ...(conversationData.messages ?? [])]);
    }
  }, [conversationData]);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    // Send user message first
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: question, role: 'human' },
    ]);

    try {
      const res = await API.chat.createNewMessage({
        messages: [
          ...messages.slice(-1),
          {
            role: 'human',
            content: question,
          },
        ],
        agentId: '67c95d71b9e60b5fb996b962',
        userId: '67c698efbe3f97543f604516',
      });

      if (!res.ok) {
        const json = await res.json();
        const message = json.message;
        throw new Error(message);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      // Create AI message placeholder first
      const aiMessageId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          content: '',
          role: 'ai',
        },
      ]);

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });

        const lines = accumulatedText.split('\n\n');
        accumulatedText = lines.pop() || ''; // Keep incomplete data

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const jsonData = JSON.parse(line.replace('data: ', ''));

              // if (jsonData.event === 'messages' && Array.isArray(jsonData.data)) {
              if (jsonData.event === 'messages') {
                // Cari objek yang memiliki `id` termasuk 'AIMessageChunk'
                // const aiMessage = jsonData.data.find((msg: { id: string[] }) =>
                //   msg.id?.includes('AIMessageChunk')
                // );
                const data = jsonData.data;

                // Ambil content dari kwargs jika ada
                const content = data?.content ?? '';

                if (content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: msg.content + content }
                        : msg
                    )
                  );
                }
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          } else if (line.startsWith('event: end')) {
            console.log('Stream ended');
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }

    setQuestion('');
    setIsPending(false);
  };

  return (
    <>
      {/* CENTER INPUT */}
      <form
        onSubmit={onSubmit}
        hidden={position === 'bottom'}
        className="w-full">
        <div
          {...rootProps}
          className={cn(
            'bg-background flex max-h-56 w-full flex-col gap-2 rounded-lg border p-2 shadow-md max-lg:hidden',
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
      </form>

      {/* BOTTOM INPUT */}
      <form
        className="relative w-full min-w-0"
        hidden={position === 'center'}
        onSubmit={onSubmit}>
        <div
          {...rootProps}
          className={cn(
            'bg-background flex max-h-56 w-full max-w-3xl flex-col gap-2 rounded-lg border p-2 shadow-md',
            className
          )}>
          <Textarea
            ref={textareaRef}
            autoFocus
            className="resize-none border-none border-transparent bg-transparent text-sm ring-offset-0 focus-within:ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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

const UploadFileButton: React.FC<UploadButtonProps> = memo(({ inputRef }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => inputRef.current?.click()}
            type="button"
            size="circle"
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

const SendMessageButton: React.FC<SendButtonProps> = ({
  isPending,
  isUploading,
  question,
}) => {
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
};

SendMessageButton.displayName = 'SendMessageButton';
