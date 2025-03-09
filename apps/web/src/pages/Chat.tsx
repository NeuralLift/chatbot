import { ChatScreen } from '@/components/chat/ChatScreen';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <ChatScreen />
      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <ChatWindow position="bottom" />
        </div>
      </div>
    </div>
  );
}
