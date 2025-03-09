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
import { useDeleteAgentModalStore } from './useDeleteAgentModal';
import { useDeleteAgentMutation } from './useDeleteAgentMutation';

export default function DeleteAgentModal() {
  const { agent, open, handleClose } = useDeleteAgentModalStore();

  const { mutate: deleteAgentMutation, isPending } = useDeleteAgentMutation();

  const handleDelete = (agentId: string) => {
    if (isPending) return;
    if (!agentId.trim()) return;

    deleteAgentMutation(
      {
        agentId,
      },
      {
        onSuccess: () => {
          toast.success('Agent deleted successfully');
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
            agent, conversations, and all data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(agent?.id ?? '')}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
