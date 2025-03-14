import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteKnowledgeModalStore } from './useDeleteKnowledgeModal';
import { useDeleteKnowledgeMutation } from './useDeleteKnowledgeMutation';

export default function DeleteAgentModal() {
  const { source, open, handleClose } = useDeleteKnowledgeModalStore();

  const { mutate: deleteKnowledgeMutation, isPending } =
    useDeleteKnowledgeMutation();

  const handleDelete = (datasourceId: string) => {
    if (isPending) return;
    if (!datasourceId.trim()) return;

    deleteKnowledgeMutation(
      {
        datasourceId,
      },
      {
        onSuccess: () => {
          toast.success('Datasource deleted successfully');
          handleClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Datasource, and all data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(source?.id ?? '')}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
