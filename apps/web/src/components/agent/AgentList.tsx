import {
  // useEffect,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bot,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  // Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router';

import { useAgentModalStore } from '@/components/agent/modal/useAgentModal';
import { useDeleteAgentModalStore } from '@/components/agent/modal/useDeleteAgentModal';
import { useDetailsAgentModalStore } from '@/components/agent/modal/useDetailsAgentModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAgentStore } from '@/hooks/useAgent';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Textarea } from '@/components/ui/textarea';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Agent } from '@/types/interface/agent';

// function AgentCardSkeleton() {
//   return (
//     <Card className="relative overflow-hidden">
//       <CardHeader className="pb-2">
//         <div className="flex items-center space-x-4">
//           <div className="bg-muted h-10 w-10 rounded-xl p-2" />
//           <div className="space-y-2">
//             <div className="bg-muted h-4 w-32 rounded" />
//             <div className="bg-muted h-3 w-48 rounded" />
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <div className="bg-muted h-5 w-20 rounded" />
//             <div className="bg-muted h-5 w-16 rounded" />
//           </div>
//           <div className="bg-muted h-2 rounded-full" />
//         </div>
//         <div className="flex gap-2">
//           <div className="bg-muted h-6 w-20 rounded" />
//           <div className="bg-muted h-6 w-20 rounded" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

const AgentCard = ({ agent }: { agent: Agent }) => {
  const { setAgent: setDetailsAgent, handleOpen: handleDetailsOpen } =
    useDetailsAgentModalStore();
  const { setAgent: setEditAgent, handleOpen: handleEditOpen } =
    useAgentModalStore();
  const { setAgent: setDeleteAgent, handleOpen: handleDeleteOpen } =
    useDeleteAgentModalStore();
  const { setAgent } = useAgentStore();

  const handleClickDetailsAgent = () => {
    setDetailsAgent(agent);
    handleDetailsOpen();
  };

  const hadleClickEditAgent = () => {
    setEditAgent(agent);
    handleEditOpen();
  };

  const handleDeleteAgent = () => {
    setDeleteAgent(agent);
    handleDeleteOpen();
  };

  const handleClickPreview = () => {
    setAgent(agent.id);
  };

  return (
    <Card className="hover:border-primary/50 group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-primary/10 group-hover:bg-primary/20 rounded-xl p-2 transition-all duration-200">
                <Bot className="text-primary h-6 w-6" />
              </div>
              <div
                className={cn(
                  'border-background absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2',
                  agent.active ? 'bg-green-500' : 'bg-gray-500'
                  // agent.status === 'inactive' && 'bg-gray-400',
                  // agent.status === 'training' && 'bg-yellow-500'
                )}
              />
            </div>
            <div className="space-y-1">
              <CardTitle className="leading-none">{agent.name}</CardTitle>
              <CardDescription className="line-clamp-1 text-xs sm:text-sm">
                {agent.description}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleClickDetailsAgent()}>
                <Settings className="mr-2 h-4 w-4" />
                View Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => hadleClickEditAgent()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/chat" onClick={() => handleClickPreview()}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteAgent()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-primary/5 hover:bg-primary/10 line-clamp-1 transition-colors">
              {agent.model}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {agent.conversations?.length}
              </span>
              <span className="text-muted-foreground text-xs">
                conversations
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span
                className={cn(
                  'font-medium',
                  agent.successRate >= 90
                    ? 'text-green-500'
                    : agent.successRate >= 75
                      ? 'text-yellow-500'
                      : 'text-red-500'
                )}>
                {agent.successRate}%
              </span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <motion.div
                className={cn(
                  'h-full rounded-full transition-colors duration-500',
                  agent.successRate >= 90
                    ? 'bg-green-500'
                    : agent.successRate >= 75
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${agent.successRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          <span>Last active {formatRelativeDate(agent.lastActive)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {agent.datasources.slice(0, 2).map((kb) => (
            <Badge
              key={kb.id}
              variant="muted"
              className="cursor-pointer px-2 py-0.5 text-xs transition-colors">
              {kb.category}
            </Badge>
          ))}
          {agent.datasources.length > 2 && (
            <Badge
              variant="muted"
              className="cursor-pointer px-2 py-0.5 text-xs transition-colors"
              onClick={() => {
                // setSelectedAgent(agent);
                // setIsDetailsSheetOpen(true);
              }}>
              +{agent.datasources.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface AgentListProps {
  agents: Agent[];
}

export function AgentList({ agents }: AgentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  // const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate loading
  //   const timer = setTimeout(() => setIsLoading(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // const filteredAgents = agents.filter(
  //   (agent) =>
  //     agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const BadgeStatus = ({ status }: { status: Agent['status'] }) => {
  //   switch (status) {
  //     case 'active':
  //       return <Badge variant="success">Active</Badge>;
  //     case 'inactive':
  //       return <Badge variant="secondary">Inactive</Badge>;
  //     case 'training':
  //       return <Badge variant="destructive">Training</Badge>;
  //     default:
  //       return <Badge>Unknown</Badge>;
  //   }
  // };

  return (
    // <div className="space-y-6">
    //   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    //     <div className="space-y-1">
    //       <h2 className="text-2xl font-bold tracking-tight">
    //         Agent Management
    //       </h2>
    //       <p className="text-muted-foreground text-sm">
    //         Create and manage your AI support agents
    //       </p>
    //     </div>
    //     <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    //       <div className="relative flex-1 sm:min-w-[300px]">
    //         <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
    //         <Input
    //           placeholder="Search agents..."
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           className="pl-8"
    //         />
    //       </div>
    //       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
    //         <DialogTrigger asChild>
    //           <Button className="w-full sm:w-auto">
    //             <Plus className="mr-2 h-4 w-4" />
    //             Add Agent
    //           </Button>
    //         </DialogTrigger>
    //         <DialogContent className="sm:max-w-[600px]">
    //           <DialogHeader>
    //             <DialogTitle>Add New Agent</DialogTitle>
    //             <DialogDescription>
    //               Configure your new AI support agent
    //             </DialogDescription>
    //           </DialogHeader>
    //           <Tabs defaultValue="basic" className="w-full">
    //             <TabsList className="grid w-full grid-cols-3">
    //               <TabsTrigger value="basic">Basic Info</TabsTrigger>
    //               <TabsTrigger value="prompt">Prompt</TabsTrigger>
    //               <TabsTrigger value="settings">Settings</TabsTrigger>
    //             </TabsList>
    //             <TabsContent value="basic" className="space-y-4">
    //               <div className="grid gap-4 py-4">
    //                 <div className="grid gap-2">
    //                   <Label htmlFor="name">Name</Label>
    //                   <Input id="name" placeholder="Enter agent name" />
    //                 </div>
    //                 <div className="grid gap-2">
    //                   <Label htmlFor="description">Description</Label>
    //                   <Textarea
    //                     id="description"
    //                     placeholder="Describe the agent's purpose"
    //                   />
    //                 </div>
    //               </div>
    //             </TabsContent>
    //             <TabsContent value="prompt" className="space-y-4">
    //               <div className="grid gap-4 py-4">
    //                 <div className="grid gap-2">
    //                   <Label htmlFor="systemPrompt">System Prompt</Label>
    //                   <Textarea
    //                     id="systemPrompt"
    //                     placeholder="Enter the system prompt"
    //                     className="min-h-[200px]"
    //                   />
    //                 </div>
    //               </div>
    //             </TabsContent>
    //             <TabsContent value="settings" className="space-y-4">
    //               <div className="grid gap-4 py-4">
    //                 <div className="grid gap-2">
    //                   <Label htmlFor="model">Model</Label>
    //                   <Select>
    //                     <SelectTrigger>
    //                       <SelectValue placeholder="Select model" />
    //                     </SelectTrigger>
    //                     <SelectContent>
    //                       <SelectItem value="gpt-4">GPT-4</SelectItem>
    //                       <SelectItem value="gpt-3.5-turbo">
    //                         GPT-3.5 Turbo
    //                       </SelectItem>
    //                     </SelectContent>
    //                   </Select>
    //                 </div>
    //                 <div className="grid gap-2">
    //                   <Label htmlFor="temperature">
    //                     Temperature:{' '}
    //                     <span className="text-muted-foreground">0.7</span>
    //                   </Label>
    //                   <Input
    //                     id="temperature"
    //                     type="range"
    //                     min="0"
    //                     max="1"
    //                     step="0.1"
    //                     defaultValue="0.7"
    //                   />
    //                 </div>
    //                 <div className="grid gap-2">
    //                   <Label>Knowledge Base Access</Label>
    //                   <div className="space-y-2">
    //                     {[
    //                       'Product Documentation',
    //                       'FAQs',
    //                       'API Documentation',
    //                     ].map((kb) => (
    //                       <div key={kb} className="flex items-center space-x-2">
    //                         <input
    //                           type="checkbox"
    //                           id={kb}
    //                           className="rounded border-gray-300"
    //                         />
    //                         <Label htmlFor={kb}>{kb}</Label>
    //                       </div>
    //                     ))}
    //                   </div>
    //                 </div>
    //               </div>
    //             </TabsContent>
    //           </Tabs>
    //           <DialogFooter>
    //             <Button
    //               variant="outline"
    //               onClick={() => setIsAddDialogOpen(false)}>
    //               Cancel
    //             </Button>
    //             <Button type="submit">Create Agent</Button>
    //           </DialogFooter>
    //         </DialogContent>
    //       </Dialog>
    //     </div>
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
    //     {isLoading ? (
    //       <>
    //         <AgentCardSkeleton />
    //         <AgentCardSkeleton />
    //         <AgentCardSkeleton />
    //       </>
    //     ) : (
    //       filteredAgents.map((agent) => (
    //         <Card
    //           key={agent.id}
    //           className="hover:border-primary/50 group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
    //           <CardHeader className="space-y-0 pb-2">
    //             <div className="flex items-center justify-between space-x-4">
    //               <div className="flex items-center space-x-4">
    //                 <div className="relative">
    //                   <div className="bg-primary/10 group-hover:bg-primary/20 rounded-xl p-2 transition-all duration-200">
    //                     <Bot className="text-primary h-6 w-6" />
    //                   </div>
    //                   <div
    //                     className={cn(
    //                       'border-background absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2',
    //                       agent.status === 'active' && 'bg-green-500',
    //                       agent.status === 'inactive' && 'bg-gray-400',
    //                       agent.status === 'training' && 'bg-yellow-500'
    //                     )}
    //                   />
    //                 </div>
    //                 <div className="space-y-1">
    //                   <CardTitle className="leading-none">
    //                     {agent.name}
    //                   </CardTitle>
    //                   <CardDescription className="line-clamp-1 text-xs sm:text-sm">
    //                     {agent.description}
    //                   </CardDescription>
    //                 </div>
    //               </div>
    //               <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
    //                     <MoreHorizontal className="h-4 w-4" />
    //                     <span className="sr-only">Open menu</span>
    //                   </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end" className="w-48">
    //                   <DropdownMenuItem
    //                     onClick={() => {
    //                       setSelectedAgent(agent);
    //                       setIsDetailsSheetOpen(true);
    //                     }}>
    //                     <Settings className="mr-2 h-4 w-4" />
    //                     View Settings
    //                   </DropdownMenuItem>
    //                   <DropdownMenuItem
    //                     onClick={() => {
    //                       setSelectedAgent(agent);
    //                       setIsAddDialogOpen(true);
    //                     }}>
    //                     <Edit className="mr-2 h-4 w-4" />
    //                     Edit
    //                   </DropdownMenuItem>
    //                   <DropdownMenuItem>
    //                     <Copy className="mr-2 h-4 w-4" />
    //                     Duplicate
    //                   </DropdownMenuItem>
    //                   <DropdownMenuSeparator />
    //                   <DropdownMenuItem
    //                     className="text-destructive"
    //                     onClick={() => {
    //                       setSelectedAgent(agent);
    //                       setIsDeleteDialogOpen(true);
    //                     }}>
    //                     <Trash2 className="mr-2 h-4 w-4" />
    //                     Delete
    //                   </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //               </DropdownMenu>
    //             </div>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="grid gap-4">
    //               <div className="flex items-center justify-between">
    //                 <Badge
    //                   variant="outline"
    //                   className="bg-primary/5 hover:bg-primary/10 transition-colors">
    //                   {agent.model}
    //                 </Badge>
    //                 <div className="flex items-center gap-2">
    //                   <span className="text-sm font-medium">
    //                     {agent.conversations.toLocaleString()}
    //                   </span>
    //                   <span className="text-muted-foreground text-xs">
    //                     conversations
    //                   </span>
    //                 </div>
    //               </div>

    //               <div className="space-y-2">
    //                 <div className="flex items-center justify-between text-sm">
    //                   <span className="text-muted-foreground">
    //                     Success Rate
    //                   </span>
    //                   <span
    //                     className={cn(
    //                       'font-medium',
    //                       agent.successRate >= 90
    //                         ? 'text-green-500'
    //                         : agent.successRate >= 75
    //                           ? 'text-yellow-500'
    //                           : 'text-red-500'
    //                     )}>
    //                     {agent.successRate}%
    //                   </span>
    //                 </div>
    //                 <div className="bg-muted h-2 overflow-hidden rounded-full">
    //                   <motion.div
    //                     className={cn(
    //                       'h-full rounded-full transition-colors duration-500',
    //                       agent.successRate >= 90
    //                         ? 'bg-green-500'
    //                         : agent.successRate >= 75
    //                           ? 'bg-yellow-500'
    //                           : 'bg-red-500'
    //                     )}
    //                     initial={{ width: 0 }}
    //                     animate={{ width: `${agent.successRate}%` }}
    //                     transition={{ duration: 1, ease: 'easeOut' }}
    //                   />
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="text-muted-foreground flex items-center gap-2 text-sm">
    //               <Activity className="h-4 w-4" />
    //               <span>Last active {agent.lastActive}</span>
    //             </div>

    //             <div className="flex flex-wrap gap-1.5">
    //               {agent.knowledgeBases.slice(0, 2).map((kb) => (
    //                 <Badge
    //                   key={kb}
    //                   variant="secondary"
    //                   className="bg-secondary/50 hover:bg-secondary/70 px-2 py-0.5 text-xs transition-colors">
    //                   {kb}
    //                 </Badge>
    //               ))}
    //               {agent.knowledgeBases.length > 2 && (
    //                 <Badge
    //                   variant="secondary"
    //                   className="bg-secondary/50 hover:bg-secondary/70 cursor-pointer px-2 py-0.5 text-xs transition-colors"
    //                   onClick={() => {
    //                     setSelectedAgent(agent);
    //                     setIsDetailsSheetOpen(true);
    //                   }}>
    //                   +{agent.knowledgeBases.length - 2} more
    //                 </Badge>
    //               )}
    //             </div>
    //           </CardContent>
    //         </Card>
    //       ))
    //     )}
    //   </div>

    //   {/* Delete Confirmation Dialog */}
    //   <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    //     <DialogContent>
    //       <DialogHeader>
    //         <DialogTitle>Delete Agent</DialogTitle>
    //         <DialogDescription>
    //           Are you sure you want to delete this agent? This action cannot be
    //           undone.
    //         </DialogDescription>
    //       </DialogHeader>
    //       <DialogFooter>
    //         <Button
    //           variant="outline"
    //           onClick={() => setIsDeleteDialogOpen(false)}>
    //           Cancel
    //         </Button>
    //         <Button
    //           variant="destructive"
    //           onClick={() => {
    //             // Handle delete
    //             setIsDeleteDialogOpen(false);
    //           }}>
    //           Delete
    //         </Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Dialog>

    //   {/* Agent Details Sheet */}
    //   {selectedAgent && (
    //     <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
    //       <SheetContent className="w-full sm:max-w-[600px]">
    //         <SheetHeader>
    //           <SheetTitle>Agent Settings</SheetTitle>
    //           <SheetDescription>
    //             View and manage settings for {selectedAgent.name}
    //           </SheetDescription>
    //         </SheetHeader>
    //         <div className="space-y-6 py-6">
    //           <div className="space-y-2">
    //             <h3 className="font-medium">Basic Information</h3>
    //             <div className="grid gap-2 text-sm">
    //               <div className="flex justify-between">
    //                 <span className="text-muted-foreground">Created</span>
    //                 <span>{selectedAgent.createdAt}</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-muted-foreground">Status</span>
    //                 <BadgeStatus status={selectedAgent.status} />
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-muted-foreground">Success Rate</span>
    //                 <span>{selectedAgent.successRate}%</span>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="space-y-2">
    //             <h3 className="font-medium">Model Configuration</h3>
    //             <div className="grid gap-2 text-sm">
    //               <div className="flex justify-between">
    //                 <span className="text-muted-foreground">Model</span>
    //                 <Badge variant="outline">{selectedAgent.model}</Badge>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-muted-foreground">Temperature</span>
    //                 <span>{selectedAgent.temperature}</span>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="space-y-2">
    //             <h3 className="font-medium">Knowledge Base Access</h3>
    //             <div className="flex flex-wrap gap-2">
    //               {selectedAgent.knowledgeBases.map((kb) => (
    //                 <Badge key={kb} variant="secondary">
    //                   {kb}
    //                 </Badge>
    //               ))}
    //             </div>
    //           </div>

    //           <div className="space-y-2">
    //             <h3 className="font-medium">System Prompt</h3>
    //             <Card>
    //               <CardContent className="p-4">
    //                 <pre className="whitespace-pre-wrap text-sm">
    //                   {selectedAgent.systemPrompt}
    //                 </pre>
    //               </CardContent>
    //             </Card>
    //           </div>
    //         </div>
    //       </SheetContent>
    //     </Sheet>
    //   )}
    // </div>
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-lg flex-1">
          <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
          <Input
            placeholder="Search agents..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" disabled>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </>
  );
}
