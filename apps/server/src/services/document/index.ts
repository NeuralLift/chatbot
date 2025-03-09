import { PineconeStore } from '@langchain/pinecone';
import { Document } from 'langchain/document';
import { v4 as uuid } from 'uuid';

import { StoreDocument } from '../../types/interface/document';
import { getEmbeddings } from '../../utils/embeddings';
import { loadUrlDocument } from '../../utils/loadDocument';
import { getPineconeIndex } from '../../utils/pinecone';
import { textSplitter } from '../../utils/textSplitter';

export const storeDocument: StoreDocument = async (data) => {
  try {
    let docs: Document[];
    let result: string[] = [];

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

      const mapSplitDocsIds = mapSplitDocs.map(() => uuid());
      result = await vectorStore.addDocuments(mapSplitDocs, {
        ids: mapSplitDocsIds,
      });
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

      const mapSplitDocsIds = mapSplitDocs.map(() => uuid());
      result = await vectorStore.addDocuments(mapSplitDocs, {
        ids: mapSplitDocsIds,
      });
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
