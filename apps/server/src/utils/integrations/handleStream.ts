import appConfig from '../../configs/app';

export async function handleTelegramStream({
  messages,
  userMessage,
  agentId,
  chatId,
}: {
  messages: { role: string; content: string }[];
  userMessage: string;
  agentId: string;
  chatId: number;
}): Promise<string> {
  const res = await fetch(`${appConfig.SERVER_ORIGIN}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      messages: [...messages, { role: 'human', content: userMessage }],
      chatId,
      agentId,
      userId: '67c698efbe3f97543f604516',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No readable stream found');

  const decoder = new TextDecoder();
  let accumulatedText = '';
  let content = '';

  // eslint-disable-next-line no-constant-condition
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
          switch (jsonData.event) {
            case 'messages':
              content += jsonData.data?.content ?? '';
              break;
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else if (line.startsWith('event: end')) {
        console.log('Stream ended');

        return content;
      }
    }
  }

  return content;
}
