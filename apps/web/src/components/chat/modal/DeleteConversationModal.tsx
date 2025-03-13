import { useNavigate } from 'react-router';
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
import { useDeleteConversationModalStore } from './useDeleteConversationModal';
import { useDeleteConversationMutation } from './useDeleteConversationMutation';

export default function DeleteConversationModal() {
  const { conversation, open, handleClose } = useDeleteConversationModalStore();
  const navigate = useNavigate();

  const { mutate: deleteConversationMutation, isPending } =
    useDeleteConversationMutation();

  const handleDelete = (conversationId: string) => {
    if (isPending) return;
    if (!conversationId.trim()) return;

    deleteConversationMutation(
      {
        conversationId,
      },
      {
        onSuccess: () => {
          toast.success('Conversation deleted successfully');
          handleClose();

          navigate('/chat');
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
            This action cannot be undone. This will permanently delete your all
            messages in this conversation from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(conversation?.id ?? '')}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
