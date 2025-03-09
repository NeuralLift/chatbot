import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from 'langchain/document';

export async function textSplitter(docs: Document[]) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 0,
    });
    const allSplits = await splitter.splitDocuments(docs);

    return allSplits;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
