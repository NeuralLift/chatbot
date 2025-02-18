import { MistralAIEmbeddings } from '@langchain/mistralai';

export function getEmbeddings() {
  try {
    const embeddings = new MistralAIEmbeddings({
      model: 'mistral-embed',
    });

    return embeddings;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
