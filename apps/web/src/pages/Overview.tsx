import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OverviewPage() {
  return (
    <div className="p-6">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>{' '}
              <p className="text-muted-foreground text-xs">
                +2% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2m</div>
              <p className="text-muted-foreground text-xs">
                -12% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-muted-foreground text-xs">
                +1% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolved Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-muted-foreground text-xs">
                +8% from last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Tabs defaultValue="all" className="col-span-4">
            <ScrollArea>
              <div className="relative h-10 w-full">
                <TabsList className="absolute flex h-10">
                  <TabsTrigger value="all">All Conversations</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="waiting">Waiting</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="all" className="space-y-4">
              <ConversationsList />
            </TabsContent>
            <TabsContent value="active" className="space-y-4">
              <ConversationsList />
            </TabsContent>
            <TabsContent value="waiting" className="space-y-4">
              <ConversationsList />
            </TabsContent>
            <TabsContent value="resolved" className="space-y-4">
              <ConversationsList />
            </TabsContent>
          </Tabs>
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-muted-foreground text-sm">
                    Sarah Wilson
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-muted-foreground text-sm">
                    sarah@example.com
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Previous Issues</div>
                  <div className="text-muted-foreground text-sm">3</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Customer Since</div>
                  <div className="text-muted-foreground text-sm">
                    March 2024
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>Most discussed subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Password Reset', 'Account Setup', 'Billing Issues'].map(
                    (topic) => (
                      <div
                        key={topic}
                        className="flex items-center justify-between">
                        <span className="text-sm">{topic}</span>
                        <Progress
                          value={Math.random() * 100}
                          className="w-[60%]"
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationsList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Issue #{2024001 + i}
              </p>
              <p className="text-muted-foreground text-sm">
                Having trouble with account login...
              </p>
            </div>
            <div className="text-muted-foreground text-sm">2m ago</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
