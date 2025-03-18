import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';

import { ComponentLoader } from '@/components/ComponentLoader';
import { useKnowledgeModalStore } from '@/components/knowledge/modal/useKnowledgeModal';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/api';

const KnowledgeBase = lazy(
  () => import('@/components/knowledge/KnowledgeBase')
);
const AddKnowledgeBaseModal = lazy(
  () => import('@/components/knowledge/modal/AddKnowledgeBaseModal')
);

const DeleteKnowledgeModal = lazy(
  () => import('@/components/knowledge/modal/DeleteKnowledgeModal')
);

// const sources: KnowledgeSource[] = [
//   {
//     id: '1',
//     name: 'Product Documentation',
//     type: 'web',
//     description: 'Official product documentation and API references',
//     status: 'active',
//     lastUpdated: '2 hours ago',
//     size: '1.2 MB',
//     category: 'Documentation',
//     url: 'https://docs.example.com',
//   },
//   {
//     id: '2',
//     name: 'Customer FAQs',
//     type: 'document',
//     description: 'Frequently asked questions and answers',
//     status: 'active',
//     lastUpdated: '1 day ago',
//     size: '450 KB',
//     category: 'Support',
//   },
//   {
//     id: '3',
//     name: 'Support Tickets',
//     type: 'database',
//     description: 'Historical support ticket data and resolutions',
//     status: 'active',
//     lastUpdated: '5 mins ago',
//     size: '2.1 GB',
//     category: 'Support',
//   },
//   {
//     id: '4',
//     name: 'Blog Articles',
//     type: 'article',
//     description: 'Company blog posts and tutorials',
//     status: 'active',
//     lastUpdated: '3 days ago',
//     size: '800 KB',
//     category: 'Marketing',
//     url: 'https://blog.example.com',
//   },
//   {
//     id: '5',
//     name: 'Internal Guidelines',
//     type: 'text',
//     description: 'Internal support team guidelines and procedures',
//     status: 'active',
//     lastUpdated: '1 week ago',
//     size: '300 KB',
//     category: 'Internal',
//   },
//   {
//     id: '6',
//     name: 'API Documentation',
//     type: 'web',
//     description: 'API endpoints and integration guides',
//     status: 'active',
//     lastUpdated: '12 hours ago',
//     size: '900 KB',
//     category: 'Documentation',
//     url: 'https://api.example.com/docs',
//   },
// ];

export default function KnowledgeBasePage() {
  const { handleOpen } = useKnowledgeModalStore();

  const {
    data: sources,
    isLoading,
    // isError,
  } = useQuery({
    queryKey: ['sources'],
    queryFn: API.datasource.getAllDatasources,
  });

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Knowledge Base
            </h2>
            <p className="text-muted-foreground">
              Manage and organize your AI training data
            </p>
          </div>
          <Button className="max-sm:mt-4 max-sm:w-full" onClick={handleOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        </div>

        {isLoading ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : sources ? (
          <Suspense fallback={<ComponentLoader />}>
            <KnowledgeBase sources={sources} />
          </Suspense>
        ) : null}
      </div>

      <AddKnowledgeBaseModal />
      <DeleteKnowledgeModal />
    </div>
  );
}
