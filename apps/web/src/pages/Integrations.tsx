import { lazy, Suspense, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import io from 'socket.io-client';

import { ComponentLoader } from '@/components/ComponentLoader';
import { Button } from '@/components/ui/button';

const Integrations = lazy(
  () => import('@/components/integrations/Integrations')
);

const socket = io('http://localhost:3000');

export default function IntegrationsPage() {
  const [userId] = useState('user123'); // Ganti dengan userId dinamis
  const [agentId] = useState('agent456'); // Ganti dengan agentId dinamis
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState('Waiting for QR...');

  useEffect(() => {
    socket.emit('join', userId);

    socket.on('qr', (qr: string) => {
      setQrCode(qr);
      setStatus('Scan this QR code');
    });

    socket.on('authenticated', (message: string) => {
      setQrCode(null);
      setStatus(message);
    });

    return () => {
      socket.off('qr');
      socket.off('authenticated');
    };
  }, [userId]);

  const startBot = async () => {
    try {
      const response = await fetch(
        `/api/start-bot?userId=${userId}&agentId=${agentId}`
      );
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground">
              Connect your AI support agent with other tools and services
            </p>
          </div>
          <Button className="max-sm:mt-4 max-sm:w-full" onClick={startBot}>
            <Plus className="mr-2 h-4 w-4" />
            Start Bot
          </Button>
        </div>

        <Suspense fallback={<ComponentLoader />}>
          <Integrations />
        </Suspense>

        {qrCode && (
          <div className="flex flex-col items-center space-y-4">
            <img src={qrCode} alt="QR Code" className="h-64 w-64" />
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
