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
    <div className="mx-auto flex h-screen w-full max-w-full flex-col overflow-auto">
      <Header />
      <ChatWelcomeScreen />
    </div>
  );
}
