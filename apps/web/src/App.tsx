import { ChatScreen } from '@/components/chat/ChatScreen';
import { ChatWelcomeScreen } from '@/components/chat/ChatWelcomeScreen';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { useChatStore } from '@/hooks/useChat';

function App() {
  const { messages } = useChatStore();

  return (
    <ThemeProvider defaultTheme="light">
      <div className="relative h-full w-full max-w-full overflow-hidden">
        <div className="flex min-h-screen items-center justify-center">
          {messages.length > 0 ? <ChatScreen /> : <ChatWelcomeScreen />}
        </div>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
