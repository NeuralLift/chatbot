import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import {
  createTelegramIntegration,
  CreateTelegramIntegration,
} from '@/lib/schema/integration';

export const useCreateIntegrationMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: telegramIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['integration'],
      });
    },
  });

  return mutation;
};

const telegramIntegration = async (data: CreateTelegramIntegration) => {
  const parseData = createTelegramIntegration.parse(data);

  const res = await API.integration.createTelegramIntegration(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
