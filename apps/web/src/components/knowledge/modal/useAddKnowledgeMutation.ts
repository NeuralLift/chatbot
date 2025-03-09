import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import {
  createNewDatasouceSchema,
  CreateNewDatasourceParams,
} from '@/lib/schema/knowledge';

export const useAddKnowledgeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sources'],
      });
    },
  });

  return mutation;
};

const addKnowledge = async (data: CreateNewDatasourceParams) => {
  const parseData = createNewDatasouceSchema.parse(data);

  const res = await API.datasource.createDatasource(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
