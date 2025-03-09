import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/lib/api';
import {
  updateDatasouceSchema,
  UpdateDatasourceParams,
} from '@/lib/schema/knowledge';

export const useEditKnowledgeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sources'],
      });
    },
  });

  return mutation;
};

const editKnowledge = async (data: UpdateDatasourceParams) => {
  const parseData = updateDatasouceSchema.parse(data);

  const res = await API.datasource.editDatasource(parseData);

  if (!res) {
    throw new Error('Something went wrong');
  }

  if (res.error) {
    throw new Error(res.errorCode + ': ' + res.message);
  }

  return res;
};
