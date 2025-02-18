import { Code, Image, LineChart, Type } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';

const features = [
  {
    title: 'Content Writing',
    description:
      'Generate high-quality content for your blog, social media, or website.',
    icon: Type,
  },
  {
    title: 'Data Analysis',
    description:
      'Analyze data and get insights with natural language processing.',
    icon: LineChart,
  },
  {
    title: 'Code Assistant',
    description: 'Get help with coding, debugging, and code explanations.',
    icon: Code,
  },
  {
    title: 'Image Analysis',
    description: 'Analyze images and get detailed descriptions and insights.',
    icon: Image,
  },
];

export function ChatWelcomeScreen() {
  return (
    <div className="mt-auto flex h-full w-full max-w-2xl flex-1 flex-col items-center justify-center space-y-4 px-2 sm:m-auto lg:p-0">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-4xl">
          Welcome to NeuralLift AI
        </h1>

        <div className="mt-4 grid w-full grid-cols-2 gap-2 lg:hidden">
          {features.map((feature) => (
            <Button
              key={feature.title}
              variant="outline"
              size="circle"
              className="w-full">
              <feature.icon className="h-4 w-4" />

              <span className="max-w-full select-none text-sm font-normal text-gray-600 dark:text-gray-300">
                {feature.title}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* INPUT */}
      <ChatWindow position="center" />

      <div className="inline-flex w-full items-center gap-2 max-lg:hidden">
        {features.map((feature) => (
          <Button
            key={feature.title}
            variant="outline"
            size="circle"
            className="w-full">
            <feature.icon className="h-4 w-4" />

            <span className="max-w-full select-none text-sm font-normal text-gray-600 dark:text-gray-500">
              {feature.title}
            </span>
          </Button>
        ))}
      </div>

      {/* Bottom INPUT */}
      <ChatWindow position="bottom" className="lg:hidden" />
    </div>
  );
}
