import { $Enums, Datasource } from '@prisma/client';

export interface CreateNewDatasource {
  (data: {
    name: string;
    agentIds?: string[];
    type: $Enums.DatasourceType;
    description?: string | null; // Description about the datasource
    category?: string | null; // Category of the datasource ex: Documentation
    content?: string | null; // Content of the datasource
    url?: string | null; // URL of the datasource ex: https://docs.example.com
    size?: number | null; // Size of the datasource in bytes ex: 10MB
    fileUrl?: string | null;
  }): Promise<Datasource>;
}

export interface UpdateDataSource {
  (
    datasourceId: string,
    data: {
      name?: string;
      agentIds?: string[];
      type?: $Enums.DatasourceType;
      description?: string | null; // Description about the datasource
      category?: string | null; // Category of the datasource ex: Documentation
      content?: string | null; // Content of the datasource
      url?: string | null; // URL of the datasource ex: https://docs.example.com
      size?: number | null; // Size of the datasource in bytes ex: 10MB
      fileUrl?: string | null;
    }
  ): Promise<Datasource>;
}

export type CreateNewDatasourceParams = Parameters<CreateNewDatasource>[0];

export type UpdateDataSourceParams = Parameters<UpdateDataSource>[0];
