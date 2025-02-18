import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';

export function getPineconeIndex() {
  try {
    const pinecone = new PineconeClient();
    const index = pinecone.Index(
      'chatbot',
      'https://chatbot-tcamofo.svc.aped-4627-b74a.pinecone.io'
    );
    return index;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
