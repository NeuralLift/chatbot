export interface StoreDocument {
  (data: {
    fileUrl?: string; // File URL
    content?: string; // Use content if fileUrl is not provided
    url?: string; // Website URL
    agentIds?: string[];
    datasourceId: string;
  }): Promise<StoreDocumentResult>;
}

type StoreDocumentResult = string[];
