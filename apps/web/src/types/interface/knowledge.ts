// export interface KnowledgeSource {
//   id: string;
//   name: string;
//   type: SourceType;
//   description: string;
//   status: 'active' | 'inactive' | 'pending';
//   lastUpdated: string;
//   size: string;
//   category: string;
//   url?: string;
// }

export interface KnowledgeSource {
  id: string;
  agentIds: string[];
  name: string;
  type: SourceType;
  category?: string;
  content?: string;
  description: string;
  url?: string;
  fileUrl?: string;
  size: number;
  agentId: string;
  datasourceId: string;
  assignedAt: Date;
  createdAt: string;
  updatedAt: string;
}

export type SourceType = 'WEB' | 'DOCUMENT' | 'DATABASE' | 'ARTICLE' | 'TEXT';
// export type SourceType = 'web' | 'document' | 'database' | 'article' | 'text';
