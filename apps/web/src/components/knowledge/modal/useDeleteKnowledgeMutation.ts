import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import {
  DeleteDatasourceParams,
  deleteDatasourceSchema,
} from '@/lib/schema/knowledge';

export const useDeleteKnowledgeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteDatasource,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sources'],
      });
    },
  });

  return mutation;
};

const deleteDatasource = async (data: DeleteDatasourceParams) => {
  const parseData = deleteDatasourceSchema.parse(data);

  const res = await API.datasource.deleteDatasource(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
