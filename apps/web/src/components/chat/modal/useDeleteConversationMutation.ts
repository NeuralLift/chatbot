import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import {
  DeleteConversationParams,
  deleteConversationSchema,
} from '@/lib/schema/chat';

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });
    },
  });

  return mutation;
};

const deleteConversation = async (data: DeleteConversationParams) => {
  const parseData = deleteConversationSchema.parse(data);

  const res = await API.conversation.deleteConversation(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
