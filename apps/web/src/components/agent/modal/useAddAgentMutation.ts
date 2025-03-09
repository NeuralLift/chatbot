import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import { CreateNewAgentParams, createNewAgentSchema } from '@/lib/schema/agent';

export const useAddAgentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agents'],
      });
    },
  });

  return mutation;
};

const addAgent = async (data: CreateNewAgentParams) => {
  const parseData = createNewAgentSchema.parse(data);

  const res = await API.agent.createAgent(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
