import { lazy } from 'react';

const Header = lazy(() => import('@/components/chat/sidebar/Header'));
const ChatScreen = lazy(() => import('@/components/chat/ChatScreen'));
const ChatWindow = lazy(() => import('@/components/chat/ChatWindow'));

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-full flex-col overflow-auto">
      <Header />
      <ChatScreen />
      <div className="bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <ChatWindow position="bottom" />
        </div>
      </div>
    </div>
  );
}
