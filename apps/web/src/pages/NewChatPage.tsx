import { lazy, useEffect } from 'react';

import { ChatWelcomeScreen } from '@/components/chat/ChatWelcomeScreen';
import { useChatStore } from '@/hooks/useChat';

const Header = lazy(() => import('@/components/chat/sidebar/Header'));

export default function NewChatPage() {
  const { resetMessages } = useChatStore();

  useEffect(() => {
    resetMessages();
  }, [resetMessages]);

  return (
    <div className="max-h-dvhw-full mx-auto flex h-dvh max-h-dvh max-w-full flex-col overflow-auto">
      <Header />
      <ChatWelcomeScreen />
    </div>
  );
}
