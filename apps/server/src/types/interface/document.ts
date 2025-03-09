export interface StoreDocument {
  (data: {
    fileUrl?: string; // File URL
    content?: string; // Use content if fileUrl is not provided
    datasourceId: string;
  }): Promise<StoreDocumentResult>;
}

type StoreDocumentResult = string[];
