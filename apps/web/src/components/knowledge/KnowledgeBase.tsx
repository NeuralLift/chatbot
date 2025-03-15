import { useMemo, useState } from 'react';
import {
  Book,
  Database,
  File,
  FileText,
  Globe,
  Link,
  LucideIcon,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatFileSize, formatRelativeDate } from '@/lib/utils';
import { KnowledgeSource } from '@/types/interface/knowledge';
import { BadgeStatus } from './BadgeStatus';
import { useDeleteKnowledgeModalStore } from './modal/useDeleteKnowledgeModal';
import { useKnowledgeModalStore } from './modal/useKnowledgeModal';

type KnowledgeBaseProps = {
  sources: KnowledgeSource[];
};

const sourceIcons = {
  WEB: Globe,
  DOCUMENT: FileText,
  DATABASE: Database,
  ARTICLE: Book,
  TEXT: File,
};

const KnowledgeBaseCard = ({
  source,
  Icon,
}: {
  source: KnowledgeSource;
  Icon: LucideIcon;
}) => {
  const { setSource: setEditSource, handleOpen: handleEditOpen } =
    useKnowledgeModalStore();
  const { setSource: setDeleteSource, handleOpen: handleDeleteOpen } =
    useDeleteKnowledgeModalStore();

  const handleClickEdit = () => {
    setEditSource(source);
    handleEditOpen();
  };

  const handleClickDelete = () => {
    setDeleteSource(source);
    handleDeleteOpen();
  };

  return (
    <Card
      key={source.id}
      className="hover:border-primary/50 group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 group-hover:bg-primary/20 rounded-xl p-2">
              <Icon className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{source.name}</CardTitle>
              <CardDescription>{source.category}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleClickEdit()}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Sync Now</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleClickDelete()}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{source.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge>{formatFileSize(source.size)}</Badge>
          {source.url && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Link to={source.url} className="h-3 w-3" />
              URL
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-muted-foreground text-sm">
            Updated {formatRelativeDate(source.updatedAt)}
          </div>
          <BadgeStatus
            status={'active'}
            // status={source.status}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function KnowledgeBase({ sources }: KnowledgeBaseProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSources = useMemo(
    () =>
      sources.filter(
        (source) =>
          (activeTab === 'all' || source.type.toLowerCase() === activeTab) &&
          (source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [sources, activeTab, searchQuery]
  );

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <div className="relative max-w-lg flex-1">
          <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
          <Input
            placeholder="Search knowledge sources..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" disabled>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="space-y-4"
        onValueChange={setActiveTab}>
        <ScrollArea>
          <div className="relative h-10 w-full">
            <TabsList className="absolute flex h-10">
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
              <TabsTrigger value="database">Databases</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSources.map((source) => {
              const Icon = sourceIcons[source.type];
              return (
                <KnowledgeBaseCard
                  key={source.id}
                  source={source}
                  Icon={Icon}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
