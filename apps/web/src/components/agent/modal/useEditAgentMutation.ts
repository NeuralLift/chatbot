import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import { UpdateAgentParams, updateAgentSchema } from '@/lib/schema/agent';

export const useEditAgentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agents'],
      });
    },
  });

  return mutation;
};

const updateAgent = async (data: UpdateAgentParams) => {
  const parseData = updateAgentSchema.parse(data);

  const res = await API.agent.updateAgent(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
