import {
  ArrowRight,
  Bot,
  Clock,
  MessageSquare,
  Shield,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh flex-col">
      <header className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link className="flex items-center gap-2 font-semibold" to="#">
          <Bot className="h-6 w-6" />
          <span>AI Support</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#demo">
            Demo
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <div className="mx-auto max-w-7xl flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    24/7 Customer Support Powered by AI
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Provide instant, intelligent support to your customers with
                    our AI agent. Save time and money while improving customer
                    satisfaction.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" onClick={() => navigate('/dashboard')}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </div>
              </div>
              <Card className="relative overflow-hidden">
                <div className="flex h-[600px] flex-col p-4">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <Bot className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">AI Support Agent</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 overflow-auto p-4">
                    <div className="flex gap-3 text-sm">
                      <Bot className="mt-1 h-8 w-8" />
                      <div className="flex-1">
                        <p className="bg-muted rounded-lg p-3">
                          Hello! I'm your AI support assistant. How can I help
                          you today?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <MessageSquare className="mt-1 h-8 w-8" />
                      <div className="flex-1">
                        <p className="bg-primary text-primary-foreground rounded-lg p-3">
                          Hi! I need help with my recent order.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <Bot className="mt-1 h-8 w-8" />
                      <div className="flex-1">
                        <p className="bg-muted rounded-lg p-3">
                          I'd be happy to help you with your order. Could you
                          please provide your order number?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to provide excellent customer support,
                  powered by artificial intelligence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <Clock className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">24/7 Availability</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide round-the-clock support to your customers, no matter
                  their timezone.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <Zap className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Instant Responses</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get immediate answers to customer queries without any waiting
                  time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <Shield className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Secure & Reliable</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enterprise-grade security with data encryption and privacy
                  protection.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to get started?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Transform your customer support today with our AI-powered
                  solution.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AI Support. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
