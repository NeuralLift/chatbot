import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import { DeleteAgentParams, deleteAgentSchema } from '@/lib/schema/agent';

export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agents'],
      });
    },
  });

  return mutation;
};

const deleteAgent = async (data: DeleteAgentParams) => {
  const parseData = deleteAgentSchema.parse(data);

  const res = await API.agent.deleteAgent(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
