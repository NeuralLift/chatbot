import { PineconeStore } from '@langchain/pinecone';
import { Document } from 'langchain/document';
import { v4 as uuid } from 'uuid';

import { StoreDocument } from '../../types/interface/document';
import { getEmbeddings } from '../../utils/embeddings';
import { loadUrlDocument } from '../../utils/loadDocument';
import { getPineconeIndex } from '../../utils/pinecone';
import { textSplitter } from '../../utils/textSplitter';
import { loadWebDocument } from '../../utils/webLoader';
import { DatasourceService } from '../datasource';

class DocumentService {
  private vectorStore: PineconeStore;

  constructor() {
    this.vectorStore = null!;
  }

  async initializeVectorStore() {
    this.vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
      pineconeIndex: getPineconeIndex(),
      maxConcurrency: 5,
    });
  }

  private async processAndStoreDocuments(
    docs: Document[],
    datasourceId: string,
    chunkSize: number = 10
  ): Promise<string[]> {
    const splitDocs = await textSplitter(docs);
    const mapSplitDocs = splitDocs.map((doc) => ({
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        datasourceId,
      },
    }));

    const result: string[] = [];
    for (let i = 0; i < mapSplitDocs.length; i += chunkSize) {
      const chunk = mapSplitDocs.slice(i, i + chunkSize);
      const chunkIds = chunk.map(() => uuid());
      await this.vectorStore.addDocuments(chunk, { ids: chunkIds });
      result.push(...chunkIds);
    }
    return result;
  }

  async storeFileUrl(fileUrl: string, datasourceId: string): Promise<string[]> {
    const docs = await loadUrlDocument(fileUrl);
    return this.processAndStoreDocuments(docs, datasourceId);
  }

  async storeContent(content: string, datasourceId: string): Promise<string[]> {
    const docs = [
      new Document({
        pageContent: content,
        metadata: { author: 'user', datasourceId },
      }),
    ];
    return this.processAndStoreDocuments(docs, datasourceId);
  }

  async storeUrl(
    url: string,
    datasourceId: string,
    agentIds?: string[]
  ): Promise<string[]> {
    const docs = await loadWebDocument(url);
    const splitDocs = await textSplitter(docs);
    const mapSplitDocs = splitDocs.map((doc) => ({
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        datasourceId,
      },
    }));

    const size = mapSplitDocs
      .map((doc) => doc.pageContent.length)
      .reduce((a, b) => a + b, 0);

    await DatasourceService.updateDatasourceById(datasourceId, {
      agentIds,
      size,
    });

    const result: string[] = [];
    const chunkSize = 10;
    for (let i = 0; i < mapSplitDocs.length; i += chunkSize) {
      const chunk = mapSplitDocs.slice(i, i + chunkSize);
      const chunkIds = chunk.map(() => uuid());
      await this.vectorStore.addDocuments(chunk, { ids: chunkIds });
      result.push(...chunkIds);
    }
    return result;
  }
}

export const storeDocument: StoreDocument = async (data) => {
  try {
    const documentService = new DocumentService();
    await documentService.initializeVectorStore();

    const result: string[] = [];

    if (data.fileUrl) {
      const fileResult = await documentService.storeFileUrl(
        data.fileUrl,
        data.datasourceId
      );
      result.push(...fileResult);
    }

    if (data.content) {
      const contentResult = await documentService.storeContent(
        data.content,
        data.datasourceId
      );
      result.push(...contentResult);
    }

    if (data.url) {
      const urlResult = await documentService.storeUrl(
        data.url,
        data.datasourceId,
        data.agentIds
      );
      result.push(...urlResult);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
