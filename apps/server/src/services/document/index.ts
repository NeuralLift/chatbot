import { PineconeStore } from '@langchain/pinecone';
import { Document } from 'langchain/document';
import { v4 as uuid } from 'uuid';

import { StoreDocument } from '../../types/interface/document';
import { getEmbeddings } from '../../utils/embeddings';
import { loadUrlDocument } from '../../utils/loadDocument';
import { getPineconeIndex } from '../../utils/pinecone';
import { textSplitter } from '../../utils/textSplitter';
import { loadWebDocument } from '../../utils/webLoader';
import { updateDatasourceById } from '../datasource';

export const storeDocument: StoreDocument = async (data) => {
  try {
    let docs: Document[];
    const result: string[] = [];

    const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
      pineconeIndex: getPineconeIndex(),
      maxConcurrency: 5,
    });

    if (data.fileUrl) {
      docs = await loadUrlDocument(data.fileUrl);
      const splitDocs = await textSplitter(docs);
      const mapSplitDocs = splitDocs.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          datasourceId: data.datasourceId,
        },
      }));
      // Split the documents into chunks to avoid exceeding the token limit
      const chunkSize = 10;
      for (let i = 0; i < mapSplitDocs.length; i += chunkSize) {
        const chunk = mapSplitDocs.slice(i, i + chunkSize);
        const chunkIds = chunk.map(() => uuid());
        await vectorStore.addDocuments(chunk, {
          ids: chunkIds,
        });

        result.push(...chunkIds);
      }
    }

    if (data.content) {
      // Split the content into smaller chunks
      const splitDocs = await textSplitter([
        new Document({
          pageContent: data.content,
          metadata: {
            author: 'user',
            datasourceId: data.datasourceId,
          },
        }),
      ]);

      const mapSplitDocs = splitDocs.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          datasourceId: data.datasourceId,
        },
      }));
      // Split the documents into chunks to avoid exceeding the token limit
      const chunkSize = 10;
      for (let i = 0; i < mapSplitDocs.length; i += chunkSize) {
        const chunk = mapSplitDocs.slice(i, i + chunkSize);
        const chunkIds = chunk.map(() => uuid());
        await vectorStore.addDocuments(chunk, {
          ids: chunkIds,
        });

        result.push(...chunkIds);
      }
    }

    if (data.url) {
      docs = await loadWebDocument(data.url);

      const splitDocs = await textSplitter(docs);
      const mapSplitDocs = splitDocs.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          datasourceId: data.datasourceId,
        },
      }));

      const size = mapSplitDocs
        .map((doc) => doc.pageContent.length)
        .reduce((a, b) => a + b, 0);

      await updateDatasourceById(data.datasourceId, {
        agentIds: data.agentIds,
        size,
      });

      // Split the documents into chunks to avoid exceeding the token limit
      const chunkSize = 10;
      for (let i = 0; i < mapSplitDocs.length; i += chunkSize) {
        const chunk = mapSplitDocs.slice(i, i + chunkSize);
        const chunkIds = chunk.map(() => uuid());
        await vectorStore.addDocuments(chunk, {
          ids: chunkIds,
        });

        result.push(...chunkIds);
      }
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
